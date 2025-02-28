const express = require('express');
const cors = require('cors');

const port = process.env.port || 8000
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('minix_backend is running...');
});

app.listen(port, () => console.log(`Server running on port ${port}`));