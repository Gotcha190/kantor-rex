import { CurrencyButtonProps } from "@shared/interfaces";
import React from "react";
import styles from "./kantorList.module.scss";

const CurrencyButton: React.FC<CurrencyButtonProps> = ({
  currency,
  sortOrder,
  setSortOrder,
  kantors,
  setKantors,
}) => {
  const handleSortClick = () => {
    const newSortOrder = sortOrder === "ASC" ? "DESC" : "ASC";
    setSortOrder(newSortOrder);

    const sortedKantors = [...kantors].sort((a, b) => {
      const valueA =
        typeof a[`${currency}_buy`] === "number"
          ? (a[`${currency}_buy`] as number | null)
          : parseFloat(a[`${currency}_buy`] as string) || null;
      const valueB =
        typeof b[`${currency}_buy`] === "number"
          ? (b[`${currency}_buy`] as number | null)
          : parseFloat(b[`${currency}_buy`] as string) || null;

      if (valueA === null && valueB === null) return 0;
      if (valueA === null) return 1;
      if (valueB === null) return -1;

      if (newSortOrder === "ASC") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    setKantors(sortedKantors);
  };

  return (
    <div className={styles.currency}>
      <div className={styles.currencyWrapper}>
        <div className={styles.currencyName}>{currency.toUpperCase()}</div>
        <div className={styles.currencyButtons}>
          <button onClick={handleSortClick}>kupno</button>
          <button onClick={handleSortClick}>Sprzedaż</button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyButton;
