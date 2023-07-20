require('dotenv').config();
const express = require("express");
const axios = require("axios");

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
