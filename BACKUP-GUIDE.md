# GeniusHR - Database Backup & Restore Guide

Sistema completo di backup automatico per il database PostgreSQL di GeniusHR.

## 📋 Indice

1. [Panoramica](#panoramica)
2. [Installazione](#installazione)
3. [Configurazione](#configurazione)
4. [Utilizzo](#utilizzo)
5. [Automazione](#automazione)
6. [Ripristino](#ripristino)
7. [Troubleshooting](#troubleshooting)

## 🎯 Panoramica

Il sistema di backup fornisce:

- ✅ **Backup automatici giornalieri** via cron
- ✅ **Compressione gzip** per risparmiare spazio
- ✅ **Retention policy** configurabile (default: 30 giorni)
- ✅ **Verifica integrità** automatica post-backup
- ✅ **Pulizia automatica** backup obsoleti
- ✅ **Logging completo** di tutte le operazioni
- ✅ **Notifiche email** (opzionale) per fallimenti
- ✅ **Backup pre-ripristino** automatico per sicurezza

## 🚀 Installazione

### 1. Prerequisiti

Assicurati di avere installato:

```bash
# PostgreSQL client tools
pg_dump --version  # Deve essere installato

# Node.js e npm
node --version     # v18+ consigliato
npm --version
```

### 2. Configurazione ambiente

Copia il file di esempio e configuralo:

```bash
cd ~/Documents/GitHub/GeniusHR
cp scripts/.env.backup.example app/.env.backup

# Modifica app/.env aggiungendo le variabili di backup
nano app/.env
```

Aggiungi al file `.env`:

```env
# Backup Configuration
BACKUP_DIR=/var/backups/geniushr
BACKUP_RETENTION_DAYS=30
BACKUP_NOTIFY_EMAIL=admin@geniushr.it
```

### 3. Crea directory backup

```bash
# Crea la directory di destinazione backup
sudo mkdir -p /var/backups/geniushr
sudo chown $USER:$USER /var/backups/geniushr
chmod 700 /var/backups/geniushr
```

### 4. Rendi eseguibili gli script

```bash
cd ~/Documents/GitHub/GeniusHR/scripts
chmod +x backup-cron.sh
chmod +x restore-database.sh
```

## ⚙️ Configurazione

### Variabili d'ambiente

| Variabile | Default | Descrizione |
|-----------|---------|-------------|
| `DATABASE_URL` | - | **Richiesto**. Connection string PostgreSQL |
| `BACKUP_DIR` | `../backups` | Directory destinazione backup |
| `BACKUP_RETENTION_DAYS` | `30` | Giorni di retention dei backup |
| `BACKUP_NOTIFY_EMAIL` | - | Email per notifiche (opzionale) |

### Esempio DATABASE_URL

```env
DATABASE_URL="postgresql://geniushr:password@localhost:5432/geniushr_prod"
```

## 📦 Utilizzo

### Backup manuale

```bash
cd ~/Documents/GitHub/GeniusHR/app

# Esegui backup completo
npm run backup

# Verifica ultimo backup
npm run backup:verify

# Lista tutti i backup
npm run backup:list

# Pulisci backup vecchi
npm run backup:cleanup
```

### Output esempio

```
Starting database backup...
Database: geniushr_prod
Host: localhost:5432
Output: /var/backups/geniushr/geniushr-backup-20260214-120000.sql.gz
✓ Backup completed successfully
  File: geniushr-backup-20260214-120000.sql.gz
  Size: 45.23 MB
✓ Backup verification passed
Cleaning backups older than 30 days...
  Deleted: geniushr-backup-20260114-120000.sql.gz
✓ Cleaned 1 old backup(s)

✓ Operation completed successfully
```

## ⏰ Automazione

### Configurazione Cron

Per backup automatici giornalieri:

```bash
# Apri crontab
crontab -e

# Aggiungi questa riga per backup alle 2 AM ogni giorno
0 2 * * * /Users/piernatalecivero/Documents/GitHub/GeniusHR/scripts/backup-cron.sh
```

### Altri schedule utili

```bash
# Ogni 6 ore
0 */6 * * * /path/to/backup-cron.sh

# Ogni domenica alle 2 AM
0 2 * * 0 /path/to/backup-cron.sh

# Ogni giorno alle 2 AM e 14 PM
0 2,14 * * * /path/to/backup-cron.sh
```

### Verifica cron

```bash
# Lista cron jobs attivi
crontab -l

# Controlla log cron (macOS)
log show --predicate 'eventMessage contains "cron"' --last 1h

# Controlla log backup
tail -f ~/Documents/GitHub/GeniusHR/logs/backup-$(date +%Y%m%d).log
```

## 🔄 Ripristino

### Ripristino da backup

```bash
cd ~/Documents/GitHub/GeniusHR/scripts

# Ripristina l'ultimo backup
./restore-database.sh latest

# Ripristina un backup specifico
./restore-database.sh /var/backups/geniushr/geniushr-backup-20260214-120000.sql.gz
```

### Processo di ripristino

Lo script esegue automaticamente:

1. ✅ Verifica integrità del file di backup
2. ✅ Mostra dettagli e chiede conferma
3. ✅ Crea backup pre-ripristino automatico
4. ✅ Esegue il ripristino
5. ✅ Applica migrazioni Prisma se necessarie

### Output esempio

```
[INFO] Loading environment from .env
[INFO] Finding latest backup...
[INFO] Latest backup: geniushr-backup-20260214-120000.sql.gz
[INFO] Verifying backup integrity...
[INFO] Backup verification passed
[WARN] =========================================
[WARN] WARNING: This will REPLACE the current database!
[WARN] Database: geniushr_prod
[WARN] Host: localhost:5432
[WARN] Backup: geniushr-backup-20260214-120000.sql.gz
[WARN] =========================================

Are you sure you want to continue? (yes/no): yes

[INFO] Creating pre-restore backup...
[INFO] Pre-restore backup saved: pre-restore-20260214-130000.sql.gz
[INFO] Starting database restore...
[INFO] This may take several minutes...
[INFO] ✓ Database restored successfully
[INFO] Running Prisma migrations...
[INFO] ✓ All operations completed successfully
```

## 📊 Monitoraggio

### Dimensione backup

```bash
# Spazio totale occupato dai backup
du -sh /var/backups/geniushr

# Lista backup per dimensione
ls -lh /var/backups/geniushr/geniushr-backup-*.sql.gz
```

### Log

I log vengono salvati in `logs/backup-YYYYMMDD.log`:

```bash
# Log di oggi
tail -f ~/Documents/GitHub/GeniusHR/logs/backup-$(date +%Y%m%d).log

# Tutti i log di backup
ls -lh ~/Documents/GitHub/GeniusHR/logs/backup-*.log

# Cerca errori nei log
grep -i error ~/Documents/GitHub/GeniusHR/logs/backup-*.log
```

## 🔧 Troubleshooting

### Problema: pg_dump command not found

```bash
# Installa PostgreSQL client
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Verifica installazione
which pg_dump
```

### Problema: Permission denied su directory backup

```bash
# Assegna permessi corretti
sudo chown -R $USER:$USER /var/backups/geniushr
chmod -R 700 /var/backups/geniushr
```

### Problema: Backup verification failed

```bash
# Test manuale integrità gzip
gunzip -t /var/backups/geniushr/geniushr-backup-*.sql.gz

# Se corrotto, elimina e ri-esegui backup
rm /var/backups/geniushr/geniushr-backup-CORRUPTED.sql.gz
npm run backup
```

### Problema: Out of disk space

```bash
# Verifica spazio disco
df -h /var/backups/geniushr

# Riduci retention period
# In .env:
BACKUP_RETENTION_DAYS=7

# Esegui cleanup manuale
npm run backup:cleanup
```

### Problema: Cron job non eseguito

```bash
# Verifica sintassi cron
crontab -l

# Verifica path assoluti nello script
which ts-node
which npm

# Test manuale dello script cron
/Users/piernatalecivero/Documents/GitHub/GeniusHR/scripts/backup-cron.sh

# Controlla log di sistema
tail -f /var/log/system.log  # macOS
```

### Problema: DATABASE_URL non trovato

```bash
# Verifica .env
cat ~/Documents/GitHub/GeniusHR/app/.env | grep DATABASE_URL

# Assicurati che lo script cron carichi il .env corretto
# Controlla il path in backup-cron.sh
```

## 🔐 Sicurezza

### Best Practices

1. **Proteggi i backup**
   ```bash
   chmod 600 /var/backups/geniushr/*.sql.gz
   ```

2. **Backup offsite** (consigliato)
   - Sincronizza su S3/Dropbox/Google Drive
   - Usa rsync per backup remoti
   - Cripta prima del trasferimento

3. **Test regolari di ripristino**
   ```bash
   # Almeno una volta al mese, testa il ripristino su DB di test
   DATABASE_URL="postgresql://test:pass@localhost:5432/test_db" \
   ./restore-database.sh latest
   ```

4. **Monitora dimensioni**
   - Imposta alert se i backup crescono troppo
   - Verifica che la retention sia appropriata

### Backup offsite con rsync

```bash
# Esempio: sincronizza su server remoto
rsync -avz --delete \
  /var/backups/geniushr/ \
  backup-server:/backups/geniushr/
```

## 📝 Manutenzione

### Checklist mensile

- [ ] Verifica che i backup vengano creati regolarmente
- [ ] Controlla dimensione totale backup
- [ ] Testa ripristino su DB di sviluppo
- [ ] Verifica log per errori
- [ ] Conferma che vecchi backup vengano eliminati

### Comandi utili

```bash
# Status backup recenti
npm run backup:list | head -10

# Spazio totale
du -sh /var/backups/geniushr

# Ultimo backup
ls -lt /var/backups/geniushr | head -2

# Log errori
grep ERROR logs/backup-*.log
```

## 🆘 Supporto

Per problemi o domande:

1. Controlla i log in `logs/backup-*.log`
2. Verifica le configurazioni in `.env`
3. Consulta questa guida
4. Contatta il team DevOps

---

**Ultima revisione:** 2026-02-14
**Versione:** 1.0.0
