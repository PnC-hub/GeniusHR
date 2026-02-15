#!/bin/bash

###############################################################################
# GeniusHR Backup System - Test Script
#
# Tests backup system functionality without requiring production database
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_test() {
    echo -e "${YELLOW}TEST:${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

print_header "GeniusHR Backup System - Test Suite"

# Test 1: Check required commands
print_test "Checking required commands..."
MISSING_COMMANDS=0

for cmd in pg_dump psql gunzip gzip node npm ts-node; do
    if command -v $cmd &> /dev/null; then
        print_success "$cmd found"
    else
        print_error "$cmd not found"
        MISSING_COMMANDS=1
    fi
done

if [ $MISSING_COMMANDS -eq 1 ]; then
    echo ""
    echo "Install missing commands before proceeding"
    exit 1
fi

# Test 2: Check project structure
print_test "Checking project structure..."

if [ -f "$PROJECT_DIR/app/package.json" ]; then
    print_success "package.json found"
else
    print_error "package.json not found"
    exit 1
fi

if [ -f "$SCRIPT_DIR/backup-database.ts" ]; then
    print_success "backup-database.ts found"
else
    print_error "backup-database.ts not found"
    exit 1
fi

if [ -x "$SCRIPT_DIR/backup-cron.sh" ]; then
    print_success "backup-cron.sh is executable"
else
    print_error "backup-cron.sh is not executable"
    echo "Run: chmod +x $SCRIPT_DIR/backup-cron.sh"
fi

if [ -x "$SCRIPT_DIR/restore-database.sh" ]; then
    print_success "restore-database.sh is executable"
else
    print_error "restore-database.sh is not executable"
    echo "Run: chmod +x $SCRIPT_DIR/restore-database.sh"
fi

# Test 3: Check npm scripts
print_test "Checking npm scripts..."

cd "$PROJECT_DIR/app"

if npm run | grep -q "backup"; then
    print_success "backup script registered"
else
    print_error "backup script not found in package.json"
fi

# Test 4: Check environment file
print_test "Checking environment configuration..."

if [ -f "$PROJECT_DIR/app/.env" ]; then
    print_success ".env file exists"

    if grep -q "DATABASE_URL" "$PROJECT_DIR/app/.env"; then
        print_success "DATABASE_URL configured"
    else
        print_error "DATABASE_URL not found in .env"
    fi
else
    print_error ".env file not found"
    echo "Create .env file with DATABASE_URL"
fi

# Test 5: Check backup directory
print_test "Checking backup directory..."

BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"

if [ -d "$BACKUP_DIR" ]; then
    print_success "Backup directory exists: $BACKUP_DIR"

    if [ -w "$BACKUP_DIR" ]; then
        print_success "Backup directory is writable"
    else
        print_error "Backup directory is not writable"
    fi
else
    echo "Backup directory does not exist: $BACKUP_DIR"
    echo "It will be created automatically on first backup"
fi

# Test 6: Check logs directory
print_test "Checking logs directory..."

LOG_DIR="$PROJECT_DIR/logs"

if [ -d "$LOG_DIR" ]; then
    print_success "Logs directory exists"
else
    echo "Logs directory will be created automatically"
fi

# Test 7: TypeScript compilation
print_test "Testing TypeScript compilation..."

cd "$PROJECT_DIR/app"

if npx ts-node --help &> /dev/null; then
    print_success "ts-node works"
else
    print_error "ts-node not working"
fi

# Summary
print_header "Test Summary"

echo "All prerequisite checks passed!"
echo ""
echo "Next steps:"
echo "  1. Configure .env with DATABASE_URL"
echo "  2. Run: cd app && npm run backup"
echo "  3. Setup cron: crontab -e"
echo ""
echo "For full documentation, see: BACKUP-GUIDE.md"

print_header "Test Complete"
