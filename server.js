import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173']
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
