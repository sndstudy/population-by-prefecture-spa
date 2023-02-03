import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  fetchPopulationData,
  fetchPrefectures,
  Population,
} from '../api/fetch-data';
import CheckBoxList from '../presentational/CheckBoxList';
import { highchartsOptions } from '../option/HighchartsOptions';
import styles from '../styles/Main.module.scss';

const Main = () => {
  const [fetchPopulationParam, setFetchPopulationParam] = useState<string>('');
  const [populationDataList, setPopulationDataList] = useState<
    ({ prefCode: string; prefName: string } & Population)[]
  >([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);

  const fetchPrefecturesResult = useQuery('fetchPrefectures', fetchPrefectures);
  const fetchPopulationDataResult = useQuery(
    ['fetchPopulationData', fetchPopulationParam],
    fetchPopulationData,
    { enabled: !!fetchPopulationParam },
  );

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPrefectures((prev) => [...prev, e.target.value]);
      setFetchPopulationParam(e.target.value);
    } else {
      setSelectedPrefectures((prev) =>
        prev.filter((v) => v !== e.target.value),
      );
      setFetchPopulationParam('');
      setPopulationDataList((prev) =>
        prev.filter((v) => String(v.prefCode) !== e.target.value),
      );
    }
  };

  useEffect(() => {
    if (fetchPopulationDataResult.data) {
      const b = fetchPrefecturesResult.data?.result.find(
        (v) => String(v.prefCode) === fetchPopulationParam,
      );
      setPopulationDataList((prev) => [
        ...prev,
        {
          ...fetchPopulationDataResult.data.result,
          prefCode: b?.prefCode || '',
          prefName: b?.prefName || '',
        },
      ]);
    }
  }, [
    fetchPopulationDataResult.data,
    fetchPrefecturesResult.data,
    fetchPopulationParam,
  ]);

  const options = useMemo(() => {
    const series = populationDataList.map((populationData) => {
      const totalPopulationData = populationData.data.find(
        (pd) => pd.label === '総人口',
      );
      return {
        name: populationData.prefName,
        data: totalPopulationData?.data.map((tpd) => [tpd.year, tpd.value]),
      };
    });
    return { ...highchartsOptions, series };
  }, [populationDataList]);

  return (
    <>
      <div className={styles.title}>都道府県別 総人口</div>
      <div className={styles.wrapper}>
        <div className={styles.prefectures_area}>
          <div className={styles.section_title}>都道府県選択</div>
          {fetchPrefecturesResult.isLoading && <>データ取得中</>}
          {fetchPrefecturesResult.data && (
            <CheckBoxList
              data={fetchPrefecturesResult.data.result}
              selectedPrefectures={selectedPrefectures}
              onChange={changeHandler}
            />
          )}
        </div>
        <div className={styles.graph_area}>
          <HighchartsReact
            containerProps={{ style: { height: '100%' } }}
            highcharts={Highcharts}
            options={options}
          />
        </div>
      </div>
    </>
  );
};

export default Main;
