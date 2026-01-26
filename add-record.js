#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    console.log('=== Add New Learning Record ===\n');

    // Get user inputs
    const day = await question('Day: ');
    const duration = await question('Duration (minutes): ');
    const topic = await question('Topic (comma-separated if multiple): ');
    const description = await question('Description: ');
    const link = await question('Link: ');

    // Parse topics
    const topicArray = topic.split(',').map(t => t.trim().toLowerCase());

    // Load existing records
    const recordsPath = path.join(__dirname, 'frontend', 'src', 'data', 'records.json');
    let records = [];
    
    if (fs.existsSync(recordsPath)) {
      const fileContent = fs.readFileSync(recordsPath, 'utf8');
      records = JSON.parse(fileContent);
    }

    // Generate new ID (simple increment based on array length)
    const newId = records.length > 0 ? Math.max(...records.map(r => parseInt(r.day) || 0)) + 1 : 1;
    
    // Generate current date in MongoDB format
    const currentDate = new Date().toISOString();

    // Create new record
    const newRecord = {
      "_id": {
        "$oid": generateObjectId()
      },
      "day": parseInt(day),
      "duration": parseInt(duration),
      "date": {
        "$date": currentDate
      },
      "topic": topicArray,
      "description": description,
      "link": link,
      "updatedAt": {
        "$date": currentDate
      }
    };

    // Add to records
    records.push(newRecord);

    // Save to file
    fs.writeFileSync(recordsPath, JSON.stringify(records, null, 2));

    console.log('\n✅ Record added successfully!');
    console.log(`ID: ${newRecord._id.$oid}`);
    console.log(`Day: ${newRecord.day}`);
    console.log(`Date: ${currentDate}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

// Generate a simple ObjectId-like string
function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomValue = Math.random().toString(16).substring(2, 18);
  return (timestamp + randomValue).padEnd(24, '0').substring(0, 24);
}

main();
