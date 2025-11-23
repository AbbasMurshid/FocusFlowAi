// Migration script to add mfaEnabled field to existing users
// Run with: node scripts/migrate-mfa-field.js

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function getMongoURI() {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    return match ? match[1].trim() : null;
}

async function migrate() {
    try {
        const mongoURI = getMongoURI();

        if (!mongoURI) {
            console.error('❌ MONGODB_URI not found in .env.local');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB\n');

        // Update all users to have mfaEnabled field
        const result = await mongoose.connection.db.collection('users').updateMany(
            { mfaEnabled: { $exists: false } },
            { $set: { mfaEnabled: false } }
        );

        console.log(`✅ Updated ${result.modifiedCount} users with mfaEnabled field`);
        console.log('🎉 Migration complete!\n');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

migrate();
