import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { KantorData } from "@shared/interfaces";
import styles from "./kantorList.module.scss";

export const KantorList = () => {
  const [kantors, setKantors] = useState<KantorData[]>([]);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/kantor-data");
        setKantors(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleSortByField = (field: keyof KantorData) => {
    const sortedKantors = [...kantors].sort((a, b) => {
      const valueA =
        typeof a[field] === "number"
          ? (a[field] as number | null)
          : parseFloat(a[field] as string) || null;
      const valueB =
        typeof b[field] === "number"
          ? (b[field] as number | null)
          : parseFloat(b[field] as string) || null;

      if (valueA === null && valueB === null) return 0;
      if (valueA === null) return 1;
      if (valueB === null) return -1;

      if (sortOrder === "ASC") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    setKantors(sortedKantors);
  };

  const getCurrencyFields = (kantors: KantorData[]) => {
    const currencyData: string[] = [];

    kantors.forEach((kantor) => {
      Object.keys(kantor).forEach((key) => {
        if (key.endsWith("_buy")) {
          const currency = key.replace("_buy", "");
          if (!currencyData.includes(currency)) {
            currencyData.push(currency);
          }
        }
      });
    });

    return currencyData;
  };

  const goRouteId = (kantor: KantorData) => {
    const nameId = kantor.company_name + "-" + kantor.id;
    navigate(`/show/${nameId}`, { state: {kantor}});
  };

  if (kantors.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <table className={styles.kantorTable}>
        <thead>
          <tr className={styles.labels}>
            <th>Nazwa Kantoru</th>
            <th>Ulica</th>
            <th>Miasto</th>
            {getCurrencyFields(kantors).map((currency) => (
              <th key={currency} className={styles.currency}>
                <div className={styles.currencyWrapper}>
                  <div className={styles.currencyName}>
                    {currency.toUpperCase()}
                  </div>
                  <div className={styles.currencyButtons}>
                    <button
                      onClick={() =>
                        handleSortByField(`${currency}_buy` as keyof KantorData)
                      }
                    >
                      kupno
                    </button>
                    <button
                      onClick={() =>
                        handleSortByField(
                          `${currency}_sell` as keyof KantorData
                        )
                      }
                    >
                      sprzedaż
                    </button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kantors.map((kantor) => (
            <tr
              onClick={() => goRouteId(kantor)}
              key={kantor.company_name}
              className={styles.clickableRow}
            >
              <td>{kantor.company_name}</td>
              <td>{kantor.street}</td>
              <td>{kantor.city}</td>
              {getCurrencyFields(kantors).map((currency) => (
                <td key={currency}>
                  {`${kantor[`${currency}_buy`]} / ${
                    kantor[`${currency}_sell`]
                  }`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
