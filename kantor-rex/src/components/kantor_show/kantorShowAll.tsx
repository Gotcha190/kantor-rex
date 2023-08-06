import { KantorData } from "@shared/interfaces";

export const KantorShowAll = ({ kantorDataAll }: { kantorDataAll: KantorData[] }) => {
    return (
      <div>
      <h1>Kantor Data</h1>
        {kantorDataAll.map((item: KantorData) => (
            <div>
              <h3>{item.company_name}</h3>
            <strong>City:</strong> {item.city}<br />
            <strong>Street:</strong> {item.street}<br />
            <strong>Country:</strong> {item.country}<br />
            <strong>Latitude:</strong> {item.lat}<br />
            <strong>Longitude:</strong> {item.lng}
            </div>
        ))}
    </div>
  );
};