require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = "shaunak";

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

    app.post('/register', async (req, res) => {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(sql, [username, email, hashedPassword], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ message: "User registered successfully!" });
          });
    });

    app.post('/login', (req,res) => {
        const { email, password } = req.body;
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], async (err, results) => {
            if (results.length === 0)
                return res.status(401).json({ message: "Invalid email or password" });

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch)
                return res.status(401).json({ message: "Invalid email or password" });

            const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        })
    });


    app.get('/api/todo', (req,resp) => {
        let userId = 0;
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; 
        if (!token) return res.status(401).json({ message: "Unauthorized" });
      
        jwt.verify(token, SECRET_KEY, (err, user) => {
          if (!user.id) return res.status(403).json({ message: "Invalid User" });  
          
          if (err) return res.status(403).json({ message: "Forbidden" });

          userId = user.id;
      
          //res.json({ message: "Welcome to the profile page!", user });
        });

        const sql = 'SELECT * FROM todo where status = 0 and user_id = ?';
        db.query(sql, [userId],(error, result) => {
            if (error) {
                throw error;
            }
            resp.json(result);
        })
    });

    app.get('/api/todo/donetask', (req,resp) => {
        let userId = 0;
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; 
        if (!token) return res.status(401).json({ message: "Unauthorized" });
      
        jwt.verify(token, SECRET_KEY, (err, user) => {
          if (!user.id) return res.status(403).json({ message: "Invalid User" });  
          
          if (err) return res.status(403).json({ message: "Forbidden" });

          userId = user.id;
      
          //res.json({ message: "Welcome to the profile page!", user });
        });
        const sql = 'SELECT * FROM todo where status = 1 and user_id = ?';
        db.query(sql, [userId], (error, result) => {
            if (error) {
                throw error;
            }
            resp.json(result);
        })
    });

    app.post('/api/todo', (req, res) => {
        const { task, status } = req.body; // Extract task and status from the request body
        console.log(req.headers);
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; 
        console.log(token);
        let userId = 0;
      
        if (!token) return res.status(401).json({ message: "Unauthorized" });
      
        jwt.verify(token, SECRET_KEY, (err, user) => {
          if (!user.id) return res.status(403).json({ message: "Invalid User" });  
          
          if (err) return res.status(403).json({ message: "Forbidden" });

          userId = user.id;
      
          //res.json({ message: "Welcome to the profile page!", user });
        });

        const sql = 'INSERT INTO todo (task, status,user_id) VALUES (?, ?, ?)';
        db.query(sql, [task, status, userId], (err, result) => {
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