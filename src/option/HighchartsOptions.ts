export const highchartsOptions = {
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
