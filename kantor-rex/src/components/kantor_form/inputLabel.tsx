import React, { useState } from "react";
import styles from "./kantorForm.module.scss";
import classNames from "classnames";
import { InputLabelProps } from "../interfaces";

const InputLabel: React.FC<InputLabelProps> = ({ label, type, name, value, onChange, className }) => {
  const isNumberType = type === "number";

  // Define separate states for string and numeric types
  const [stringValue, setStringValue] = useState<string>(isNumberType ? String(value) : value.toString());
  const [numericValue, setNumericValue] = useState<number>(isNumberType ? Number(value) : Number(value));

  const formatNumericValue = (val: number): number => {
    const integerPartLength = Math.floor(Math.abs(val)).toString().length;
    const shift = Math.pow(10, integerPartLength - 1);
    const roundedValue = Math.round(val / shift * 10000) / 10000;
    return Number(roundedValue.toFixed(4));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
  
    // Update the corresponding state based on the type
    if (isNumberType) {
      const parsedValue = parseFloat(newValue);
      if (!isNaN(parsedValue)) {
        setNumericValue(parsedValue);
        const formattedValue = formatNumericValue(parsedValue);
  
        // Keep the value as a number for numeric inputs
        onChange({ ...event, target: { ...event.target, value: formattedValue.toString() } });
      }
    } else {
      setStringValue(newValue);
      onChange(event);
    }
  };
  

  const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumberType) {
      const formattedValue = formatNumericValue(numericValue);
      setNumericValue(formattedValue);
      onChange({ ...event, target: { ...event.target, value: formattedValue.toString() } });
    } else {
      onChange(event);
    }
  };

  return (
    <div className={styles.form_component}>
      <label className={classNames(styles.form_label)}>{label}</label>
      <input
        type={type}
        name={name}
        value={isNumberType ? (numericValue === 0 ? "" : numericValue.toString()) : stringValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        min={isNumberType ? "0" : undefined}
        className={className}
      />
    </div>
  );
};

export default InputLabel;
