// Database cleanup script - Run with: node scripts/wipe-database.js
// WARNING: This will delete ALL data from your database!

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local file and parse MongoDB URI
function getMongoURI() {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    return match ? match[1].trim() : null;
}

async function wipeDatabase() {
    try {
        const mongoURI = getMongoURI();

        if (!mongoURI) {
            console.error('❌ MONGODB_URI not found in .env.local');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // Get all collections
        const collections = await mongoose.connection.db.listCollections().toArray();

        console.log(`\n📊 Found ${collections.length} collections:`);
        collections.forEach(col => console.log(`   - ${col.name}`));

        console.log('\n🗑️  Deleting all data...\n');

        let totalDeleted = 0;

        // Drop each collection
        for (const collection of collections) {
            const count = await mongoose.connection.db.collection(collection.name).countDocuments();
            await mongoose.connection.db.collection(collection.name).deleteMany({});
            console.log(`✅ Deleted ${count} documents from ${collection.name}`);
            totalDeleted += count;
        }

        console.log('\n' + '='.repeat(50));
        console.log(`🎉 Database wiped successfully!`);
        console.log(`💾 Total documents deleted: ${totalDeleted}`);
        console.log(`🆕 Database is now fresh and clean!`);
        console.log('='.repeat(50) + '\n');

    } catch (error) {
        console.error('❌ Error wiping database:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Confirmation prompt
console.log('\n' + '⚠️ '.repeat(20));
console.log('⚠️  WARNING: This will DELETE ALL DATA from your database!');
console.log('⚠️  All users, tasks, notes, goals, and habits will be removed!');
console.log('⚠️ '.repeat(20));
console.log('\n💡 Press Ctrl+C to cancel, or wait 3 seconds to proceed...\n');

setTimeout(() => {
    wipeDatabase();
}, 3000);
