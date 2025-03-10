import pkg from 'pg';
const { Client } = pkg;
import { titles } from "./titles.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function seedTitles() {
  // Get the directory name in ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Navigate from seed-dist/seed directory to repository root
  const rootDir = path.resolve(__dirname, '../../');
  const envPath = path.join(rootDir, '.env.local');
  
  console.log(`Looking for .env.local at: ${envPath}`);
  
  let databaseUrl;
  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
      if (dbUrlMatch && dbUrlMatch[1]) {
        databaseUrl = dbUrlMatch[1];
        console.log("Loaded DATABASE_URL from .env.local file");
      } else {
        console.error("DATABASE_URL not found in .env.local");
        return;
      }
    } else {
      console.error(".env.local file not found at", envPath);
      console.log("Current directory:", process.cwd());
      console.log("Available files in root:", fs.readdirSync(rootDir));
      return;
    }
  } catch (err) {
    console.error("Could not read .env.local file:", err);
    return;
  }

  console.log("Connecting to database...");
  
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false // Required for Neon PostgreSQL
    }
  });

  try {
    console.log("Attempting to connect to database...");
    await client.connect();
    console.log("Connected to database successfully");

    // First, make sure the table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS titles (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        synopsis TEXT,
        released INTEGER,
        genre TEXT
      );
    `);
    
    console.log("Table verified, proceeding with seeding...");
    let count = 0;

    for (const title of titles) {
      await client.query(
        `INSERT INTO titles (id, title, synopsis, released, genre)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [title.id, title.title, title.synopsis, title.released, title.genre]
      );
      count++;
      if (count % 10 === 0) {
        console.log(`Inserted ${count} titles...`);
      }
    }
    console.log(`Titles seeding complete. Total: ${count} titles.`);
  } catch (error) {
    console.error("Failed to seed titles:", error);
  } finally {
    await client.end();
  }
}

seedTitles();