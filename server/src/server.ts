import * as mysql from "mysql";
import * as dotnev from "dotenv";
import { Request, Response } from "express";
import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import connection from "./db";
import { KantorData } from "@shared/interfaces";

const PORT = process.env.PORT || 3002;
const app = express();
app.use(bodyParser.json());
dotnev.config();

app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/kantor-data", (req: Request, res: Response) => {
  connection.query("SELECT * FROM kantory", (err: mysql.MysqlError | null, result: any) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Wystąpił błąd serwera.");
    } else {
      res.json(result);
    }
  });
});

app.post("/geocode", async (req: Request, res: Response) => {
  const { street, city } = req.body;
  const country = "Polska";
  const address = `${street}, ${city}, ${country}`;

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const region = "PL";
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}&region=${region}`;

    const response = await axios.get(apiUrl);
    const results = response.data.results;

    if (results.length === 0) {
      return res.status(404).json({ error: "Nie znaleziono adresu." });
    }

    const firstResult = results[0];
    const types = firstResult.types;
    if (!types.includes("street_address") && !types.includes("premise")) {
      return res.status(400).json({
        error: "Nieprawidłowy adres - brak wyników na poziomie ulicy.",
      });
    }

    const addressComponents = firstResult.address_components;
    const cityComponent = addressComponents.find((component: Record<string, any>) =>
      component.types.includes("locality")
    );
    if (
      !cityComponent ||
      cityComponent.long_name.toLowerCase() !== city.toLowerCase()
    ) {
      return res.status(400).json({ error: "Nie znaleziono podanego miasta." });
    }

    const { lat, lng } = firstResult.geometry.location;
    res.json({ lat, lng });
  } catch (error: any) {
    console.error("Wystąpił błąd podczas geokodowania:", error.message);
    res.status(500).json({ error: "Wystąpił błąd podczas geokodowania" });
  }
});

app.post("/api/add-new-currency-exchange", (req: Request, res: Response) => {
  const requestData: KantorData = req.body;

  const kantorDataFields = Object.keys(requestData).filter(
    (field) => field in requestData && requestData[field] !== ''
  );
  
  const values = kantorDataFields.map((field) => {
    if (requestData[field] === '' || requestData[field] === "") {
      return null; 
    }
    return requestData[field];
  });
  
  const placeholders = Array.from(
    { length: kantorDataFields.length },
    () => '?'
  ).join(', ');
  
  const sqlQuery = `INSERT INTO kantory (${kantorDataFields.join(', ')}) VALUES (${placeholders})`;

  connection.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error("Błąd podczas zapisywania kantoru:", err);
      return res.status(500).json({ error: "Błąd podczas zapisywania kantoru" });
    }

    console.log("Zapisano nowy kantor:", result.insertId);
    return res
      .status(201)
      .json({ message: "Zapisano nowy kantor", kantorId: result.insertId });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
