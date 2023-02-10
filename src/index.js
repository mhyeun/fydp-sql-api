// Configure express
const express = require('express')
const app = express()
const port = 3000

// Configure env variables
require('dotenv').config()

// Connect to db
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

const connectAndQuery = async () => {
    try {
        console.log("Attemping to connect to db...")
        var poolConnection = await sql.connect(config);
        console.log("Connected!")         
        
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

connectAndQuery()

app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})