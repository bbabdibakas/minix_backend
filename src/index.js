require("dotenv").config();
const express = require('express');
const cors = require('cors');
const router = require('./router/index')

const port = process.env.port || 8000
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', router);

app.listen(port, () => console.log(`Server running on port ${port}`));