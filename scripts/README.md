# GeniusHR Scripts

Collection of utility scripts for GeniusHR database management and automation.

## 📁 Scripts Overview

| Script | Language | Description |
|--------|----------|-------------|
| `backup-database.ts` | TypeScript | Main backup script with verification and cleanup |
| `backup-cron.sh` | Bash | Wrapper for automated cron execution |
| `restore-database.sh` | Bash | Interactive database restore with safety checks |

## 🚀 Quick Start

### 1. Backup manuale

```bash
cd ../app
npm run backup
```

### 2. Lista backup

```bash
npm run backup:list
```

### 3. Ripristino

```bash
cd ../scripts
./restore-database.sh latest
```

## 📖 Detailed Documentation

See [BACKUP-GUIDE.md](../BACKUP-GUIDE.md) for complete documentation.

## 🔧 Configuration Files

- `.env.backup.example` - Template for backup configuration
- Add variables to `../app/.env`

## 📦 Required Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
BACKUP_DIR="/var/backups/geniushr"
BACKUP_RETENTION_DAYS=30
BACKUP_NOTIFY_EMAIL="admin@geniushr.it"
```

## ⚡ Available Commands

From `app/` directory:

```bash
npm run backup          # Full backup with verification
npm run backup:verify   # Verify last backup integrity
npm run backup:cleanup  # Remove old backups
npm run backup:list     # List all available backups
```

## 🔄 Automation

Add to crontab for daily backups at 2 AM:

```bash
crontab -e
# Add: 0 2 * * * /path/to/GeniusHR/scripts/backup-cron.sh
```

## 📊 File Naming Convention

Backup files follow this pattern:

```
geniushr-backup-YYYYMMDD-HHmmss.sql.gz
```

Example: `geniushr-backup-20260214-143022.sql.gz`

## 🔐 Security Notes

- Backup files contain sensitive data
- Keep `BACKUP_DIR` permissions restricted (700)
- Store offsite copies for disaster recovery
- Test restore procedures regularly

## 🛠️ Maintenance

### Clean old logs

```bash
find ../logs -name "backup-*.log" -mtime +30 -delete
```

### Monitor disk usage

```bash
du -sh $BACKUP_DIR
```

### Test backup integrity

```bash
gunzip -t $BACKUP_DIR/geniushr-backup-*.sql.gz
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| `pg_dump: command not found` | Install PostgreSQL client tools |
| Permission denied | Check directory ownership and permissions |
| Backup corrupted | Delete and re-run backup |
| Out of space | Reduce RETENTION_DAYS or cleanup old files |

## 📝 Logs Location

- Backup logs: `../logs/backup-YYYYMMDD.log`
- Cron execution logs: Check system log viewer

---

For detailed setup instructions and advanced configuration, see [BACKUP-GUIDE.md](../BACKUP-GUIDE.md).
