import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { trpcMiddleware } from './routers/express-trpc';
import { gatherTrafficDataForAllCheckpoints } from './controllers/checkpointsController';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

if(!process.env.API_KEY){
  throw new Error("Missing API_KEY");
}

if(!process.env.ACCESS_TOKEN_SECRET){
  throw new Error("Missing ACCESS_TOKEN_SECRET");
}

if(!process.env.REFRESH_TOKEN_SECRET){
  throw new Error("Missing REFRESH_TOKEN_SECRET");
}

if(!process.env.DATABASE_URL){
  throw new Error("Missing DATABASE_URL");
}

const app = express();

const port = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST',
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use(
  '/trpc',
  trpcMiddleware,
);

cron.schedule('*/15 * * * *', async () => {
  await gatherTrafficDataForAllCheckpoints();
});

app.get('/', (req, res) => {
  res.send('Hello from backend!');
})

app.listen(port, () => {
  console.log('Server listening');
});