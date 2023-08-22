## Welcome to KantorRex project!

This is my attempt to create a website using React and Node.js. Both sides are using Typescript. This project was created not knowing the language so for sure many things could be done better.


## Files

This project is divided into 3 folders:

### kantor-rex

This is where the client page is located, add the .env file here, which should look like this:

#### .env

    REACT_APP_GOOGLE_MAPS_API_KEY=add_your_key_without_quotes

### Server

This is where the server-side is located, add the .env file here, which should look like this:

#### .env

    GOOGLE_MAPS_API_KEY=add_your_key_without_quotes
    DB_HOST=localhost
    DB_USER=add_your_mysql_user_name
    DB_PASS=add_your_mysql_user_password
    DB_NAME=add_your_db_name

### Shared

This is where interfaces are located to be accessible by both client and server-side

## Requirements

 - Npm
 - Node.js
 - Mysql
 - Google Maps Api Key: https://console.cloud.google.com/

## Instalation

 1. clone the repository
 2. create and configure .env files as shown above 
 3. go to the pulled repo server (" /kantor-rex/server")
 4. npm install
 5. npm start
 6. go to the pulled repo client (" /kantor-rex/kantor-rex")
 7. npm install
 8. npm start
