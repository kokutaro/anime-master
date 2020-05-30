import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';

import getJpName from './getJpName';
import moveFile from './moveFile';
import { sleep } from './torrentMonitor';
import walkTree from './walkTree';

const basePath = process.env.BASE_PATH ?? '';

const fileMonitor = (): NodeJS.Timeout => {
  return setInterval(async () => {
    const files = fs.readdirSync(basePath);
    files.forEach(async (f) => {
      const fullPath = path.join(basePath, f);
      if (!fs.existsSync(fullPath)) {
        return;
      }
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkTree(fullPath, async (s) => {
          await sleep(350);
          const anime = await getJpName(path.basename(s));
          if (anime) {
            console.log(moveFile(anime.torrentName, anime.anime.title.japanese));
          }
        });
      } else {
        await sleep(350);
        const anime = await getJpName(path.basename(f));
        if (anime) {
          console.log(moveFile(anime.torrentName, anime.anime.title.japanese));
        }
      }
    });
  }, 5 * 60 * 1000);
};

export default fileMonitor;
