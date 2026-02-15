# GeniusHR

Sistema HR completo per la gestione delle risorse umane.

## 🚀 Quick Start

```bash
# Install dependencies
cd app
npm install

# Setup database
npx prisma migrate dev

# Run development server
npm run dev
```

## 📦 Project Structure

```
GeniusHR/
├── app/                    # Next.js application
│   ├── src/               # Source code
│   ├── prisma/            # Database schema and migrations
│   └── package.json       # Dependencies and scripts
├── scripts/               # Automation scripts
│   ├── backup-database.ts # Main backup script
│   ├── backup-cron.sh    # Cron automation
│   ├── restore-database.sh # Database restore
│   └── test-backup.sh    # Test backup system
├── backups/              # Database backups (gitignored)
├── logs/                 # Application logs (gitignored)
└── docs/                 # Documentation
```

## 💾 Database Backup & Restore

GeniusHR includes a complete automated backup system.

### Quick Backup

```bash
cd app
npm run backup              # Full backup
npm run backup:list         # List all backups
npm run backup:verify       # Verify last backup
```

### Quick Restore

```bash
cd scripts
./restore-database.sh latest
```

### Setup Automated Backups

```bash
# Add to crontab for daily backups at 2 AM
crontab -e
# Add: 0 2 * * * /path/to/GeniusHR/scripts/backup-cron.sh
```

📖 **Full Documentation:** [BACKUP-GUIDE.md](BACKUP-GUIDE.md)

## 🔧 Available Scripts

### Application

```bash
npm run dev           # Development server
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run linter
```

### Database

```bash
npm run db:push       # Push schema changes
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed database
```

### Backup

```bash
npm run backup              # Create backup
npm run backup:verify       # Verify backup
npm run backup:cleanup      # Clean old backups
npm run backup:list         # List backups
```

## 🔐 Environment Variables

Create `app/.env` with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/geniushr"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Backup (optional)
BACKUP_DIR="/var/backups/geniushr"
BACKUP_RETENTION_DAYS=30
BACKUP_NOTIFY_EMAIL="admin@geniushr.it"
```

## 📚 Documentation

- [BACKUP-GUIDE.md](BACKUP-GUIDE.md) - Complete backup & restore guide
- [scripts/README.md](scripts/README.md) - Scripts documentation
- [PRD.md](PRD.md) - Product Requirements Document
- [PROJECT_SPEC.md](PROJECT_SPEC.md) - Technical Specifications

## 🛠️ Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **UI:** React 19 + Tailwind CSS
- **Language:** TypeScript

## 📦 Features

- ✅ Multi-tenant SaaS architecture
- ✅ Employee management
- ✅ Automated database backups
- ✅ Secure authentication
- ✅ Role-based access control

## 🧪 Testing

```bash
# Test backup system
cd scripts
./test-backup.sh
```

## 📝 License

Proprietary - GeniusHR

## 🆘 Support

For issues or questions, contact the development team.

---

**Last Updated:** 2026-02-14
