// Configure express
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Configure env variables
require('dotenv').config()

// Db config
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

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/get-all', async (req, res) => {
    const connection = await sql.connect(config)
    const qResult = await sql.query('SELECT * FROM SensorReadings')
    connection.close()
    res.send(qResult)
})

app.post('/insert', async (req, res) => {
    const connection = await sql.connect(config)

    const data = req.body.data

    if (data.length < 11) {
        res.send({
            result: "failure",
            data: "Body had less than 11 values."
        })
        connection.close()
    }

    const columns = "DeviceNumber, ReadingTime, AccelerationX, AccelerationY, AccelerationZ, AngVelocityX, AngVelocityY, AngVelocityZ, AngX, AngY, AngZ"
    const values = `'${data[0]}', '${data[1]}', ${data[2]}, ${data[3]}, ${data[4]}, ${data[5]}, ${data[6]}, ${data[7]}, ${data[8]}, ${data[9]}, ${data[10]}`

    const iResult = await sql.query(`INSERT INTO SensorReadings (${columns}) VALUES (${values})`)

    connection.close()
    res.send({
        result: "success",
        data: iResult
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

