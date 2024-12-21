import express from 'express';
import cors from 'cors';
import registerRoute from './routes/register';
import authenticateRoute from './routes/authenticate';
import postsRoute from './routes/posts';
import cookieParser from 'cookie-parser';
import { trpcMiddleware } from './routers/express-trpc';


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

// app.use('/register', registerRoute);
// app.use('/authenticate', authenticateRoute);
// app.use('/posts', postsRoute);

app.get('/', (req, res) => {
  res.send('Hello from backend!');
})

app.listen(port, () => {
  console.log('Server listening');
});