import axios from "axios";
import { useEffect, useState } from "react";
import { KantorData } from "@shared/interfaces";
import { KantorShowAll } from "./kantorShowAll";

export const KantorShow = () => {
    const [kantorDataAll, setKantorDataAll] = useState<KantorData[]>([]);
    useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get("/api/kantor-data");
            setKantorDataAll(response.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
        fetchData();
      }, []);
      console.log(kantorDataAll);
    return (
        <div>
      {kantorDataAll.length > 0 ? (
        <KantorShowAll kantorDataAll={kantorDataAll} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};