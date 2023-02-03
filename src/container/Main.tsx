import { ChangeEvent, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchPrefectures } from '../api/fetch-data';
import CheckBoxList from '../presentational/CheckBoxList';
import styles from '../styles/Main.module.scss';

const Main = () => {
  const { data, isLoading } = useQuery('fetchPrefectures', fetchPrefectures);
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPrefectures((prev) => [...prev, e.target.value]);
    } else {
      setSelectedPrefectures((prev) =>
        prev.filter((v) => v !== e.target.value),
      );
    }
  };

  return (
    <>
      <div className={styles.title}>都道府県別 総人口</div>
      <div className={styles.wrapper}>
        <div className={styles.prefectures_area}>
          <div className={styles.section_title}>都道府県</div>
          {isLoading && <>データ取得中</>}
          {data && (
            <CheckBoxList
              data={data.result}
              selectedPrefectures={selectedPrefectures}
              onChange={change}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
