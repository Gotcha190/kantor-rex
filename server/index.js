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

app.get('/map-api', async (req, res) => {
  // const { latitude, longitude } = { 54.465336805884164: 17.02574142924235 };
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  try {
    // Wywołanie zapytania do Google Maps API

    // const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=54.465336805884164,17.02574142924235&key=${apiKey}`);
    
    // Przetwarzanie odpowiedzi
    const data = response.data;
    // Tutaj możesz manipulować danymi zwróconymi przez API i przekazywać je do klienta

    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Wystąpił błąd serwera.');
  }
});

app.post("/api/add-new-currency-exchange", (req, res) => {
  const { lat, lng, title } = req.body;

  // Przykład zapisu do bazy danych
  const query = "INSERT INTO kantory (lat, lng, title) VALUES (?, ?, ?)";
  connection.query(query, [lat, lng, title], (err, result) => {
    if (err) {
      console.error("Error adding new marker:", err);
      res.status(500).send("Wystąpił błąd serwera.");
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
