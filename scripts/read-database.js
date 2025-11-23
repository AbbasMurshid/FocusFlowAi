// Database reader script - Run with: node scripts/read-database.js
// This displays all records in your MongoDB database

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

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function readDatabase() {
    try {
        const mongoURI = getMongoURI();

        if (!mongoURI) {
            console.error('❌ MONGODB_URI not found in .env.local');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB\n');

        // Get database stats
        const dbStats = await mongoose.connection.db.stats();

        console.log('💾 DATABASE SIZE');
        console.log('='.repeat(60));
        console.log(`Database Name: ${dbStats.db}`);
        console.log(`Data Size: ${formatBytes(dbStats.dataSize)}`);
        console.log(`Storage Size: ${formatBytes(dbStats.storageSize)}`);
        console.log(`Index Size: ${formatBytes(dbStats.indexSize)}`);
        console.log(`Total Size: ${formatBytes(dbStats.dataSize + dbStats.indexSize)}`);
        console.log('='.repeat(60));

        // Get all collections
        const collections = await mongoose.connection.db.listCollections().toArray();

        console.log('\n📊 DATABASE RECORDS');
        console.log('='.repeat(60));

        let totalDocuments = 0;

        // Read each collection
        for (const collection of collections) {
            const collectionName = collection.name;
            const documents = await mongoose.connection.db.collection(collectionName).find({}).toArray();

            console.log(`\n📁 Collection: ${collectionName}`);
            console.log(`   Count: ${documents.length} documents`);

            totalDocuments += documents.length;

            if (documents.length > 0) {
                console.log(`   Records:\n`);
                documents.forEach((doc, index) => {
                    console.log(`   [${index + 1}] Document ID: ${doc._id}`);

                    // Display ALL fields for users collection
                    if (collectionName === 'users') {
                        console.log(`       📧 Email: ${doc.email}`);
                        console.log(`       👤 Name: ${doc.name}`);
                        console.log(`       🔐 Password Hash: ${doc.password?.substring(0, 20)}...`);
                        console.log(`       📅 Created: ${doc.createdAt}`);
                        console.log(`       🔄 Updated: ${doc.updatedAt}`);
                        if (doc.__v !== undefined) console.log(`       🔢 Version: ${doc.__v}`);

                        // Show any other fields
                        Object.keys(doc).forEach(key => {
                            if (!['_id', 'email', 'name', 'password', 'createdAt', 'updatedAt', '__v'].includes(key)) {
                                console.log(`       ➕ ${key}: ${JSON.stringify(doc[key])}`);
                            }
                        });
                    } else if (collectionName === 'tasks') {
                        console.log(`       📝 Title: ${doc.title}`);
                        console.log(`       📊 Status: ${doc.status}`);
                        console.log(`       ⚡ Priority: ${doc.priority}`);
                        console.log(`       👤 User ID: ${doc.userId}`);
                        console.log(`       📅 Created: ${doc.createdAt}`);
                        console.log(`       🔄 Updated: ${doc.updatedAt}`);
                    } else if (collectionName === 'notes') {
                        console.log(`       📝 Title: ${doc.title}`);
                        console.log(`       📄 Content: ${doc.content?.substring(0, 60)}...`);
                        console.log(`       👤 User ID: ${doc.userId}`);
                        console.log(`       📅 Created: ${doc.createdAt}`);
                    } else if (collectionName === 'goals') {
                        console.log(`       🎯 Title: ${doc.title}`);
                        console.log(`       📈 Progress: ${doc.progress}%`);
                        console.log(`       ⏰ Deadline: ${doc.deadline}`);
                        console.log(`       👤 User ID: ${doc.userId}`);
                    } else if (collectionName === 'focussessions') {
                        console.log(`       ⏱️  Duration: ${doc.duration} minutes`);
                        console.log(`       👤 User ID: ${doc.userId}`);
                        console.log(`       📅 Date: ${doc.createdAt}`);
                    } else {
                        // Generic display for other collections
                        Object.keys(doc).forEach(key => {
                            if (key !== '_id' && key !== '__v') {
                                const value = doc[key];
                                if (typeof value === 'string' && value.length > 60) {
                                    console.log(`       ${key}: ${value.substring(0, 60)}...`);
                                } else if (typeof value !== 'object') {
                                    console.log(`       ${key}: ${value}`);
                                } else if (value !== null) {
                                    console.log(`       ${key}: ${JSON.stringify(value)}`);
                                }
                            }
                        });
                    }
                    console.log(''); // Empty line between records
                });
            }
        }

        console.log('='.repeat(60));
        console.log(`📈 Summary:`);
        console.log(`   Collections: ${collections.length}`);
        console.log(`   Total Documents: ${totalDocuments}`);
        console.log(`   Database Size: ${formatBytes(dbStats.dataSize)}`);
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error reading database:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

readDatabase();
