import fs from 'fs';
import path from 'path';

function workTree(dir: string, cb: (path: string) => void): void {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      return workTree(fullPath, cb);
    }
    return cb(fullPath);
  });
}

export default workTree;
