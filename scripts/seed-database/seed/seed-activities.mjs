import pg from 'pg';
const { Client } = pg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function seedActivities() {
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

    // Create the activities table
    console.log("Creating activities table if not exists...");
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS activities (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT NOW(),
        title_id UUID NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        activity VARCHAR(255) NOT NULL,
        FOREIGN KEY (title_id) REFERENCES titles(id)
      );
    `);
    
    // Check for existing activities
    const existingActivities = await client.query(`SELECT COUNT(*) FROM activities;`);
    console.log(`Found ${existingActivities.rows[0].count} existing activities entries`);

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
    
    // Activity types
    const activityTypes = [
      "favorite",
      "watch_later"
    ];
    
    console.log("Beginning insertion of activities data...");
    let insertCount = 0;
    
    // Insert sample activities
    for (const userId of userIds) {
      // Each user gets 4-6 random activities
      const numToInsert = 4 + Math.floor(Math.random() * 3);
      console.log(`Adding ${numToInsert} activities for user ${userId}`);
      
      for (let i = 0; i < numToInsert && i < titleIds.rows.length; i++) {
        const titleId = titleIds.rows[i].id;
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        
        console.log(`Inserting activity: title=${titleId}, user=${userId}, activity=${activityType}`);
        try {
          await client.query(`
            INSERT INTO activities (title_id, user_id, activity)
            VALUES ($1, $2, $3);
          `, [titleId, userId, activityType]);
          
          insertCount++;
          console.log(`Inserted activity #${insertCount}`);
        } catch (err) {
          console.error(`Error inserting activity: ${err.message}`);
        }
      }
    }
    
    // Verify data was inserted
    const finalCount = await client.query(`SELECT COUNT(*) FROM activities;`);
    console.log(`Final activities count: ${finalCount.rows[0].count}`);
    console.log(`Inserted ${insertCount} activities entries`);
    
  } catch (error) {
    console.error("Failed during activities seeding:", error);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

// Run the function
console.log("Starting activities seeding process...");
seedActivities()
  .then(() => {
    console.log("Seed activities process completed");
    process.exit(0);
  })
  .catch(err => {
    console.error("Unhandled error in seed process:", err);
    process.exit(1);
  });