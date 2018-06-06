import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

const app = express();

app.set('port', process.env.PORT || 4000);

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, './../build')));

app.use('*', (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, './../build'), 'index.html'));
});

export default app;
