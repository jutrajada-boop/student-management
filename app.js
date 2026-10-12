
const express = require('express');
const mysql = require('mysql2');

const app = express();

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student_management'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }

    console.log('Connected to MySQL');
});

// EJS and middleware setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Activity 9: Homepage - Display all students
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM students ORDER BY id DESC';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving students:', err);
            return res.status(500).send('Error retrieving students');
        }

        res.render('index', { students: results });
    });
}); // IMPORTANT: Close the homepage route here!

// Activity 12: Display the Add Student Form
app.get('/students/add', (req, res) => {
    res.render('add');
});

// Activity 13: Save Student Data
app.post('/students/add', (req, res) => {
    const {
        student_id,
        first_name,
        last_name,
        course,
        year_level,
        email
    } = req.body;

    const sql = `
        INSERT INTO students
        (student_id, first_name, last_name, course, year_level, email)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        student_id,
        first_name,
        last_name,
        course,
        year_level,
        email
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            return res.status(500).send(
                'Error adding student. Please check your input.'
            );
        }

        res.redirect('/');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
