import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { trpcMiddleware } from './routers/express-trpc';
import { gatherTrafficDataForAllCheckpoints } from './controllers/checkpointsController';
import cron from 'node-cron';

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