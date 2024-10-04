import "dotenv/config"
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI

async function run() {
    try {
        await mongoose.connect(uri, { dbName: 'air-for-share' })
    } catch (error) {
        console.error(error)
        process.exit(1);
    }
}

run().catch(console.dir);

mongoose.connection.on('connected', () => console.log("mongoose is connected"));

mongoose.connection.on('disconnected', () => {
    console.log("mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', (err) => {
    console.log('mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log("app is terminating");
    await mongoose.connection.close();
    console.log('mongoose default connection closed');
    process.exit(0);
});