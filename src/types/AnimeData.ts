export interface File {
  name: string;
  size: string;
}

export interface Torrent {
  seeders: number;
  leechers: number;
  completed: number;
  announces: string[];
  files: File[];
}

export interface Info {
  totalHash: string;
  totalSize: string;
  createdDate: string;
  torrent: Torrent;
}

export interface Title {
  romaji: string;
  english?: boolean;
  japanese: string;
}

export interface Anime {
  duration: string;
  type: string;
  status: string;
  title: Title;
  synopsis: string;
  startDate: string;
  endDate: string;
  totalEpisodes: number;
  rating: number;
  firstChannel?: boolean;
  originalFrom: string;
  image: string;
  genes: string[];
  sources: string[];
  synonyms: string[];
}

export interface Video {
  resolution: string;
  codec: string;
}

export interface Audio {
  codec: string;
}

export interface Metadata {
  video: Video;
  audio: Audio;
}

export interface Download {
  torrent: string;
  magnet: string;
}

export interface AnimeData {
  id: string;
  releaseGroup: string;
  title: string;
  episode: string;
  torrentName: string;
  info: Info;
  anime: Anime;
  metadata: Metadata;
  download: Download;
}
