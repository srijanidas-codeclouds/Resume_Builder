import mongoose, { mongo } from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database connected");
        })
        let mongourl = process.env.MONGO_URI;
        const project = 'resume-builder';

        if(!mongourl) {
            throw new Error("Database connection failed or not found");
        }

        if (mongourl.endsWith('/')) {
            mongourl = mongourl.slice(0, -1);
        }
         
        await mongoose.connect(`${mongourl}/${project}`);
        
    } catch (error) {
        console.log("Error connecting to database",error.message);
        // exit with failure
        process.exit(1);
    }
};
