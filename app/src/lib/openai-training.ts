import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Tipi per il sistema di training
export interface TrainingMessageInput {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ProcessTrainingInput {
  tenantId: string;
  conversationId: string;
  context: string; // modulo: attendance, payslip, safety, etc.
  contextId?: string;
  contextData?: Record<string, any>;
  messages: TrainingMessageInput[];
  userMessage: string;
}

export interface CorrectionOutput {
  entityType: string;
  entityId?: string;
  originalValue: any;
  correctedValue: any;
  fieldPath?: string;
  ruleExtracted?: string;
}

export interface RuleOutput {
  name: string;
  condition: string;
  conditionJson?: any;
  action: string;
  actionJson?: any;
  priority?: number;
}

export interface ProcessTrainingOutput {
  content: string;
  functionCall?: string;
  functionResult?: any;
  tokens?: number;
  correction?: CorrectionOutput;
  rule?: RuleOutput;
}

// Definizione delle funzioni disponibili per GPT
const trainingFunctions: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'extract_correction',
      description: 'Estrae una correzione dai dati forniti dall\'utente. Usare quando l\'utente indica che un valore è sbagliato e fornisce quello corretto.',
      parameters: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            description: 'Tipo di entità (es: employee, attendance, leave, expense)'
          },
          entityId: {
            type: 'string',
            description: 'ID dell\'entità se disponibile'
          },
          fieldPath: {
            type: 'string',
            description: 'Percorso del campo corretto (es: hours.overtime, status)'
          },
          originalValue: {
            description: 'Valore originale errato'
          },
          correctedValue: {
            description: 'Valore corretto indicato dall\'utente'
          },
          ruleExtracted: {
            type: 'string',
            description: 'Regola generalizzata estratta dalla correzione (es: "Se dipendente=X e giorno=sabato, ore_straordinario=4")'
          }
        },
        required: ['entityType', 'fieldPath', 'originalValue', 'correctedValue']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_rule',
      description: 'Crea una nuova regola di business basata sulle istruzioni dell\'utente. Usare quando l\'utente descrive un pattern o una regola da applicare automaticamente.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Nome descrittivo della regola'
          },
          condition: {
            type: 'string',
            description: 'Condizione in linguaggio naturale (es: "Quando il dipendente lavora di sabato")'
          },
          conditionJson: {
            type: 'object',
            description: 'Condizione strutturata con field, operator, value',
            properties: {
              field: { type: 'string' },
              operator: { type: 'string', enum: ['equals', 'contains', 'startsWith', 'greaterThan', 'lessThan', 'isEmpty', 'isNotEmpty'] },
              value: {}
            }
          },
          action: {
            type: 'string',
            description: 'Azione in linguaggio naturale (es: "Imposta ore straordinario = 4")'
          },
          actionJson: {
            type: 'object',
            description: 'Azione strutturata con field e value',
            properties: {
              field: { type: 'string' },
              value: {}
            }
          },
          priority: {
            type: 'number',
            description: 'Priorità della regola (0-100, default 0)'
          }
        },
        required: ['name', 'condition', 'action']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'query_data',
      description: 'Interroga i dati del sistema per rispondere a domande dell\'utente. Usare quando l\'utente chiede informazioni su dati esistenti.',
      parameters: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            description: 'Tipo di entità da cercare',
            enum: ['employee', 'attendance', 'leave', 'expense', 'payslip', 'safety_training', 'disciplinary']
          },
          filters: {
            type: 'object',
            description: 'Filtri da applicare alla ricerca'
          },
          fields: {
            type: 'array',
            items: { type: 'string' },
            description: 'Campi da restituire'
          }
        },
        required: ['entityType']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'suggest_fix',
      description: 'Suggerisce una correzione rapida per un problema identificato. Usare per proporre fix immediati.',
      parameters: {
        type: 'object',
        properties: {
          entityType: { type: 'string' },
          entityId: { type: 'string' },
          field: { type: 'string' },
          currentValue: {},
          suggestedValue: {},
          reason: { type: 'string' }
        },
        required: ['entityType', 'field', 'suggestedValue', 'reason']
      }
    }
  }
];

// System prompt per il training
function getSystemPrompt(context: string, contextData?: Record<string, any>): string {
  const moduleDescriptions: Record<string, string> = {
    attendance: 'gestione presenze e timbrature dei dipendenti',
    payslip: 'gestione cedolini e buste paga',
    safety: 'formazione sicurezza sul lavoro D.Lgs 81/08',
    onboarding: 'processo di onboarding nuovi dipendenti',
    leaves: 'gestione ferie, permessi e assenze',
    expenses: 'gestione note spese e rimborsi',
    disciplinary: 'procedure disciplinari ex Art. 7 L. 300/1970'
  };

  const moduleDesc = moduleDescriptions[context] || context;

  let systemPrompt = `Sei un assistente AI specializzato nella ${moduleDesc} per studi dentistici italiani.

Il tuo ruolo è:
1. Rispondere alle domande dell'utente in modo chiaro e professionale
2. Identificare correzioni ai dati quando l'utente segnala errori
3. Estrarre regole di business dalle istruzioni dell'utente
4. Suggerire miglioramenti basati sui pattern rilevati

Regole importanti:
- Rispondi sempre in italiano
- Sii conciso ma completo
- Se rilevi una correzione, usa la funzione extract_correction
- Se l'utente descrive una regola da applicare, usa create_rule
- Se devi cercare dati, usa query_data
- Per suggerire fix rapidi, usa suggest_fix

Contesto attuale: ${moduleDesc}`;

  if (contextData) {
    systemPrompt += `\n\nDati di contesto:\n${JSON.stringify(contextData, null, 2)}`;
  }

  return systemPrompt;
}

