
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3310;

// Use CORS middleware
app.use(cors());

const corsOptions = {
    //origin: '*', // Allow requests from this origin
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Chitwan$1',
    database: 'form',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + db.threadId);
});

app.use(bodyParser.json());

app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM NameEmail ORDER BY id', (err, result) => {
        if (err) {
            console.error('Error executing MySQL query: ' + err.stack);
            res.status(500).json({ error: 'Internal Server Error here' });
            return;
        }
        res.json(result);
    });
});

app.post('/api/data', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO NameEmail (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query: ' + err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ id: result.insertId, name, email });
    });
});

app.put('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    };

    db.query('UPDATE NameEmail SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query: ' + err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ id, name, email });
    });
});

app.delete('/api/data/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM NameEmail WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query: ' + err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
