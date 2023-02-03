import { render, screen } from '@testing-library/react';
import { Prefectures } from '../api/fetch-data';
import CheckBoxList from './CheckBoxList';

describe('CheckBoxListのテスト', () => {
  it('データが0件の場合', () => {
    const data: Prefectures[] = [];
    const selectedPrefectures: string[] = [];
    const { asFragment } = render(
      <CheckBoxList
        data={data}
        selectedPrefectures={selectedPrefectures}
        onChange={jest.fn}
      />,
    );
    const checkBoxList = screen.queryAllByRole('checkbox');
    expect(checkBoxList.length).toBe(0);
    expect(asFragment()).toMatchSnapshot();
  });

  it('データがある場合。(データ全てが選択されている状態)', () => {
    const data: Prefectures[] = [
      { prefCode: '1', prefName: '北海道' },
      { prefCode: '2', prefName: '青森県' },
      { prefCode: '3', prefName: '岩手県' },
    ];
    const selectedPrefectures: string[] = ['1', '2', '3'];
    const { asFragment } = render(
      <CheckBoxList
        data={data}
        selectedPrefectures={selectedPrefectures}
        onChange={jest.fn}
      />,
    );
    const checkBoxList = screen.queryAllByRole('checkbox');
    expect(checkBoxList.length).toBe(3);
    checkBoxList.forEach((v) => {
      expect(v).toBeChecked();
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('データがある場合。(データ全てが選択されていない状態)', () => {
    const data: Prefectures[] = [
      { prefCode: '1', prefName: '北海道' },
      { prefCode: '2', prefName: '青森県' },
      { prefCode: '3', prefName: '岩手県' },
    ];
    const selectedPrefectures: string[] = [];
    const { asFragment } = render(
      <CheckBoxList
        data={data}
        selectedPrefectures={selectedPrefectures}
        onChange={jest.fn}
      />,
    );
    const checkBoxList = screen.queryAllByRole('checkbox');
    expect(checkBoxList.length).toBe(3);
    checkBoxList.forEach((v) => {
      expect(v).not.toBeChecked();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
