import express from 'express';
import cors from 'cors';
import translateRouter from './routes/translate';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());

app.use('/api/translate', translateRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
