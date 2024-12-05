import * as db from '@/helpers/sqlite';


const pills = [
  { id: 1, name: 'Pill 1', description: '', bestBefore: null, imageData: 'imageData1' },
  { id: 2, name: 'Pill 2', description: 'Description 2', bestBefore: '2021-10-01', imageData: 'imageData2' },
];
const mockSQLite = {
  execSync: jest.fn(),
  getAllSync: jest.fn().mockReturnValue(pills),
  runSync: jest.fn(),
  closeSync: jest.fn(),
};

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: () => mockSQLite,
}));

describe('SQLite', () => {

  test('createDatabase', () => {
    db.createDatabase();
    expect(mockSQLite.execSync).toHaveBeenCalledWith(`
    CREATE TABLE IF NOT EXISTS pills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      description VARCHAR(200) DEFAULT '',
      bestBefore DATE NULL,
      imageData TEXT NOT NULL
    );
  `
    );
  });

  test('close', () => {
    db.close();
    expect(mockSQLite.closeSync).toHaveBeenCalled();
  });

  test('getPills', () => {
    expect(db.getPills()).toStrictEqual(pills);
  });

  test('insertPill', () => {
    db.insertPill({ name: 'Pill 3', description: 'Description 3', bestBefore: '2021-11-01', imageData: 'imageData3' });
    expect(mockSQLite.runSync).toHaveBeenCalledWith(`
    INSERT INTO pills (name, description, bestBefore, imageData) VALUES (?, ?, ?, ?);
  `, ['Pill 3', 'Description 3', '2021-11-01', 'imageData3']);
  });

  test('updatePill', () => {
    db.updatePill({ id: 2, name: 'Pill 2 Updated', description: 'Description 2 Updated', bestBefore: '2021-12-01', imageData: 'imageData2 Updated' });
    expect(mockSQLite.runSync).toHaveBeenCalledWith(`
    UPDATE pills SET name=?, description=?, bestBefore=?, imageData=? WHERE id=?;
  `, ['Pill 2 Updated', 'Description 2 Updated', '2021-12-01', 'imageData2 Updated', 2]);
  });

  test('deletePill', () => {
    db.deletePill(2);
    expect(mockSQLite.runSync).toHaveBeenCalledWith(`
    DELETE FROM pills WHERE id=?;
  `, 2);
  });

});
