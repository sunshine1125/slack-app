import express from 'express';
const app = express();
const debug = require('debug');
const appDebug = debug('app');

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  appDebug('Slack app listening on port' + 3000);
});
