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
    await getJpNameAndMove(filesToMove);
  }, 1 * 60 * 1000);
};

async function getJpNameAndMove(filesToMove: string[]) {
  const fileToMove = filesToMove.pop();
  if (!fileToMove) {
    return;
  }
  console.log(fileToMove);
  await sleep(350);
  try {
    const jpNameData = await getJpName(fileToMove);
    if (jpNameData) {
      moveFile(fileToMove, jpNameData.anime.title.japanese);
    }
  } catch (error) {
    console.error(error.toString());
  }
  await getJpNameAndMove(filesToMove);
}

export default fileMonitor;
