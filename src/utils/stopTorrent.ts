import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

let ax = axios.create({
  baseURL: process.env.UT_URL ?? '',
  auth: {
    password: process.env.UT_PASSWORD ?? '',
    username: process.env.UT_USER_NAME ?? '',
  },
});

let token: string;

const stopTorrent = async (): Promise<void> => {
  try {
    const tokenRes = await ax.get<string>('gui/token.html');
    const { data } = tokenRes;
    const cookie = tokenRes.headers['set-cookie'][0];

    token = data.replace(/^.*?<div.*?>(.*?)<\/div>.*?$/, '$1');

    ax = axios.create({
      baseURL: process.env.UT_URL,
      auth: {
        password: process.env.UT_PASSWORD ?? '',
        username: process.env.UT_USER_NAME ?? '',
      },
      headers: {
        Cookie: cookie,
      },
    });

    const dataRes = await ax.get<{ torrents: string[][] }>(`gui/`, {
      params: {
        token,
        list: 1,
      },
    });

    const p = dataRes.data.torrents.map((a: string[]) => ({
      hash: a[0],
      completed: a[4] === '1000',
      tname: a[2],
      dlSize: a[5],
      ulSize: a[6],
      statusText: a[21],
      age: a[22],
      dir: a[26],
      crc: a[28],
    }));

    const tasks = p
      .filter((t) => t.completed === true)
      .map((a) =>
        ax.get('gui/', {
          params: {
            token,
            action: 'removetorrent',
            hash: a.hash,
          },
        }),
      );
    await Promise.all(tasks);
  } catch (error) {
    console.error(error.toString());
    console.error(error.stack);
  }
};

export default stopTorrent;
