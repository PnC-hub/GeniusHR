import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Ottieni suggerimenti AI basati su regole esistenti
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { tenantMembers: true }
    });

    if (!user?.tenantMembers?.[0]?.tenantId) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 });
    }

    const tenantId = user.tenantMembers[0].tenantId;
    const body = await request.json();
    const { module, entityType, entityData } = body;

    if (!module || !entityData) {
      return NextResponse.json({
        error: 'Campi richiesti: module, entityData'
      }, { status: 400 });
    }

    // Recupera regole attive per questo modulo, ordinate per priorità e utilizzo
    const rules = await prisma.aIRule.findMany({
      where: {
        tenantId,
        module,
        isActive: true
      },
      orderBy: [
        { priority: 'desc' },
        { confidence: 'desc' },
        { usageCount: 'desc' }
      ]
    });

    // Valuta quali regole si applicano ai dati forniti
    const suggestions: Array<{
      ruleId: string;
      ruleName: string;
      field: string;
      suggestedValue: any;
      confidence: number;
      reason: string;
    }> = [];

    for (const rule of rules) {
      const match = evaluateRule(rule, entityData);
      if (match.applies) {
        suggestions.push({
          ruleId: rule.id,
          ruleName: rule.name,
          field: match.field,
          suggestedValue: match.value,
          confidence: rule.confidence,
          reason: rule.condition
        });
      }
    }

    // Recupera anche correzioni simili non ancora trasformate in regole
    const recentCorrections = await prisma.trainingCorrection.findMany({
      where: {
        tenantId,
        module,
        applied: true,
        ruleExtracted: { not: null }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Cerca pattern nelle correzioni recenti
    const patternSuggestions = findPatternSuggestions(recentCorrections, entityData);

    return NextResponse.json({
      suggestions: [...suggestions, ...patternSuggestions].slice(0, 5),
      rulesEvaluated: rules.length,
      correctionsAnalyzed: recentCorrections.length
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// Valuta se una regola si applica ai dati forniti
function evaluateRule(rule: any, entityData: Record<string, any>): {
  applies: boolean;
  field: string;
  value: any;
} {
  try {
    // Se la regola ha conditionJson, usa quello per la valutazione
    if (rule.conditionJson) {
      const conditions = typeof rule.conditionJson === 'string'
        ? JSON.parse(rule.conditionJson)
        : rule.conditionJson;

      // Valuta condizioni semplici (field, operator, value)
      if (conditions.field && conditions.operator && conditions.value !== undefined) {
        const entityValue = entityData[conditions.field];
        let matches = false;

        switch (conditions.operator) {
          case 'equals':
            matches = entityValue === conditions.value;
            break;
          case 'contains':
            matches = String(entityValue).toLowerCase().includes(String(conditions.value).toLowerCase());
            break;
          case 'startsWith':
            matches = String(entityValue).toLowerCase().startsWith(String(conditions.value).toLowerCase());
            break;
          case 'greaterThan':
            matches = Number(entityValue) > Number(conditions.value);
            break;
          case 'lessThan':
            matches = Number(entityValue) < Number(conditions.value);
            break;
          case 'isEmpty':
            matches = !entityValue || entityValue === '';
            break;
          case 'isNotEmpty':
            matches = !!entityValue && entityValue !== '';
            break;
        }

        if (matches && rule.actionJson) {
          const action = typeof rule.actionJson === 'string'
            ? JSON.parse(rule.actionJson)
            : rule.actionJson;

          return {
            applies: true,
            field: action.field || conditions.field,
            value: action.value
          };
        }
      }
    }

    // Fallback: valutazione testuale semplice
    const conditionLower = rule.condition.toLowerCase();
    for (const [field, value] of Object.entries(entityData)) {
      if (conditionLower.includes(field.toLowerCase()) &&
          conditionLower.includes(String(value).toLowerCase())) {
        // Estrai il valore suggerito dall'action
        const actionMatch = rule.action.match(/=\s*["']?([^"']+)["']?/);
        if (actionMatch) {
          return {
            applies: true,
            field: field,
            value: actionMatch[1]
          };
        }
      }
    }

    return { applies: false, field: '', value: null };
  } catch (e) {
    return { applies: false, field: '', value: null };
  }
}

// Trova pattern nelle correzioni recenti che potrebbero applicarsi
function findPatternSuggestions(
  corrections: any[],
  entityData: Record<string, any>
): Array<{
  ruleId: string;
  ruleName: string;
  field: string;
  suggestedValue: any;
  confidence: number;
  reason: string;
}> {
  const suggestions: Array<{
    ruleId: string;
    ruleName: string;
    field: string;
    suggestedValue: any;
    confidence: number;
    reason: string;
  }> = [];

  // Raggruppa correzioni per fieldPath
  const correctionsByField: Record<string, any[]> = {};
  for (const c of corrections) {
    if (c.fieldPath) {
      if (!correctionsByField[c.fieldPath]) {
        correctionsByField[c.fieldPath] = [];
      }
      correctionsByField[c.fieldPath].push(c);
    }
  }

  // Per ogni campo con correzioni multiple, suggerisci il valore più frequente
  for (const [field, fieldCorrections] of Object.entries(correctionsByField)) {
    if (fieldCorrections.length >= 2) {
      // Conta i valori corretti
      const valueCounts: Record<string, number> = {};
      for (const c of fieldCorrections) {
        const val = JSON.stringify(c.correctedValue);
        valueCounts[val] = (valueCounts[val] || 0) + 1;
      }

      // Trova il valore più frequente
      let maxCount = 0;
      let mostFrequentValue = null;
      for (const [val, count] of Object.entries(valueCounts)) {
        if (count > maxCount) {
          maxCount = count;
          mostFrequentValue = JSON.parse(val);
        }
      }

      if (maxCount >= 2 && entityData[field] !== mostFrequentValue) {
        suggestions.push({
          ruleId: `pattern-${field}`,
          ruleName: `Pattern rilevato per ${field}`,
          field,
          suggestedValue: mostFrequentValue,
          confidence: Math.min(0.9, 0.5 + (maxCount * 0.1)),
          reason: `Basato su ${maxCount} correzioni simili`
        });
      }
    }
  }

  return suggestions;
}
