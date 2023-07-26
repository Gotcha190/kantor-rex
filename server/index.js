const mysql = require('mysql');
const dotnev = require('dotenv');
const express = require("express");
const axios = require("axios");
const PORT = process.env.PORT || 3002;
const app = express();
dotnev.config();

app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database!");
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/kantor-data", (req, res) => {
  connection.query("SELECT * FROM kantory", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Wystąpił błąd serwera.");
    } else {
      res.json(result);
    }
  });
});

app.post('/geocode', async (req, res) => {
  const { street, city } = req.body;
  const country = 'Polska';
  const address = `${street}, ${city}, ${country}`;

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const region = 'PL'; // Kod kraju, w którym ma odbywać się geokodowanie (w tym przypadku Polska)
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}&region=${region}`;

    const response = await axios.get(apiUrl);
    const results = response.data.results;
    // console.log(response);
    // console.log(results);
    // Sprawdzenie, czy otrzymano jakiekolwiek wyniki geokodowania
    if (results.length === 0) {
      return res.status(404).json({ error: 'Nie znaleziono adresu.' });
    }

    // Sprawdzenie, czy pierwszy wynik jest na poziomie ulicy (ROOFTOP)
    const firstResult = results[0];
    const types = firstResult.types;
    if (!types.includes('street_address') && !types.includes('premise')) {
      return res.status(400).json({ error: 'Nieprawidłowy adres - brak wyników na poziomie ulicy.' });
    }

    // Sprawdzenie, czy adres zawiera komponenty związane z podanym miastem
    const addressComponents = firstResult.address_components;
    const cityComponent = addressComponents.find(component => component.types.includes('locality'));
    if (!cityComponent || cityComponent.long_name.toLowerCase() !== city.toLowerCase()) {
      return res.status(400).json({ error: 'Nie znaleziono podanego miasta.' });
    }

    const { lat, lng } = firstResult.geometry.location;
    res.json({ lat, lng });
  } catch (error) {
    console.error('Wystąpił błąd podczas geokodowania:', error.message);
    res.status(500).json({ error: 'Wystąpił błąd podczas geokodowania' });
  }
});

app.post('/api/add-new-currency-exchange', (req, res) => {
  const { lat, lng, street ,city, country, title } = req.body;

  const sqlQuery = 'INSERT INTO kantory (lat, lng, street, city, country, title) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [lat, lng, street, city, country, title];

  connection.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error('Błąd podczas zapisywania markera:', err);
      return res.status(500).json({ error: 'Błąd podczas zapisywania markera' });
    }

    console.log('Zapisano nowy marker:', result.insertId);
    return res.status(201).json({ message: 'Zapisano nowy marker', markerId: result.insertId });
  });
});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
