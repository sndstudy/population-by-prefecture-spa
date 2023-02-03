import { ChangeEventHandler } from 'react';

type Props = {
  value: string;
  checked: boolean;
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const CheckBox = (props: Props) => {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          value={props.value}
          checked={props.checked}
          onChange={props.onChange}
        />
        {props.label}
      </label>
    </div>
  );
};

export default CheckBox;
