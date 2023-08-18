import { KantorData } from "@shared/interfaces";
import { useLocation } from "react-router-dom";
import Map from "../map/map";
import styles from "./kantorShowSelected.module.scss";

export const KantorShowSelected = () => {
  const location = useLocation();
  const { state } = location;

  if (!state || !state.kantor) {
    return <div>No kantor data available.</div>;
  }
  const kantor = state.kantor as KantorData;
  const currencyFields: string[] = state.currencyFields;
  console.log(kantor);
  console.log(currencyFields);
  return (
    <div className={styles.container}>
      <Map selectedMarker={kantor}/>
      <div className={styles.data}>
        <h1>{kantor.company_name}</h1>
        <p>
          Adres: {kantor.street} {kantor.city}
        </p>
        <h4>Kursy wymiany</h4>
        {currencyFields.map((currency) => (
          <div key={currency}>
            <p>{currency.toUpperCase()}</p>
            <p>
              {`${kantor[`${currency}_buy`]} / ${kantor[`${currency}_sell`]}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
