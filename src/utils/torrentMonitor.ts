import axios from 'axios';
import fs from 'fs';
import path from 'path';

import { AnimeData } from '../types/AnimeData';

const torrentApi = axios.create({
  baseURL: process.env.UT_API_URL,
});

const torrentPath = process.env.TORRENT_PATH ?? '';

type TorrentInfo = {
  torrentName: string;
  title: string;
  id: string;
  torrentUrl: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getAnimes = async (): Promise<TorrentInfo[]> => {
  const res = await torrentApi.get<AnimeData[]>('/list', { params: { count: 20 } });
  return res.data.map((d) => ({
    torrentName: d.torrentName,
    title: d.title,
    id: d.id,
    torrentUrl: d.download.torrent,
  }));
};

const downloadAnime = async (arr: TorrentInfo[], f: string[]): Promise<void> => {
  if (arr.length) {
    try {
      const a = arr.pop();
      if (!a) {
        return;
      }
      await sleep(350);
      const res = await torrentApi.get(a.torrentUrl, {
        responseType: 'arraybuffer',
      });
      fs.writeFileSync(path.join(torrentPath, `${a.id}.torrent`), res.data);
      f.push(a.id);
      console.log(`Downloaded: ${a.torrentName}`);
      await downloadAnime(arr, f);
    } catch (error) {
      console.log(error.toString());
    }
  }
};

const ohysGetter = async (): Promise<void> => {
  try {
    const torrents = await getAnimes();
    console.log('Got torrents');
    const arr: string[] = [];
    if (!fs.existsSync('assets')) {
      fs.mkdirSync('assets');
    }
    if (fs.existsSync('assets/record.json')) {
      const f = fs.readFileSync('assets/record.json');
      if (f) {
        arr.push(...JSON.parse(f.toString()));
      }
    }
    const toDownload = torrents.filter((t) => !arr.some((a) => a === t.id));
    console.log(`Items to download: ${toDownload.length}`);
    await downloadAnime(toDownload, arr);
    fs.writeFileSync('assets/record.json', JSON.stringify(arr), { flag: '' });
    console.log('Done');
  } catch (error) {
    console.log(error.toString());
  }
};

const torrentMonitor = async (): Promise<void> => {
  await ohysGetter();
  setInterval(async () => {
    await ohysGetter();
  }, 10 * 60 * 1000);
};

export default torrentMonitor;
