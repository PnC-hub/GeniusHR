#!/bin/bash

###############################################################################
# GeniusHR Database Backup - Cron Automation Script
#
# This script should be added to crontab for automatic daily backups
#
# Installation:
#   1. Make executable: chmod +x backup-cron.sh
#   2. Add to crontab: crontab -e
#   3. Add line: 0 2 * * * /path/to/GeniusHR/scripts/backup-cron.sh
#
# Schedule Examples:
#   Daily at 2 AM:     0 2 * * *
#   Every 6 hours:     0 */6 * * *
#   Weekly (Sunday):   0 2 * * 0
###############################################################################

# Exit on error
set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/backup-$(date +%Y%m%d).log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "===== Starting Database Backup ====="

# Load environment variables
if [ -f "$PROJECT_DIR/app/.env" ]; then
    log "Loading environment from .env"
    export $(grep -v '^#' "$PROJECT_DIR/app/.env" | xargs)
else
    log "ERROR: .env file not found at $PROJECT_DIR/app/.env"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    log "ERROR: DATABASE_URL not set"
    exit 1
fi

# Navigate to project directory
cd "$PROJECT_DIR"

# Run backup script
log "Executing backup script..."
if npm run backup >> "$LOG_FILE" 2>&1; then
    log "✓ Backup completed successfully"
    EXIT_CODE=0
else
    log "✗ Backup failed with exit code $?"
    EXIT_CODE=1
fi

# Rotate logs (keep last 30 days)
log "Cleaning old logs..."
find "$LOG_DIR" -name "backup-*.log" -mtime +30 -delete

log "===== Backup Process Finished ====="
log ""

exit $EXIT_CODE
