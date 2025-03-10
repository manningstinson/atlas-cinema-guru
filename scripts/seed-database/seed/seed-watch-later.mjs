import pg from 'pg';
const { Client } = pg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function seedWatchLater() {
  // Start at current directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Look for .env.local in multiple possible locations
  let envPath;
  
  // Try different potential locations
  const potentialPaths = [
    path.resolve(__dirname, '../../..'), // /workspaces/atlas-cinema-guru
    path.resolve(__dirname, '../..'),    // /workspaces/atlas-cinema-guru/scripts
    path.resolve(__dirname, '..')        // /workspaces/atlas-cinema-guru/scripts/seed-database
  ];
  
  for (const dir of potentialPaths) {
    const testPath = path.join(dir, '.env.local');
    console.log(`Checking for .env.local at: ${testPath}`);
    if (fs.existsSync(testPath)) {
      envPath = testPath;
      console.log(`Found .env.local at: ${envPath}`);
      break;
    }
  }
  
  if (!envPath) {
    console.error("Could not find .env.local in any expected location");
    const cwdEnvPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(cwdEnvPath)) {
      envPath = cwdEnvPath;
    } else {
      return;
    }
  }
  
  let databaseUrl;
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Try multiple possible env variable names
    const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/) || 
                       envContent.match(/POSTGRES_URL=(.+)/);
    
    if (dbUrlMatch && dbUrlMatch[1]) {
      databaseUrl = dbUrlMatch[1].trim();
      console.log("Loaded database URL from .env.local file");
    } else {
      console.error("No database URL found in .env.local");
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
    await client.connect();
    console.log("Connected to database successfully");

    // Count existing titles
    console.log("Checking for existing titles...");
    const titlesResult = await client.query(`SELECT COUNT(*) FROM titles;`);
    console.log(`Found ${titlesResult.rows[0].count} titles in the database`);
    
    if (parseInt(titlesResult.rows[0].count) === 0) {
      console.error("No titles in database. Please seed titles first.");
      return;
    }

    // Create the watchLater table
    console.log("Creating watchLater table if not exists...");
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS watchLater (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title_id UUID NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        FOREIGN KEY (title_id) REFERENCES titles(id)
      );
    `);
    
    // Check for existing watchLater entries
    const existingWatchLater = await client.query(`SELECT COUNT(*) FROM watchLater;`);
    console.log(`Found ${existingWatchLater.rows[0].count} existing watchLater entries`);

    // Get actual title IDs to use (limit to 10 for sample data)
    console.log("Fetching title IDs for sample data...");
    const titleIds = await client.query(`SELECT id FROM titles LIMIT 10;`);
    console.log(`Fetched ${titleIds.rows.length} title IDs`);
    
    // Sample user IDs - you would replace these with actual user IDs
    const userIds = [
      "user_1", 
      "user_2", 
      "user_demo"
    ];
    
    console.log("Beginning insertion of watchLater data...");
    let insertCount = 0;
    
    // Insert sample watchLater entries
    for (const userId of userIds) {
      // Each user gets 2-3 random titles in watch later
      const numToInsert = 2 + Math.floor(Math.random() * 2);
      console.log(`Adding ${numToInsert} watchLater entries for user ${userId}`);
      
      for (let i = 0; i < numToInsert && i < titleIds.rows.length; i++) {
        const titleId = titleIds.rows[i].id;
        
        console.log(`Inserting watchLater: title=${titleId}, user=${userId}`);
        try {
          await client.query(`
            INSERT INTO watchLater (title_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
          `, [titleId, userId]);
          
          insertCount++;
          console.log(`Inserted watchLater #${insertCount}`);
        } catch (err) {
          console.error(`Error inserting watchLater: ${err.message}`);
        }
      }
    }
    
    // Verify data was inserted
    const finalCount = await client.query(`SELECT COUNT(*) FROM watchLater;`);
    console.log(`Final watchLater count: ${finalCount.rows[0].count}`);
    console.log(`Inserted ${insertCount} watchLater entries`);
    
  } catch (error) {
    console.error("Failed during watchLater seeding:", error);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

// Run the function
console.log("Starting watchLater seeding process...");
seedWatchLater()
  .then(() => {
    console.log("Seed watchLater process completed");
    process.exit(0);
  })
  .catch(err => {
    console.error("Unhandled error in seed process:", err);
    process.exit(1);
  });