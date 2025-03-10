import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local from the project root
const envPath = path.join(__dirname, '..', '.env.local');
try {
  const envContent = fs.readFileSync(envPath, 'utf8');

  // Extract DATABASE_URL using regex
  const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
  if (dbUrlMatch && dbUrlMatch[1]) {
    console.log(dbUrlMatch[1]);
  } else {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading .env.local file:', error);
  process.exit(1);
}