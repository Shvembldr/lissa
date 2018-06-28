import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { graphiqlRouter, graphqlRouter } from './graphql/routers';
import { addUser } from './auth';

const app = express();

app.set('port', process.env.PORT || 4000);

app.use(cors());
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 500000,
  }),
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(addUser);
app.use('/graphql', graphqlRouter);
app.use('/graphiql', graphiqlRouter);

app.use(express.static(path.resolve(__dirname, './../build')));

app.use('*', (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, './../build'), 'index.html'));
});

export default app;
