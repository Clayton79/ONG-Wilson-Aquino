import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  dataDir: path.resolve(process.env.DATA_DIR || './data'),
  backupDir: path.resolve(process.env.BACKUP_DIR || './backups'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
