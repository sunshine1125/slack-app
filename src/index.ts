import express from 'express';
import bodyParser from "body-parser";
import debug from "debug";
const appDebug = debug('app');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  appDebug('Slack app listening on port' + 3000);
});
