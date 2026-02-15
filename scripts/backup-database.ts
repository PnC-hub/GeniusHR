#!/usr/bin/env ts-node

/**
 * GeniusHR - Automated Database Backup Script
 *
 * Features:
 * - Full PostgreSQL database backup
 * - Compressed backups (gzip)
 * - Automatic old backup cleanup (retention policy)
 * - Email notifications on failure
 * - Backup verification
 *
 * Usage:
 *   npm run backup              # Full backup
 *   npm run backup:verify       # Verify last backup
 *   npm run backup:cleanup      # Clean old backups
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createWriteStream } from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  // Database connection from .env
  DB_URL: process.env.DATABASE_URL || '',

  // Backup directory (absolute path)
  BACKUP_DIR: process.env.BACKUP_DIR || path.join(__dirname, '../backups'),

  // Retention policy (days)
  RETENTION_DAYS: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),

  // Email notifications
  NOTIFY_EMAIL: process.env.BACKUP_NOTIFY_EMAIL || '',

  // Backup file naming
  DATE_FORMAT: 'YYYYMMDD-HHmmss',
};

/**
 * Parse PostgreSQL connection URL
 */
function parseDatabaseUrl(url: string): {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
} {
  const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(regex);

  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }

  return {
    username: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    database: match[5],
  };
}

/**
 * Generate backup filename
 */
function generateBackupFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timestamp = `${year}${month}${day}-${hours}${minutes}${seconds}`;
  return `geniushr-backup-${timestamp}.sql.gz`;
}

/**
 * Create backup directory if not exists
 */
async function ensureBackupDirectory(): Promise<void> {
  try {
    await fs.access(CONFIG.BACKUP_DIR);
  } catch {
    console.log(`Creating backup directory: ${CONFIG.BACKUP_DIR}`);
    await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true });
  }
}

/**
 * Perform database backup
 */
async function performBackup(): Promise<string> {
  const dbConfig = parseDatabaseUrl(CONFIG.DB_URL);
  const backupFile = path.join(CONFIG.BACKUP_DIR, generateBackupFilename());

  console.log('Starting database backup...');
  console.log(`Database: ${dbConfig.database}`);
  console.log(`Host: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`Output: ${backupFile}`);

  // Set environment for pg_dump
  const env = {
    ...process.env,
    PGPASSWORD: dbConfig.password,
  };

  // pg_dump command with compression
  const dumpCommand = [
    'pg_dump',
    `-h ${dbConfig.host}`,
    `-p ${dbConfig.port}`,
    `-U ${dbConfig.username}`,
    `-d ${dbConfig.database}`,
    '--clean',
    '--if-exists',
    '--create',
    '--format=plain',
  ].join(' ');

  try {
    // Execute pg_dump and compress on the fly
    const { stdout } = await execAsync(dumpCommand, {
      env,
      maxBuffer: 100 * 1024 * 1024, // 100MB buffer
    });

    // Compress output
    const gzip = createGzip();
    const output = createWriteStream(backupFile);

    await new Promise((resolve, reject) => {
      const stream = require('stream');
      const input = stream.Readable.from(stdout);

      stream.pipeline(input, gzip, output, (err: any) => {
        if (err) reject(err);
        else resolve(null);
      });
    });

    const stats = await fs.stat(backupFile);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`✓ Backup completed successfully`);
    console.log(`  File: ${path.basename(backupFile)}`);
    console.log(`  Size: ${sizeMB} MB`);

    return backupFile;
  } catch (error: any) {
    console.error('✗ Backup failed:', error.message);
    throw error;
  }
}

/**
 * Verify backup file integrity
 */
async function verifyBackup(backupFile: string): Promise<boolean> {
  try {
    const stats = await fs.stat(backupFile);

    if (stats.size === 0) {
      console.error('✗ Backup file is empty');
      return false;
    }

    // Test gzip integrity
    await execAsync(`gunzip -t ${backupFile}`);

    console.log('✓ Backup verification passed');
    return true;
  } catch (error: any) {
    console.error('✗ Backup verification failed:', error.message);
    return false;
  }
}

/**
 * Clean old backups based on retention policy
 */
async function cleanOldBackups(): Promise<void> {
  console.log(`Cleaning backups older than ${CONFIG.RETENTION_DAYS} days...`);

  const files = await fs.readdir(CONFIG.BACKUP_DIR);
  const now = Date.now();
  const retentionMs = CONFIG.RETENTION_DAYS * 24 * 60 * 60 * 1000;

  let deletedCount = 0;

  for (const file of files) {
    if (!file.startsWith('geniushr-backup-') || !file.endsWith('.sql.gz')) {
      continue;
    }

    const filePath = path.join(CONFIG.BACKUP_DIR, file);
    const stats = await fs.stat(filePath);
    const ageMs = now - stats.mtimeMs;

    if (ageMs > retentionMs) {
      await fs.unlink(filePath);
      console.log(`  Deleted: ${file}`);
      deletedCount++;
    }
  }

  console.log(`✓ Cleaned ${deletedCount} old backup(s)`);
}

/**
 * List all backups
 */
async function listBackups(): Promise<void> {
  const files = await fs.readdir(CONFIG.BACKUP_DIR);
  const backups = files.filter(f => f.startsWith('geniushr-backup-') && f.endsWith('.sql.gz'));

  if (backups.length === 0) {
    console.log('No backups found');
    return;
  }

  console.log(`\nAvailable backups (${backups.length}):`);

  for (const file of backups.sort().reverse()) {
    const filePath = path.join(CONFIG.BACKUP_DIR, file);
    const stats = await fs.stat(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const date = stats.mtime.toLocaleString();

    console.log(`  ${file} - ${sizeMB} MB - ${date}`);
  }
}

/**
 * Send email notification
 */
async function sendNotification(subject: string, message: string): Promise<void> {
  if (!CONFIG.NOTIFY_EMAIL) {
    return;
  }

  // TODO: Implement email notification via SendGrid, AWS SES, or similar
  console.log(`[EMAIL] ${subject}: ${message}`);
}

/**
 * Main execution
 */
async function main() {
  const command = process.argv[2] || 'backup';

  try {
    await ensureBackupDirectory();

    switch (command) {
      case 'backup':
        const backupFile = await performBackup();
        const isValid = await verifyBackup(backupFile);

        if (!isValid) {
          throw new Error('Backup verification failed');
        }

        await cleanOldBackups();
        await sendNotification('Backup Success', `Backup completed: ${path.basename(backupFile)}`);
        break;

      case 'verify':
        const files = await fs.readdir(CONFIG.BACKUP_DIR);
        const lastBackup = files
          .filter(f => f.startsWith('geniushr-backup-'))
          .sort()
          .reverse()[0];

        if (!lastBackup) {
          console.log('No backups to verify');
          break;
        }

        await verifyBackup(path.join(CONFIG.BACKUP_DIR, lastBackup));
        break;

      case 'cleanup':
        await cleanOldBackups();
        break;

      case 'list':
        await listBackups();
        break;

      default:
        console.log('Usage: npm run backup [backup|verify|cleanup|list]');
        process.exit(1);
    }

    console.log('\n✓ Operation completed successfully');
  } catch (error: any) {
    console.error('\n✗ Operation failed:', error.message);
    await sendNotification('Backup Failed', error.message);
    process.exit(1);
  }
}

main();
