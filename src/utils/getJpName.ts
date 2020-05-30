import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

import { AnimeData } from '../types/AnimeData';

const animeApi = axios.create({
  baseURL: process.env.UT_API_URL ?? '',
});

const getJpName = async (tname: string): Promise<AnimeData | null> => {
  const animes = await animeApi.get<AnimeData[]>('/list', {
    params: {
      keyword: tname,
    },
  });
  if (!animes.data || !animes.data.length) {
    return null;
  }
  const [animeData] = animes.data;
  return animeData;
};

export default getJpName;
