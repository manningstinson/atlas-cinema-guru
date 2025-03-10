import pg from 'pg';
const { Client } = pg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function seedFavorites() {
  // Get the directory name in ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Navigate directly to repository root
  const rootDir = path.resolve(__dirname, '../../../');
  const envPath = path.join(rootDir, '.env.local');
  
  console.log(`Looking for .env.local at: ${envPath}`);
  
  let databaseUrl;
  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      console.log("Found .env.local file");
      
      // Try multiple possible env variable names
      const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/) || 
                         envContent.match(/POSTGRES_URL=(.+)/);
      
      if (dbUrlMatch && dbUrlMatch[1]) {
        databaseUrl = dbUrlMatch[1];
        console.log("Loaded database URL from .env.local file");
      } else {
        console.error("No database URL found in .env.local");
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

    // Create uuid extension if needed
    console.log("Creating uuid extension if needed...");
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    
    // Create the favorites table
    console.log("Creating favorites table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title_id UUID NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        FOREIGN KEY (title_id) REFERENCES titles(id)
      );
    `);
    
    console.log("Favorites table created successfully");
    
    // ADDING DATA TO FAVORITES TABLE
    console.log("Fetching titles to use for favorites...");
    const titlesResult = await client.query(`
      SELECT id, title FROM titles LIMIT 10;
    `);
    
    if (titlesResult.rows.length === 0) {
      console.log("No titles found in the database. Cannot seed favorites.");
      return;
    }
    
    console.log(`Found ${titlesResult.rows.length} titles to use for seeding.`);
    
    // Sample user IDs for demonstration
    const users = ["user1", "user2", "demo_user"];
    let insertCount = 0;
    
    // Insert favorites for each user
    for (const user of users) {
      // Each user gets 2-3 favorites
      const favoriteCount = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < favoriteCount && i < titlesResult.rows.length; i++) {
        const titleId = titlesResult.rows[i].id;
        console.log(`Adding favorite for user ${user}: title ID ${titleId}`);
        
        try {
          await client.query(`
            INSERT INTO favorites (title_id, user_id) 
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
          `, [titleId, user]);
          
          insertCount++;
          console.log(`Added favorite #${insertCount}`);
        } catch (error) {
          console.error(`Error adding favorite: ${error.message}`);
        }
      }
    }
    
    // Verify favorites were added
    const countResult = await client.query(`SELECT COUNT(*) FROM favorites;`);
    console.log(`Total favorites in database: ${countResult.rows[0].count}`);
    console.log(`Added ${insertCount} new favorites.`);
    
  } catch (error) {
    console.error("Failed to create favorites table:", error);
    console.error("Error details:", error);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

seedFavorites()
  .then(() => {
    console.log("Seed favorites process completed");
    process.exit(0);
  })
  .catch(err => {
    console.error("Unhandled error in seed process:", err);
    process.exit(1);
  });