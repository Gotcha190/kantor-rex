import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { KantorData } from "@shared/interfaces";
import styles from "./kantorList.module.scss";
import CurrencyButton from "./currencyButton";

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

  if (kantors.length === 0) {
    return <div>Loading...</div>;
  }

  const currencyFields = [...new Set(
    kantors.flatMap(kantor => Object.keys(kantor))
      .filter(key => key.endsWith("_buy"))
      .map(key => key.replace("_buy", ""))
  )];

  const goRouteId = (kantor: KantorData) => {
    const nameId = kantor.company_name + "-" + kantor.id;
    navigate(`/show/${nameId}`, { state: { kantor , currencyFields} });
  };

  return (
    <div className={styles.container}>
      <table className={styles.kantorTable}>
        <thead>
          <tr className={styles.labels}>
            <th>Nazwa Kantoru</th>
            <th>Ulica</th>
            <th>Miasto</th>
            {currencyFields.map((currency) => (
              <th key={currency}>
                <CurrencyButton
                  currency={currency}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  kantors={kantors}
                  setKantors={setKantors}
                />
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
              {currencyFields.map((currency) => (
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