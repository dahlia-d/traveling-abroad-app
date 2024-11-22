import express from 'express';
import cors from 'cors';
import registerRoute from './routes/register';
import loginRoute from './routes/authenticate';
import refreshRoute from './routes/refresh';
import logoutRoute from './routes/logout';
import postsRoute from './routes/posts';
import cookieParser from 'cookie-parser';

const app = express();
const port = 5000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
}));

app.use(cookieParser());

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/refresh', refreshRoute);
app.use('/logout', logoutRoute);
app.use('/posts', postsRoute);

app.get('/', (req, res) => {
  res.send('Hello from backend!');
})

app.listen(port, () => {
  console.log('Server listening');
});