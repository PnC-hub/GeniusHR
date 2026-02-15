# Magazzino

La gestione efficiente del magazzino garantisce la disponibilità dei materiali necessari, evitando sia carenze che eccessi di scorte.

## Obiettivi

- Garantire disponibilità materiali per l'attività clinica
- Ottimizzare le scorte evitando sprechi
- Monitorare le scadenze
- Controllare i costi

## Documenti della Sezione

| Documento | Descrizione |
|-----------|-------------|
| [Gestione Ordini](gestione-ordini.md) | Procedura acquisti |
| [Inventario](inventario.md) | Gestione scorte |
| [Scadenze](scadenze.md) | Controllo validità prodotti |
| [Fornitori](fornitori.md) | Gestione rapporti con fornitori |

## Categorie di Materiali

### Materiali di Consumo

| Categoria | Esempi |
|-----------|--------|
| Monouso | Guanti, mascherine, bicchieri |
| Igiene | Paste, fluoro, spazzolini |
| Conservativa | Compositi, adesivi, matrici |
| Endodonzia | Lime, guttaperca, cementi |
| Chirurgia | Suture, garze, membrane |
| Protesi | Materiali da impronta, cementi |

### Strumentario

| Categoria | Esempi |
|-----------|--------|
| Diagnostica | Specchietti, sonde, pinzette |
| Conservativa | Frese, spatole, porta-matrici |
| Chirurgia | Estrattori, sindesmotomi, pinze |
| Endodonzia | Strumenti rotanti, localizzatori |

### Farmaci e Medicinali

| Categoria | Esempi |
|-----------|--------|
| Anestetici | Articaina, mepivacaina |
| Antinfiammatori | FANS |
| Antibiotici | Campioni (se disponibili) |
| Emergenza | Adrenalina, cortisone |

## Flusso di Gestione

```
VERIFICA SCORTE
      │
      ▼
Sotto soglia minima?
      │
     SÌ
      │
      ▼
ORDINE A FORNITORE
      │
      ▼
RICEZIONE MERCE
      │
      ▼
CONTROLLO QUALITÀ
      │
      ▼
STOCCAGGIO
      │
      ▼
UTILIZZO (FIFO)
```

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Assistenti | Segnalazione scorte basse, stoccaggio |
| Coordinatore | Ordini, inventario, fornitori |
| Direzione | Budget, approvazione ordini straordinari |
