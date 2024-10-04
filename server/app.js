import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './db/connection.js';
import UserRoute from './routes/user.js';
import path from 'path';
import morgan from 'morgan';


import { accessLogStream } from './utility/config.js';
import { errorMiddleware } from './middleware/error.js';




dotenv.config();

const app = express();
const port = process.env.PORT;

// Setup Morgan middleware for request logging
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static('dist'));
app.use('/image-generation', express.static('image-generation'));
app.use(cors({ credentials: true, origin: process.env.SITE_URL }));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

// API routes
// app.use('/api/chat/', ChatRoute);
app.use('/api/user/', UserRoute);

// Frontend React route
app.get('/*',(req,res)=>{
    res.sendFile(path.join(`${path.resolve(path.dirname(''))}/dist/index.html`));
});

// Error Middleware
app.use(errorMiddleware);

connectDB((err) => {
    if (err) return console.log("MongoDB Connect Failed : ", err);

    console.log("MongoDB Connected");

    app.listen(port, () => {
        console.log("Server started");
    });
});
