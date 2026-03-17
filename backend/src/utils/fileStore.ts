// ============================================================
// File Store — JSON persistence layer with concurrency control
// ============================================================

import fs from 'fs';
import path from 'path';
import { config } from '../config';

// Simple mutex implementation per file
const locks: Map<string, Promise<void>> = new Map();

async function acquireLock(filePath: string): Promise<() => void> {
  while (locks.has(filePath)) {
    await locks.get(filePath);
  }

  let releaseLock: () => void;
  const lockPromise = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });
  locks.set(filePath, lockPromise);

  return () => {
    locks.delete(filePath);
    releaseLock!();
  };
}

function ensureDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getFilePath(collection: string): string {
  return path.join(config.dataDir, `${collection}.json`);
}

export async function readCollection<T>(collection: string): Promise<T[]> {
  const filePath = getFilePath(collection);

  if (!fs.existsSync(filePath)) {
    ensureDirectory(config.dataDir);
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }

  const release = await acquireLock(filePath);
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as T[];
  } catch {
    return [];
  } finally {
    release();
  }
}

export async function writeCollection<T>(collection: string, data: T[]): Promise<void> {
  const filePath = getFilePath(collection);
  ensureDirectory(config.dataDir);

  const release = await acquireLock(filePath);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } finally {
    release();
  }
}

export async function findById<T extends { id: string }>(
  collection: string,
  id: string
): Promise<T | undefined> {
  const items = await readCollection<T>(collection);
  return items.find((item) => item.id === id);
}

export async function insertOne<T extends { id: string }>(
  collection: string,
  item: T
): Promise<T> {
  const items = await readCollection<T>(collection);
  items.push(item);
  await writeCollection(collection, items);
  return item;
}

export async function updateOne<T extends { id: string }>(
  collection: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const items = await readCollection<T>(collection);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) return null;

  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() } as T;
  await writeCollection(collection, items);
  return items[index];
}

export async function deleteOne<T extends { id: string }>(
  collection: string,
  id: string
): Promise<boolean> {
  const items = await readCollection<T>(collection);
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) return false;

  await writeCollection(collection, filtered);
  return true;
}

// ---- Backup & Restore ----

export async function createBackup(): Promise<string> {
  ensureDirectory(config.backupDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(config.backupDir, `backup-${timestamp}`);
  ensureDirectory(backupPath);

  const files = fs.readdirSync(config.dataDir).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const src = path.join(config.dataDir, file);
    const dest = path.join(backupPath, file);
    fs.copyFileSync(src, dest);
  }

  return backupPath;
}

export async function restoreBackup(backupName: string): Promise<boolean> {
  const backupPath = path.join(config.backupDir, backupName);

  if (!fs.existsSync(backupPath)) return false;

  const files = fs.readdirSync(backupPath).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const src = path.join(backupPath, file);
    const dest = path.join(config.dataDir, file);
    fs.copyFileSync(src, dest);
  }

  return true;
}

export async function listBackups(): Promise<string[]> {
  ensureDirectory(config.backupDir);
  return fs.readdirSync(config.backupDir).filter((f) => {
    return fs.statSync(path.join(config.backupDir, f)).isDirectory();
  });
}
