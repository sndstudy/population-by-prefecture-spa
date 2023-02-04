import { ChangeEventHandler } from 'react';
import { Prefectures } from '../api/fetch-data';
import CheckBox from './CheckBox';

type Props = {
  data: Prefectures[];
  selectedPrefectures: string[];
  isDisabled: boolean;
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
            isDisabled={props.isDisabled}
            onChange={props.onChange}
          />
        );
      })}
    </>
  );
};

export default CheckBoxList;
