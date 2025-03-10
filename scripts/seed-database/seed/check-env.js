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
  console.log("Contents of .env.local:");
  
  // Print each line, masking sensitive info
  envContent.split('\n').forEach(line => {
    if (line.startsWith('DATABASE_URL=')) {
      const url = line.substring(13);
      // Show first part of the URL but mask credentials
      const maskedUrl = url.replace(/(postgres:\/\/)([^@]+)(@.+)/, '$1****:****$3');
      console.log(`DATABASE_URL=${maskedUrl}`);
    } else {
      console.log(line);
    }
  });
} catch (error) {
  console.error('Error reading .env.local file:', error);
}