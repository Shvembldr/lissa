import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../db.test');
fs.unlinkSync(dbPath);
