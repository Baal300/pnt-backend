import express from 'express';
import cors from 'cors';
import translateRouter from './routes/translate';
import musicRouter from './routes/music';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());

app.use('/api/translate', translateRouter);
app.use('/api/music', musicRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
