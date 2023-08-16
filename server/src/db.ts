import * as mysql from "mysql";
import * as dotnev from "dotenv";
import { columnTypes } from "./dbConfig";

dotnev.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});

connection.connect((err: mysql.MysqlError | null) => {
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

function checkAndCreateDatabase(callback: () => void) {
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
        } else {
            connection.config.database = dbName;
            console.log(`Using database: ${dbName}`);
            callback();
        }
    });
}

function createDatabase(callback: () => void) {
    const dbName = process.env.DB_NAME;

    connection.query(`CREATE DATABASE ${dbName}`, (err) => {
        if (err) {
            console.error("Error creating database:", err);
        } else {
            console.log("Database created.");
        }
        callback();
    });
}

function checkAndCreateTable() {
    const tableName = "kantory";
    const createTableQuery = generateCreateTableQuery(tableName, columnTypes);

    connection.query(`USE ${process.env.DB_NAME}`, (err: mysql.MysqlError | null) => {
        if (err) {
            console.error("Error selecting database:", err);
            return;
        }

        connection.query(createTableQuery, (err: mysql.MysqlError | null) => {
            if (err) {
                console.error("Error creating or checking table:", err);
            } else {
                console.log("Table 'kantory' created or already exists.");
                alterTable();
            }
        });
    });
}

function generateCreateTableQuery(tableName: string, columnTypes: {}): string {
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

    connection.query(existingColumnsQuery, (err: mysql.MysqlError | null, rows: { COLUMN_NAME: string }[]) => {
        if (err) {
            console.error("Error getting existing columns:", err);
            return;
        }

        const existingColumns = rows.map((row) => row.COLUMN_NAME);

        const desiredColumns: string[] = Object.keys(columnTypes);

        const columnsToAdd = desiredColumns.filter((column) => !existingColumns.includes(column as string));

        if (columnsToAdd.length > 0) {
            const alterTableQueries: string[] = columnsToAdd.map((column) => {
                if (!existingColumns.includes(column)) {
                    const fieldType = columnTypes[column];
                    return `ALTER TABLE kantory ADD COLUMN ${column} ${fieldType};`;
                }
                return '';
            });

            executeAlterQueries(alterTableQueries);
        } else {
            console.log("No new columns to add.");
        }
    });
}

function executeAlterQueries(queries: string[]) {
    function executeNextQuery(index: number) {
        if (index < queries.length) {
            const query = queries[index];
            connection.query(query, (err: mysql.MysqlError | null) => {
                if (err) {
                    console.error("Error altering table:", err);
                } else {
                    console.log("ALTER TABLE query executed:", query);
                    executeNextQuery(index + 1); 
                }
            });
        } else {
            console.log("All ALTER TABLE queries executed.");
        }
    }

    executeNextQuery(0); 
}

export default connection;