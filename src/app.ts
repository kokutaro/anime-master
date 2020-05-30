import dotenv from 'dotenv';
dotenv.config();

import torrentServer from './server/torrent-server';
import fileMonitor from './utils/fileMonitor';
import torrentMonitor from './utils/torrentMonitor';

torrentServer.listen(process.env.UT_SERVER_PORT, () => {
  torrentMonitor();
  fileMonitor();
  console.log('Listening on: ' + process.env.UT_SERVER_PORT);
});
