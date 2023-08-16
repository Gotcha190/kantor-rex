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
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql"));
const dotnev = __importStar(require("dotenv"));
const dbConfig_1 = require("./dbConfig");
dotnev.config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL!");
    checkAndCreateDatabase(() => {
        connection.config.database = process.env.DB_NAME;
        checkAndCreateTable();
    });
});
function checkAndCreateDatabase(callback) {
    const dbName = process.env.DB_NAME;
    connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`, (err, rows) => {
        if (err) {
            console.error("Error checking if database exists:", err);
            connection.end();
            return;
        }
        if (rows.length === 0) {
            createDatabase(() => {
                connection.config.database = dbName;
                console.log(`Using database: ${dbName}`);
                callback();
            });
        }
        else {
            connection.config.database = dbName;
            console.log(`Using database: ${dbName}`);
            callback();
        }
    });
}
function createDatabase(callback) {
    const dbName = process.env.DB_NAME;
    connection.query(`CREATE DATABASE ${dbName}`, (err) => {
        if (err) {
            console.error("Error creating database:", err);
        }
        else {
            console.log("Database created.");
        }
        callback();
    });
}
function checkAndCreateTable() {
    const tableName = "kantory";
    const createTableQuery = generateCreateTableQuery(tableName, dbConfig_1.columnTypes);
    connection.query(`USE ${process.env.DB_NAME}`, (err) => {
        if (err) {
            console.error("Error selecting database:", err);
            return;
        }
        connection.query(createTableQuery, (err) => {
            if (err) {
                console.error("Error creating or checking table:", err);
            }
            else {
                console.log("Table 'kantory' created or already exists.");
                alterTable();
            }
        });
    });
}
function generateCreateTableQuery(tableName, columnTypes) {
    const columns = Object.entries(columnTypes)
        .map(([columnName, columnType]) => `${columnName} ${columnType}`)
        .join(", ");
    return `CREATE TABLE IF NOT EXISTS ${tableName} (id INT PRIMARY KEY AUTO_INCREMENT, ${columns})`;
}
function alterTable() {
    const existingColumnsQuery = `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'kantory';
    `;
    connection.query(existingColumnsQuery, (err, rows) => {
        if (err) {
            console.error("Error getting existing columns:", err);
            return;
        }
        const existingColumns = rows.map((row) => row.COLUMN_NAME);
        const desiredColumns = Object.keys(dbConfig_1.columnTypes);
        const columnsToAdd = desiredColumns.filter((column) => !existingColumns.includes(column));
        if (columnsToAdd.length > 0) {
            const alterTableQueries = columnsToAdd.map((column) => {
                if (!existingColumns.includes(column)) {
                    const fieldType = dbConfig_1.columnTypes[column];
                    return `ALTER TABLE kantory ADD COLUMN ${column} ${fieldType};`;
                }
                return '';
            });
            executeAlterQueries(alterTableQueries);
        }
        else {
            console.log("No new columns to add.");
        }
    });
}
function executeAlterQueries(queries) {
    function executeNextQuery(index) {
        if (index < queries.length) {
            const query = queries[index];
            connection.query(query, (err) => {
                if (err) {
                    console.error("Error altering table:", err);
                }
                else {
                    console.log("ALTER TABLE query executed:", query);
                    executeNextQuery(index + 1);
                }
            });
        }
        else {
            console.log("All ALTER TABLE queries executed.");
        }
    }
    executeNextQuery(0);
}
exports.default = connection;
