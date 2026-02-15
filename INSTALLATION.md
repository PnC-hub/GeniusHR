# GeniusHR - Installation Guide

Guida completa all'installazione e configurazione di GeniusHR.

## 📋 Prerequisiti

### Software Richiesto

#### 1. Node.js (v18+)

```bash
# Verifica versione
node --version

# Installazione (se necessario)
# macOS
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. PostgreSQL

```bash
# Verifica installazione
psql --version

# Installazione client + server
# macOS
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Verifica servizio
pg_isready
```

#### 3. Git

```bash
# Verifica
git --version

# Installazione
brew install git          # macOS
sudo apt-get install git  # Ubuntu
```

## 🚀 Installazione

### 1. Clone Repository

```bash
cd ~/Documents/GitHub
git clone <repository-url> GeniusHR
cd GeniusHR
```

### 2. Install Dependencies

```bash
cd app
npm install

# Verifica ts-node
npx ts-node --version
```

### 3. Database Setup

#### Crea Database

```bash
# Accedi a PostgreSQL
psql postgres

# Crea utente e database
CREATE USER geniushr WITH PASSWORD 'your_secure_password';
CREATE DATABASE geniushr_dev OWNER geniushr;
GRANT ALL PRIVILEGES ON DATABASE geniushr_dev TO geniushr;

# Esci
\q
```

#### Configura .env

```bash
cd ~/Documents/GitHub/GeniusHR/app
cp .env.example .env
nano .env
```

Aggiungi:

```env
# Database
DATABASE_URL="postgresql://geniushr:your_secure_password@localhost:5432/geniushr_dev"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Backup Configuration
BACKUP_DIR="/var/backups/geniushr"
BACKUP_RETENTION_DAYS=30
BACKUP_NOTIFY_EMAIL="admin@geniushr.it"
```

#### Genera NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

#### Applica Migrations

```bash
cd ~/Documents/GitHub/GeniusHR/app
npx prisma migrate dev
```

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

### 5. Configure Backup System

#### Crea Directory Backup

```bash
sudo mkdir -p /var/backups/geniushr
sudo chown $USER:$USER /var/backups/geniushr
chmod 700 /var/backups/geniushr
```

#### Rendi Eseguibili gli Script

```bash
cd ~/Documents/GitHub/GeniusHR/scripts
chmod +x backup-cron.sh
chmod +x restore-database.sh
chmod +x test-backup.sh
```

#### Test Sistema Backup

```bash
./test-backup.sh
```

### 6. Setup Automated Backups (Optional)

```bash
# Apri crontab
crontab -e

# Aggiungi (backup giornaliero alle 2 AM)
0 2 * * * /Users/piernatalecivero/Documents/GitHub/GeniusHR/scripts/backup-cron.sh
```

## ✅ Verifica Installazione

### Test Applicazione

```bash
cd ~/Documents/GitHub/GeniusHR/app
npm run dev
```

Apri browser: http://localhost:3000

### Test Database

```bash
npm run db:studio
```

Apri browser: http://localhost:5555

### Test Backup

```bash
cd app
npm run backup
npm run backup:list
```

## 🔧 Troubleshooting

### PostgreSQL non si avvia

```bash
# macOS
brew services restart postgresql@16

# Ubuntu
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

### Errore connessione database

```bash
# Verifica che PostgreSQL sia in ascolto
psql -h localhost -U geniushr -d geniushr_dev

# Verifica DATABASE_URL in .env
cat app/.env | grep DATABASE_URL

# Test connessione
cd app
npx prisma db pull
```

### ts-node non trovato

```bash
cd app
npm install --save-dev ts-node typescript @types/node
npx ts-node --version
```

### Permission denied su backup directory

```bash
# Assegna permessi corretti
sudo chown -R $USER:$USER /var/backups/geniushr
chmod -R 700 /var/backups/geniushr
```

### pg_dump command not found

```bash
# Installa PostgreSQL client
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Verifica PATH
which pg_dump
echo $PATH
```

## 📚 Next Steps

Dopo l'installazione:

1. ✅ Leggi [README.md](README.md) per panoramica progetto
2. ✅ Consulta [BACKUP-GUIDE.md](BACKUP-GUIDE.md) per backup avanzato
3. ✅ Controlla [PRD.md](PRD.md) per specifiche funzionali
4. ✅ Setup ambiente di produzione (vedi sotto)

## 🌐 Production Setup

### Database di Produzione

```bash
# Crea database produzione
psql postgres
CREATE DATABASE geniushr_prod OWNER geniushr;
\q

# Configura .env.production
DATABASE_URL="postgresql://geniushr:secure_pass@prod-host:5432/geniushr_prod"
```

### Deploy

```bash
# Build
cd app
npm run build

# Start
npm run start
```

### Backup di Produzione

```bash
# Setup cron per produzione
0 2,14 * * * /var/www/GeniusHR/scripts/backup-cron.sh

# Test backup
cd app
npm run backup
```

## 🔐 Sicurezza

### Checklist Produzione

- [ ] Cambia password database
- [ ] Genera nuovo NEXTAUTH_SECRET
- [ ] Configura HTTPS
- [ ] Setup firewall (solo porte 80, 443, 22)
- [ ] Backup automatici attivi
- [ ] Backup offsite configurati
- [ ] Monitoring attivo
- [ ] Log rotation configurato

### Hardening PostgreSQL

```bash
# Modifica pg_hba.conf
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Usa md5 invece di trust
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5

# Restart
sudo systemctl restart postgresql
```

## 📞 Support

Per supporto tecnico:

- Email: dev@geniushr.it
- Docs: [BACKUP-GUIDE.md](BACKUP-GUIDE.md)
- Issues: GitHub Issues

---

**Ultima revisione:** 2026-02-14
**Versione:** 1.0.0
