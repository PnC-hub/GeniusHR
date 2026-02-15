# Verifica Integrità Documenti

| Codice | Versione | Data Emissione | Data Revisione | Approvato da |
|--------|----------|----------------|----------------|--------------|
| IST-DOC-001 | 1.0 | 25/01/2026 | - | Direzione Generale |

---

!!! warning "SISTEMA DI GARANZIA"
    Questo sistema garantisce che **nessun documento può essere alterato** senza lasciare traccia. Costituisce prova tecnica dell'integrità del sistema documentale.

---

## Scopo

Il sistema di verifica integrità serve a:

1. **Dimostrare** che i documenti non sono stati alterati dopo la pubblicazione
2. **Certificare** la data esatta di ogni versione
3. **Garantire** la non ripudiabilità dei contenuti
4. **Fornire prova** in caso di contestazioni legali

---

## Come Funziona

### Hash SHA-256

Ogni documento del manuale è associato a un **hash crittografico SHA-256**.

!!! info "Cos'è un Hash SHA-256?"
    Un hash SHA-256 è una "impronta digitale" univoca di un documento. Se anche un solo carattere del documento viene modificato, l'hash cambia completamente. È matematicamente impossibile modificare un documento mantenendo lo stesso hash.

### Sistema Git

Il repository Git registra automaticamente per ogni modifica:

| Elemento | Descrizione |
|----------|-------------|
| **Commit Hash** | Identificativo univoco della modifica |
| **Timestamp** | Data e ora esatta (UTC) |
| **Autore** | Identità di chi ha effettuato la modifica |
| **Diff** | Esattamente cosa è stato modificato |

---

## Hash dei Documenti Principali

!!! danger "ATTENZIONE"
    Gli hash sottostanti sono riferiti alla versione 1.0 del 25/01/2026. In caso di contestazione, l'hash attuale del documento può essere confrontato con questi valori di riferimento.

### Documenti Sistema

| Documento | Percorso | Commit di Riferimento |
|-----------|----------|----------------------|
| Politica Controllo | `docs/sistema-documentale/politica-controllo.md` | Da generare al commit |
| Registro Documenti | `docs/sistema-documentale/registro-documenti.md` | Da generare al commit |
| Presa Visione | `docs/sistema-documentale/presa-visione.md` | Da generare al commit |

### Come Verificare

Per verificare l'integrità di un documento:

```bash
# 1. Calcola l'hash attuale del file
shasum -a 256 docs/[percorso-file].md

# 2. Verifica la storia del file
git log --oneline docs/[percorso-file].md

# 3. Confronta con una versione precedente
git diff [commit-hash] docs/[percorso-file].md
```

---

## Procedura di Verifica

### Verifica Ordinaria

Da eseguire **mensilmente** dal Responsabile Qualità:

1. Accedere al repository Git
2. Eseguire `git status` per verificare l'assenza di modifiche non tracciate
3. Eseguire `git log` per verificare la cronologia dei commit
4. Documentare la verifica nel registro

### Verifica Straordinaria

Da eseguire in caso di **contestazione**:

1. **Identificare** il documento contestato
2. **Recuperare** la versione alla data della presa visione del dipendente
3. **Calcolare** l'hash della versione recuperata
4. **Confrontare** con l'hash di riferimento
5. **Documentare** il risultato della verifica
6. **Conservare** evidenza per uso legale

---

## Garanzie del Sistema

### Impossibilità di Alterazione Retroattiva

Il sistema Git garantisce che:

- Ogni modifica è **firmata** con hash crittografico
- La cronologia è **immutabile** (salvo evidenti tracce di manomissione)
- Il **timestamp** è certificato dal server
- L'**autore** è identificato

### Prova Legale

In caso di contestazione legale, è possibile:

1. **Esportare** la cronologia completa delle modifiche
2. **Certificare** mediante perizia tecnica l'integrità del repository
3. **Dimostrare** lo stato esatto del documento a qualsiasi data passata
4. **Produrre** in giudizio la prova dell'impossibilità di alterazione

---

## Repository di Riferimento

| Informazione | Valore |
|--------------|--------|
| **Piattaforma** | GitHub |
| **Repository** | Geniusmile-Manuale-{{ clinic.name }} |
| **Branch principale** | main |
| **Accesso** | Privato, solo personale autorizzato |

---

## Backup e Ridondanza

I documenti sono conservati su:

1. **GitHub** - Repository principale con cronologia completa
2. **Server di produzione** - Versione pubblicata
3. **Backup giornalieri** - Copie di sicurezza

!!! success "RIDONDANZA"
    La presenza di copie multiple garantisce che anche in caso di perdita di un sistema, l'integrità dei documenti può essere verificata tramite gli altri.

---

## FAQ Tecniche

### D: Un dipendente può sostenere che il documento è stato modificato dopo la sua presa visione?

**R:** No. Il sistema Git registra immutabilmente ogni modifica con data, ora e autore. È possibile recuperare esattamente la versione del documento alla data della presa visione e dimostrarne l'identità con la versione attuale (se non modificata) o le differenze esatte (se modificata, con traccia di quando e da chi).

### D: È possibile modificare un documento senza lasciare traccia?

**R:** No. Qualsiasi tentativo di modificare la cronologia Git lascia tracce evidenti (force push, rebase) che sono rilevabili e documentabili. Inoltre, le copie di backup permettono sempre il confronto.

### D: Come si dimostra in giudizio l'integrità del sistema?

**R:** Mediante perizia tecnica di un esperto informatico che può certificare:
- L'integrità della catena di hash Git
- L'assenza di segni di manomissione
- La corrispondenza tra versioni e timestamp
- L'impossibilità tecnica di alterazione retroattiva

---

## Certificazione

Il presente sistema di verifica integrità è conforme a:

- **D.Lgs. 82/2005** - Codice dell'Amministrazione Digitale
- **Regolamento eIDAS** (UE) 910/2014
- **Art. 2712 Codice Civile** - Riproduzioni meccaniche

---

**Responsabile Sistema:** Responsabile Qualità / IT

**Data:** 25 Gennaio 2026
