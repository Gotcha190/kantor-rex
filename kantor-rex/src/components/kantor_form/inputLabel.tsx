import React from "react";
import styles from "./kantorForm.module.scss";
import classNames from "classnames";

interface InputLabelProps {
  label: string;
  type: string;
  name: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
}

const InputLabel: React.FC<InputLabelProps> = ({ label, type, name, value, onChange, className }) => {
  return (
    <div className={styles.form_component}>
      <label className={classNames(styles.form_label)}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
  );
};

export default InputLabel;
