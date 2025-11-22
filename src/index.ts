import express from 'express';
import cors from 'cors';
import translateRouter from './routes/translationRoutes';
import musicRouter from './routes/music';
import criesRouter from './routes/cries';
import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';

dotenv.config();
const app = express();
export const storage = new Storage();
app.use(cors());

app.use('/api/translations', translateRouter);
app.use('/api/music', musicRouter);
app.use('/api/cries', criesRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
