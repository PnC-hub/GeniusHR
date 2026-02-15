#!/bin/bash

###############################################################################
# GeniusHR Database Restore Script
#
# Restores a database from a backup file
#
# Usage:
#   ./restore-database.sh <backup-file>
#   ./restore-database.sh latest
#
# Examples:
#   ./restore-database.sh ../backups/geniushr-backup-20260214-120000.sql.gz
#   ./restore-database.sh latest
###############################################################################

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check arguments
if [ $# -eq 0 ]; then
    print_error "No backup file specified"
    echo "Usage: $0 <backup-file|latest>"
    exit 1
fi

# Load environment variables
if [ -f "$PROJECT_DIR/app/.env" ]; then
    print_info "Loading environment from .env"
    export $(grep -v '^#' "$PROJECT_DIR/app/.env" | xargs)
else
    print_error ".env file not found"
    exit 1
fi

# Parse DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL not set"
    exit 1
fi

# Extract database connection details
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

export PGPASSWORD="$DB_PASS"

# Determine backup file
BACKUP_FILE="$1"

if [ "$BACKUP_FILE" = "latest" ]; then
    print_info "Finding latest backup..."
    BACKUP_FILE=$(ls -t "$BACKUP_DIR"/geniushr-backup-*.sql.gz 2>/dev/null | head -1)

    if [ -z "$BACKUP_FILE" ]; then
        print_error "No backup files found in $BACKUP_DIR"
        exit 1
    fi

    print_info "Latest backup: $(basename $BACKUP_FILE)"
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Verify backup file integrity
print_info "Verifying backup integrity..."
if ! gunzip -t "$BACKUP_FILE" 2>/dev/null; then
    print_error "Backup file is corrupted"
    exit 1
fi

print_info "Backup verification passed"

# Warning
print_warn "========================================="
print_warn "WARNING: This will REPLACE the current database!"
print_warn "Database: $DB_NAME"
print_warn "Host: $DB_HOST:$DB_PORT"
print_warn "Backup: $(basename $BACKUP_FILE)"
print_warn "========================================="
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    print_info "Restore cancelled"
    exit 0
fi

# Create a pre-restore backup
print_info "Creating pre-restore backup..."
PRE_RESTORE_FILE="$BACKUP_DIR/pre-restore-$(date +%Y%m%d-%H%M%S).sql.gz"

pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --clean --if-exists --create | gzip > "$PRE_RESTORE_FILE"

print_info "Pre-restore backup saved: $(basename $PRE_RESTORE_FILE)"

# Restore database
print_info "Starting database restore..."
print_info "This may take several minutes..."

if gunzip -c "$BACKUP_FILE" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres 2>&1 | grep -v "NOTICE"; then
    print_info "✓ Database restored successfully"

    # Run Prisma migrations to ensure schema is up to date
    print_info "Running Prisma migrations..."
    cd "$PROJECT_DIR/app"
    npx prisma migrate deploy

    print_info "✓ All operations completed successfully"
else
    print_error "Restore failed"
    print_warn "Pre-restore backup available at: $PRE_RESTORE_FILE"
    exit 1
fi

# Cleanup
unset PGPASSWORD
