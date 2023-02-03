import axios from 'axios';

const RESAS_API_ENDPOINT = 'https://opendata.resas-portal.go.jp/';
const API_KEY = process.env['REACT_APP_RESAS_API_KEY'];

const instance = axios.create({
  baseURL: RESAS_API_ENDPOINT,
  timeout: 1000,
  headers: { 'X-API-KEY': API_KEY },
});

type PrefecturesResponse = {
  message: string;
  result: Prefectures[];
};

type Prefectures = {
  prefCode: string;
  prefName: string;
};

export const fetchPrefectures = async () => {
  const { data } = await instance.get<PrefecturesResponse>(
    'api/v1/prefectures',
  );
  return data;
};
