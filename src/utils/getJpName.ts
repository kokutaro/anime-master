import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

import { AnimeData } from '../types/AnimeData';

const re = /(^\[.*?\] *)?(.*?) - (\d\d|\d\d\.\d|\d\dv\d).*?$/;

const animeApi = axios.create({
  baseURL: process.env.UT_API_URL ?? '',
});

const getJpName = async (tname: string): Promise<AnimeData | null> => {
  try {
    const reRes = re.exec(tname);
    if (!reRes) {
      return null;
    }
    const [, , keyword] = reRes;
    const animes = await animeApi.get<AnimeData[]>('/list', {
      params: {
        keyword,
      },
    });
    if (!animes.data || !animes.data.length) {
      return null;
    }
    const [animeData] = animes.data;
    return animeData;
  } catch (error) {
    console.error(error.toString());
    return null;
  }
};

export default getJpName;