// Esegue le funzioni chiamate dall'AI
async function executeFunctionCall(
  name: string,
  args: any,
  tenantId: string
): Promise<any> {
  switch (name) {
    case 'query_data':
      return await queryData(args, tenantId);
    case 'extract_correction':
      return { extracted: true, ...args };
    case 'create_rule':
      return { created: true, ...args };
    case 'suggest_fix':
      return { suggested: true, ...args };
    default:
      return { error: 'Funzione non riconosciuta' };
  }
}

// Query dati dal database
async function queryData(
  args: { entityType: string; filters?: any; fields?: string[] },
  tenantId: string
): Promise<any> {
  const { entityType, filters = {}, fields } = args;

  try {
    switch (entityType) {
      case 'employee':
        const employees = await prisma.employee.findMany({
          where: { tenantId, ...filters },
          select: fields ? Object.fromEntries(fields.map(f => [f, true])) : undefined,
          take: 10
        });
        return { count: employees.length, data: employees };

      case 'attendance':
        // Assumendo che esista un modello Attendance
        return { message: 'Query attendance non ancora implementata', filters };

      case 'leave':
        const leaves = await prisma.leaveRequest.findMany({
          where: { employee: { tenantId }, ...filters },
          take: 10
        });
        return { count: leaves.length, data: leaves };

      case 'expense':
        const expenses = await prisma.expense.findMany({
          where: { employee: { tenantId }, ...filters },
          take: 10
        });
        return { count: expenses.length, data: expenses };

      default:
        return { error: `Tipo entità ${entityType} non supportato` };
    }
  } catch (error) {
    console.error('Query data error:', error);
    return { error: 'Errore nella query' };
  }
}

// Funzione principale per processare un messaggio di training
export async function processTrainingMessage(
  input: ProcessTrainingInput
): Promise<ProcessTrainingOutput> {
  const { tenantId, conversationId, context, contextId, contextData, messages, userMessage } = input;

  // Carica regole esistenti per contesto
  const existingRules = await prisma.aIRule.findMany({
    where: { tenantId, module: context, isActive: true },
    orderBy: { priority: 'desc' },
    take: 5
  });

  // Costruisci contesto con regole
  let enhancedContextData = { ...contextData };
  if (existingRules.length > 0) {
    enhancedContextData = {
      ...enhancedContextData,
      existingRules: existingRules.map(r => ({
        name: r.name,
        condition: r.condition,
        action: r.action
      }))
    };
  }

  // Prepara messaggi per OpenAI
  const systemMessage: OpenAI.Chat.ChatCompletionMessageParam = {
    role: 'system',
    content: getSystemPrompt(context, enhancedContextData)
  };

  const conversationMessages: OpenAI.Chat.ChatCompletionMessageParam[] = messages.map(m => ({
    role: m.role as 'user' | 'assistant' | 'system',
    content: m.content
  }));

  const allMessages = [systemMessage, ...conversationMessages];

  try {
    // Prima chiamata a GPT
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: allMessages,
      tools: trainingFunctions,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 1000
    });

    const choice = response.choices[0];
    const message = choice.message;

    let output: ProcessTrainingOutput = {
      content: message.content || '',
      tokens: response.usage?.total_tokens
    };

    // Gestisci function calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      output.functionCall = functionName;

      // Esegui la funzione
      const functionResult = await executeFunctionCall(functionName, functionArgs, tenantId);
      output.functionResult = functionResult;

      // Estrai correzione o regola se applicabile
      if (functionName === 'extract_correction') {
        output.correction = {
          entityType: functionArgs.entityType,
          entityId: functionArgs.entityId,
          originalValue: functionArgs.originalValue,
          correctedValue: functionArgs.correctedValue,
          fieldPath: functionArgs.fieldPath,
          ruleExtracted: functionArgs.ruleExtracted
        };
      } else if (functionName === 'create_rule') {
        output.rule = {
          name: functionArgs.name,
          condition: functionArgs.condition,
          conditionJson: functionArgs.conditionJson,
          action: functionArgs.action,
          actionJson: functionArgs.actionJson,
          priority: functionArgs.priority
        };
      }

      // Seconda chiamata per ottenere risposta finale con risultato funzione
      const followUpMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...allMessages,
        message as OpenAI.Chat.ChatCompletionMessageParam,
        {
          role: 'tool' as const,
          tool_call_id: toolCall.id,
          content: JSON.stringify(functionResult)
        }
      ];

      const followUpResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: followUpMessages,
        temperature: 0.7,
        max_tokens: 500
      });

      output.content = followUpResponse.choices[0].message.content || output.content;
      output.tokens = (output.tokens || 0) + (followUpResponse.usage?.total_tokens || 0);
    }

    return output;
  } catch (error) {
    console.error('OpenAI training error:', error);
    throw error;
  }
}

