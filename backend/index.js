require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((error) => {
    if(error) throw error;
    console.log('Connection Successfull')
})



    app.get('/api/todo', (req,resp) => {
        const sql = 'SELECT * FROM todo where status = 0';
        db.query(sql, (error, result) => {
            if (error) {
                throw error;
            }
            resp.json(result);
        })
    });

    app.get('/api/todo/donetask', (req,resp) => {
        const sql = 'SELECT * FROM todo where status = 1';
        db.query(sql, (error, result) => {
            if (error) {
                throw error;
            }
            resp.json(result);
        })
    });

    app.post('/api/todo', (req, res) => {
        const { task, status } = req.body; // Extract task and status from the request body
        const sql = 'INSERT INTO todo (task, status) VALUES (?, ?)';
        
        db.query(sql, [task, status], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            const insertedId = result.insertId; // Get the inserted record ID
            const sqlSelect = 'SELECT * FROM todo WHERE id = ?';
        
        // Fetch the inserted row
        db.query(sqlSelect, [insertedId], (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            // Respond with the full inserted record
            res.json(rows[0]);
        });
            //res.json({ id: result.insertId, task: req.task, status : req.status }); // Send the inserted record ID
        });
    });

    app.post('/api/todo/markdone', (req, res) => {
        const { id, task, status } = req.body; // Extract task and status from the request body
        const sql = 'UPDATE todo SET status = 1 where id = ?';
        
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (result.affectedRows === 0) {
                // If no rows were updated, return an error response
                return res.status(404).json({ error: 'Task not found or already marked as done' });
            }
    
            // Send back the updated record ID
            res.json({ id: id });
        });
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });