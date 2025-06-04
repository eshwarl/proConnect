import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

// Fix __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Mount routes
app.use(postRoutes);
app.use(userRoutes);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://akshitha:akshitha@apnaconnect.lvzmnvi.mongodb.net/?retryWrites=true&w=majority&appName=apnaconnect"
    );
    app.listen(9080, () => {
      console.log('Server is running on port 9080');
    });
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
};

start();
