import Highcharts from 'highcharts';

export const highchartsOptions: Highcharts.Options = {
  accessibility: {
    enabled: false,
  },
  chart: {
    spacingTop: 50,
    spacingBottom: 100,
  },
  title: {
    text: '都道府県別 総人口数',
  },
  yAxis: {
    title: {
      text: '総人口数',
      align: 'high',
      offset: 0,
      rotation: 0,
      y: -20,
    },
  },
  xAxis: {
    title: {
      text: '年度',
      align: 'high',
      offset: 0,
      rotation: 0,
      y: 0,
      x: 50,
    },
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
  },
};

export const getHighchartsInstance = () => {
  // テスト実行時のみHighchartsで設定されるIDを固定化する
  /* eslint react-hooks/rules-of-hooks:off */
  Highcharts.useSerialIds(process.env.NODE_ENV === 'test');
  return Highcharts;
};
