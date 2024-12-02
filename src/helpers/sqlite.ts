import * as SQLite from 'expo-sqlite';
import { type Pill } from './types';

let db: SQLite.SQLiteDatabase;

export function createDatabase() {
  db = SQLite.openDatabaseSync('pillbox.db');
  db.execSync(`
    CREATE TABLE IF NOT EXISTS pills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      description VARCHAR(200) DEFAULT '',
      bestBefore DATE NULL,
      imageData TEXT NOT NULL
    );
  `);
}

export function close() {
  db.closeSync();
}

export function getPills(): Pill[] {
  return db.getAllSync(`
    SELECT * FROM pills order by id desc;
  `);
}

export function insertPill(pill: Pill) {
  const { name, description, bestBefore, imageData, } = pill;
  db.runSync(`
    INSERT INTO pills (name, description, bestBefore, imageData) VALUES (?, ?, ?, ?);
  `, [name, description, bestBefore, imageData]);
}

export function updatePill(pill: Pill) {
  const { id, name, description, bestBefore, imageData, } = pill;
  db.runSync(`
    UPDATE pills SET name=?, description=?, bestBefore=?, imageData=? WHERE id=?;
  `, [name, description, bestBefore, imageData, id as number]);
}

export function deletePill(id: number) {
  db.runSync(`
    DELETE FROM pills WHERE id=?;
  `, id);
}