// Funzione per applicare automaticamente regole a nuovi dati
export async function applyRulesToData(
  tenantId: string,
  module: string,
  entityType: string,
  entityId: string,
  data: Record<string, any>
): Promise<{
  modified: boolean;
  changes: Array<{ field: string; from: any; to: any; rule: string }>;
  appliedRules: string[];
}> {
  const rules = await prisma.aIRule.findMany({
    where: { tenantId, module, isActive: true },
    orderBy: [{ priority: 'desc' }, { confidence: 'desc' }]
  });

  const changes: Array<{ field: string; from: any; to: any; rule: string }> = [];
  const appliedRules: string[] = [];
  let modifiedData = { ...data };

  for (const rule of rules) {
    try {
      // Valuta condizione
      let conditionMet = false;

      if (rule.conditionJson) {
        const condition = typeof rule.conditionJson === 'string'
          ? JSON.parse(rule.conditionJson)
          : rule.conditionJson;

        const fieldValue = modifiedData[condition.field];

        switch (condition.operator) {
          case 'equals':
            conditionMet = fieldValue === condition.value;
            break;
          case 'contains':
            conditionMet = String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
            break;
          case 'greaterThan':
            conditionMet = Number(fieldValue) > Number(condition.value);
            break;
          case 'lessThan':
            conditionMet = Number(fieldValue) < Number(condition.value);
            break;
          case 'isEmpty':
            conditionMet = !fieldValue || fieldValue === '';
            break;
          case 'isNotEmpty':
            conditionMet = !!fieldValue && fieldValue !== '';
            break;
        }
      }

      // Applica azione se condizione soddisfatta
      if (conditionMet && rule.actionJson) {
        const action = typeof rule.actionJson === 'string'
          ? JSON.parse(rule.actionJson)
          : rule.actionJson;

        if (action.field && action.value !== undefined) {
          const oldValue = modifiedData[action.field];
          modifiedData[action.field] = action.value;

          changes.push({
            field: action.field,
            from: oldValue,
            to: action.value,
            rule: rule.name
          });

          appliedRules.push(rule.id);

          // Registra applicazione regola
          await prisma.aIRuleApplication.create({
            data: {
              ruleId: rule.id,
              entityType,
              entityId,
              inputData: data,
              outputData: { [action.field]: action.value },
              success: true
            }
          });

          // Incrementa contatori
          await prisma.aIRule.update({
            where: { id: rule.id },
            data: {
              usageCount: { increment: 1 },
              successCount: { increment: 1 },
              lastUsedAt: new Date()
            }
          });
        }
      }
    } catch (error) {
      console.error(`Error applying rule ${rule.id}:`, error);
    }
  }

  return {
    modified: changes.length > 0,
    changes,
    appliedRules
  };
}

// Funzione per apprendere da una correzione manuale
export async function learnFromCorrection(
  correctionId: string,
  tenantId: string
): Promise<{ ruleCreated: boolean; ruleId?: string }> {
  const correction = await prisma.trainingCorrection.findFirst({
    where: { id: correctionId, tenantId }
  });

  if (!correction || !correction.ruleExtracted) {
    return { ruleCreated: false };
  }

  // Cerca regole simili esistenti
  const similarRules = await prisma.aIRule.findMany({
    where: {
      tenantId,
      module: correction.module,
      condition: { contains: correction.fieldPath || '' }
    }
  });

  // Se esiste già una regola simile, incrementa confidence
  if (similarRules.length > 0) {
    await prisma.aIRule.update({
      where: { id: similarRules[0].id },
      data: {
        confidence: { increment: 0.05 },
        usageCount: { increment: 1 }
      }
    });
    return { ruleCreated: false, ruleId: similarRules[0].id };
  }

  // Altrimenti crea nuova regola
  const newRule = await prisma.aIRule.create({
    data: {
      tenantId,
      module: correction.module,
      name: `Regola auto da correzione ${correction.fieldPath || correction.module}`,
      condition: correction.ruleExtracted,
      action: `Imposta ${correction.fieldPath || 'valore'} = ${JSON.stringify(correction.correctedValue)}`,
      confidence: 0.6,
      sourceConversationId: correction.conversationId
    }
  });

  // Marca correzione come usata per regola
  await prisma.trainingCorrection.update({
    where: { id: correctionId },
    data: { applied: true, appliedAt: new Date() }
  });

  return { ruleCreated: true, ruleId: newRule.id };
}
