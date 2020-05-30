import fs from 'fs';
import path from 'path';

import stopTorrent from './stopTorrent';

const re = /(^\[.*?\] *)?(.*?) - (SP|OA[DV]|OVA)?(\d\d|\d\d\.\d|\d\dv\d).*?$/;

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

const moveFile = (srcPath: string, jpName: string): boolean => {
  stopTorrent();
  const baseName = path.basename(srcPath);
  if (!srcPath || !jpName) {
    return false;
  }
  if (!re.test(baseName)) {
    return false;
  }
  const ep = baseName.replace(re, '$4');
  const ext = path.extname(baseName);

  const safeTitle = convertTitle(jpName);
  const dstFolder = path.join(moveTo, safeTitle);
  if (!fs.existsSync(dstFolder)) {
    fs.mkdirSync(dstFolder);
  }
  const dst = path.join(dstFolder, `${safeTitle} s1e${ep}${ext}`);
  try {
    fs.renameSync(srcPath, dst);
  } catch (error) {
    console.log(error.toString());
    return false;
  }
  return true;
};

export default moveFile;
