import fs from 'fs';
import path from 'path';

import stopTorrent from './stopTorrent';

const re = /(^\[.*?\] *)?(.*?) - (\d\d|\d\d\.\d|\d\dv\d).*?$/;

const basePath = process.env.BASE_PATH ?? '';
const moveTo = process.env.DEST_PATH ?? '';

const ngLetter = [
  { from: /[[]/, to: '「' },
  { from: /[\]]/, to: '」' },
  { from: /[¥]/, to: '￥' },
  { from: /[\\]/, to: '＼' },
  { from: /[/]/, to: '／' },
  { from: /[:]/, to: '：' },
  { from: /[*]/, to: '＊' },
  { from: /[?]/, to: '？' },
  { from: /["]/, to: '”' },
  { from: /[<]/, to: '＜' },
  { from: /[>]/, to: '＞' },
  { from: /[|]/, to: '｜' },
];

const convertTitle = (title: string): string => {
  let t = title;
  ngLetter.forEach((ng) => {
    t = t.replace(ng.from, ng.to);
  });
  return t;
};

const moveFile = (torrentName: string, jpName: string): boolean => {
  stopTorrent();
  if (!torrentName || !jpName) {
    return false;
  }
  if (!re.test(torrentName)) {
    return false;
  }
  const ep = torrentName.replace(re, '$2');
  const ext = path.extname(torrentName);

  const safeTitle = convertTitle(jpName);
  const dstFolder = path.join(moveTo, safeTitle);
  if (!fs.existsSync(dstFolder)) {
    fs.mkdirSync(dstFolder);
  }
  const dst = path.join(dstFolder, `${safeTitle} s1e${ep}${ext}`);
  try {
    fs.renameSync(path.join(basePath, torrentName), dst);
  } catch (error) {
    console.log(error.toString());
    return false;
  }

  return true;
};

export default moveFile;
