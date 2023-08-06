"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql"));
const dotnev = __importStar(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = process.env.PORT || 3002;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
dotnev.config();
app.use(express_1.default.json());
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
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
        }
        else {
            res.json(result);
        }
    });
});
app.post("/geocode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { street, city } = req.body;
    const country = "Polska";
    const address = `${street}, ${city}, ${country}`;
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const region = "PL";
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&region=${region}`;
        const response = yield axios_1.default.get(apiUrl);
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
        const cityComponent = addressComponents.find((component) => component.types.includes("locality"));
        if (!cityComponent ||
            cityComponent.long_name.toLowerCase() !== city.toLowerCase()) {
            return res.status(400).json({ error: "Nie znaleziono podanego miasta." });
        }
        const { lat, lng } = firstResult.geometry.location;
        res.json({ lat, lng });
    }
    catch (error) {
        console.error("Wystąpił błąd podczas geokodowania:", error.message);
        res.status(500).json({ error: "Wystąpił błąd podczas geokodowania" });
    }
}));
app.post("/api/add-new-currency-exchange", (req, res) => {
    const requestData = req.body;
    const kantorDataFields = Object.keys(requestData).filter((field) => field in requestData);
    const values = kantorDataFields.map((field) => requestData[field]);
    const fieldNames = kantorDataFields.join(", ");
    const placeholders = Array.from({ length: kantorDataFields.length }, () => "?").join(", ");
    const sqlQuery = `INSERT INTO kantory (${fieldNames}) VALUES (${placeholders})`;
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
