# Changelog

All notable changes to GeniusHR will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Automated Database Backup System** (2026-02-14)
  - TypeScript backup script with gzip compression
  - Automatic verification and integrity checks
  - Configurable retention policy (default: 30 days)
  - Automated cleanup of old backups
  - Cron automation script for scheduled backups
  - Interactive restore script with safety checks
  - Pre-restore automatic backup
  - Comprehensive logging system
  - Email notification support (optional)
  - Test suite for backup system validation
  - Complete documentation:
    - `BACKUP-GUIDE.md` - Full backup and restore guide
    - `INSTALLATION.md` - Installation and setup guide
    - `scripts/README.md` - Scripts documentation
  - NPM scripts for backup operations:
    - `npm run backup` - Full backup
    - `npm run backup:verify` - Verify backup integrity
    - `npm run backup:cleanup` - Clean old backups
    - `npm run backup:list` - List all backups
  - Shell scripts:
    - `backup-cron.sh` - Cron automation wrapper
    - `restore-database.sh` - Interactive database restore
    - `test-backup.sh` - System validation tests
  - Environment configuration:
    - `BACKUP_DIR` - Backup directory location
    - `BACKUP_RETENTION_DAYS` - Retention policy
    - `BACKUP_NOTIFY_EMAIL` - Email for notifications

### Changed
- Updated `package.json` with backup scripts
- Updated `.gitignore` to exclude backups and logs
- Updated `.env.example` with backup configuration

### Documentation
- Added `README.md` - Project overview
- Added `BACKUP-GUIDE.md` - Complete backup documentation
- Added `INSTALLATION.md` - Installation guide
- Added `scripts/README.md` - Scripts documentation
- Added `CHANGELOG.md` - This file

## [0.1.0] - 2026-01-24

### Added
- Initial project setup
- Next.js 16 + React 19
- Prisma ORM + PostgreSQL
- NextAuth.js authentication
- Multi-tenant architecture
- Basic HR features

---

For detailed backup documentation, see [BACKUP-GUIDE.md](BACKUP-GUIDE.md)
