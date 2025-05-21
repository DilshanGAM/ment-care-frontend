import mongoose from 'mongoose';  
  
const MONGO_URI = "mongodb+srv://malithdilshan27:J1OAxnugXoIubXOH@cluster0.nbmhs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";  
const cached: { connection?: typeof mongoose; promise?: Promise<typeof mongoose> } = {};  
async function connectMongo() {  
    if (!MONGO_URI) {  
        throw new Error('Please define the MONGO_URI environment variable inside .env.local');  
    }  
    if (cached.connection) {  
        return cached.connection;  
    }  
    if (!cached.promise) {  
        const opts = {  
            bufferCommands: false,  
        };  
        cached.promise = mongoose.connect(MONGO_URI, opts);  
    }  
    try {  
        cached.connection = await cached.promise;  
    } catch (e) {  
        cached.promise = undefined;  
        throw e;  
    }  
    return cached.connection;  
}  
export default connectMongo;
