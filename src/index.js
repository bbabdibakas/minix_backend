require("dotenv").config()
const express = require('express')
const cors = require('cors')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/errorMiddleware')
const prisma = require('./database/index')

const port = process.env.port || 8000
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', router)
app.use(errorMiddleware)


const checkDatabaseConnection = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

const start = async () => {
    await checkDatabaseConnection()

    app.listen(port, () => console.log(`Server running on port ${port}`))
}

void start()
