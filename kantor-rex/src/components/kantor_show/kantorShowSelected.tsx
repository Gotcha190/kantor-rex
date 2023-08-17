import { KantorData } from "@shared/interfaces";
import { useLocation } from "react-router-dom";

export const KantorShowSelected = () => {
  const location = useLocation();
  const {state} = location;

  if (!state || !state.kantor) {
    return <div>No kantor data available.</div>;
  }
  const kantor = state.kantor as KantorData;

    return (
      <div>
      <h1>{kantor.company_name}</h1>
    </div>
  );
};