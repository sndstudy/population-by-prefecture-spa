import axios from 'axios';

const RESAS_API_ENDPOINT = 'https://opendata.resas-portal.go.jp/';
const API_KEY = process.env['REACT_APP_RESAS_API_KEY'] || '';

const instance = axios.create({
  baseURL: RESAS_API_ENDPOINT,
  timeout: 1000,
  headers: { 'X-API-KEY': API_KEY },
});

export type PrefecturesResponse = {
  message: string;
  result: Prefectures[];
};

export type Prefectures = {
  prefCode: string;
  prefName: string;
};

export type PopulationResponse = {
  message: string;
  result: Population;
};

export type Population = {
  boundaryYear: number;
  data: {
    label: string;
    data: {
      year: number;
      value: number;
      rate?: number;
    }[];
  }[];
};

export const fetchPrefectures = async () => {
  const { data } = await instance.get<PrefecturesResponse>(
    'api/v1/prefectures',
  );
  return data;
};

export const fetchPopulationData = async ({
  queryKey,
}: {
  queryKey: string[];
}) => {
  const [, prefCode] = queryKey;

  const { data } = await instance.get<PopulationResponse>(
    'api/v1/population/composition/perYear',
    {
      params: {
        prefCode,
      },
    },
  );
  return data;
};
