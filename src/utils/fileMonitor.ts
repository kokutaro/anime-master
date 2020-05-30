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
    const filesToMove: string[] = [];
    files.forEach((f) => {
      const fullPath = path.join(basePath, f);
      if (!fs.existsSync(fullPath)) {
        return;
      }
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkTree(fullPath, (s) => {
          filesToMove.push(path.basename(s));
        });
      } else {
        filesToMove.push(path.basename(f));
      }
    });
    await sleep(1000);
    console.log(filesToMove);
  }, 1 * 60 * 1000);
};

export default fileMonitor;
