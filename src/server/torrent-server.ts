import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import http from 'http';

import getJpName from '../utils/getJpName';
import moveFile from '../utils/moveFile';

const app = express();

app.use(bodyParser.json());

app.post('/', async (req: Request<never, never, { tname: string }>, res: Response) => {
  const { tname } = req.body;
  if (!tname) {
    return res.end();
  }
  const animeData = await getJpName(tname);
  if (!animeData) {
    return res.end();
  }

  moveFile(animeData.torrentName, animeData.anime.title.japanese);
});

const torrentServer = http.createServer(app);

export default torrentServer;
