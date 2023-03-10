import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HighchartsReact from 'highcharts-react-official';
import {
  fetchPopulationData,
  fetchPrefectures,
  Population,
  Prefectures,
} from '../api/fetch-data';
import CheckBoxList from '../presentational/CheckBoxList';
import {
  highchartsOptions,
  getHighchartsInstance,
} from '../option/HighchartsOptions';
import styles from '../styles/Main.module.scss';

const Main = () => {
  const [fetchPopulationParam, setFetchPopulationParam] = useState<string>('');
  const [populationDataList, setPopulationDataList] = useState<
    (Prefectures & Population)[]
  >([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);

  const fetchPrefecturesResult = useQuery(
    'fetchPrefectures',
    fetchPrefectures,
    { retry: false },
  );
  const fetchPopulationDataResult = useQuery(
    ['fetchPopulationData', fetchPopulationParam],
    fetchPopulationData,
    { enabled: !!fetchPopulationParam, retry: false },
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
    if (fetchPopulationDataResult.data && fetchPrefecturesResult.data) {
      const prefecturesData = fetchPrefecturesResult.data.result.find(
        (v) => String(v.prefCode) === fetchPopulationParam,
      );
      if (prefecturesData) {
        setPopulationDataList((prev) => [
          ...prev,
          {
            ...fetchPopulationDataResult.data.result,
            prefCode: prefecturesData.prefCode,
            prefName: prefecturesData.prefName,
          },
        ]);
      }
    }
  }, [
    fetchPopulationDataResult.data,
    fetchPrefecturesResult.data,
    fetchPopulationParam,
  ]);

  const options = useMemo(() => {
    const series = populationDataList.map((populationData) => {
      const totalPopulationData = populationData.data.find(
        (pd) => pd.label === '?????????',
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
      <div className={styles.title}>??????????????? ?????????</div>
      <div className={styles.wrapper}>
        <div className={styles.prefectures_area}>
          <div className={styles.section_title}>??????????????????</div>
          {fetchPrefecturesResult.isLoading && <>??????????????????</>}
          {fetchPrefecturesResult.isError && (
            <>????????????????????????????????????????????????</>
          )}
          {fetchPrefecturesResult.data && (
            <CheckBoxList
              data={fetchPrefecturesResult.data.result}
              selectedPrefectures={selectedPrefectures}
              onChange={changeHandler}
              isDisabled={fetchPopulationDataResult.isLoading}
            />
          )}
        </div>
        <div className={styles.graph_area}>
          {fetchPopulationDataResult.isError && (
            <>?????????????????????????????????????????????</>
          )}
          <HighchartsReact
            containerProps={{ style: { height: '100%' } }}
            highcharts={getHighchartsInstance()}
            options={options}
          />
        </div>
      </div>
    </>
  );
};

export default Main;
