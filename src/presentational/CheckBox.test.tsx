import { fireEvent, render, screen } from '@testing-library/react';
import { ChangeEvent, useState } from 'react';
// import { rest } from 'msw';
// import { setupServer } from 'msw/node';
import CheckBox from './CheckBox';

describe('CheckBoxのテスト', () => {
  it('チェックが入っている場合', () => {
    const { asFragment } = render(
      <CheckBox value="1" checked={true} label="北海道" onChange={jest.fn} />,
    );
    const checkbox = screen.getByLabelText('北海道');
    expect(checkbox).toBeChecked();
    expect(asFragment()).toMatchSnapshot();
  });

  it('チェックが入っていない場合', () => {
    const { asFragment } = render(
      <CheckBox value="1" checked={false} label="北海道" onChange={jest.fn} />,
    );
    const checkbox = screen.getByLabelText('北海道');
    expect(checkbox).not.toBeChecked();
    expect(asFragment()).toMatchSnapshot();
  });

  it('チェックボックスをクリックしてチェックの状態が変わるか', () => {
    const WrapperComponent = () => {
      const [isChecked, setIsChecked] = useState<boolean>(false);
      const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
      };
      return (
        <CheckBox
          value="1"
          checked={isChecked}
          label="北海道"
          onChange={changeHandler}
        />
      );
    };

    render(<WrapperComponent />);
    const checkbox = screen.getByLabelText('北海道');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
