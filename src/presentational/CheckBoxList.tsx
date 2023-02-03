import { ChangeEventHandler } from 'react';
import { Prefectures } from '../api/fetch-data';
import CheckBox from './CheckBox';

type Props = {
  data: Prefectures[];
  selectedPrefectures: string[];
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const CheckBoxList = (props: Props) => {
  return (
    <>
      {props.data.map((prefecture) => {
        return (
          <CheckBox
            key={prefecture.prefCode}
            value={prefecture.prefCode}
            label={prefecture.prefName}
            checked={props.selectedPrefectures.some(
              (selectedPrefecture) =>
                selectedPrefecture === String(prefecture.prefCode),
            )}
            onChange={props.onChange}
          />
        );
      })}
    </>
  );
};

export default CheckBoxList;
