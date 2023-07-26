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
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address 
    )}&key=${apiKey}`;
    const response = await axios.get(apiUrl);
    const { lat, lng } = response.data.results[0].geometry.location;
    res.json({ lat, lng });
  } catch (error) {
    console.error('Wystąpił błąd podczas geokodowania:', error.message);
    res.status(500).json({ error: 'Wystąpił błąd podczas geokodowania' });
  }
});

// app.post("/api/add-new-currency-exchange", (req, res) => {
//   const { lat, lng, title } = req.body;

//   // Przykład zapisu do bazy danych
//   const query = "INSERT INTO kantory (lat, lng, title) VALUES (?, ?, ?)";
//   connection.query(query, [lat, lng, title], (err, result) => {
//     if (err) {
//       console.error("Error adding new marker:", err);
//       res.status(500).send("Wystąpił błąd serwera.");
//     } else {
//       res.sendStatus(200);
//     }
//   });
// });
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
