// Import express.js
//require("dotenv").config();
const express = require("express");
//const session = require('express-session');

//const mysql = require('mysql');
// Create express app
var mysql = require ('mysql')
const bodyParser = require('body-parser');
//const twilio = require('twilio');
const app = express();
const { Staff } = require('./models/staff');
const hostname = 'localhost';
//const db = require('./services/db');

app.use(express.urlencoded({ extended: true }));



// pug Templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use

var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


// welcome route
 


app.get('/welcome', function (req, res){
res.render('welcome');
});


//login route

const bcrypt = require ("bcryptjs");
//const = require (express-session)
const { User } = require("./models/staff");

  
// Initialize the number of login attempts to zero
let loginAttempts = 0;

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/authenticate', async function (req, res) {
  const { name, password } = req.body;
  try {
    // Check if the username and password are valid
    const sql = "SELECT staff.staff_id, staffRole.role_id FROM staff INNER JOIN staffRole ON staff.staff_id = staffRole.staff_id WHERE staff.name = ? AND staff.password = ?";
    const result = await db.query(sql, [name, password]);
    if (result.length > 0) {
      const { staff_id, role_id } = result[0];
      req.session.uid = staff_id;
      req.session.loggedIn = true;
      console.log(req.session);
      if (role_id === 26) { // doctor
        const sql3 = "SELECT * FROM patient";
        const patient_data = await db.query(sql3);
        res.render('patient_data', {patient: patient_data});
      } else if (role_id === 28) { // record officer
        const sql4 = "SELECT * FROM record";
        const record = await db.query(sql4);
        res.render('record', {record: record});
      } else if (role_id == 25) { // receptionist
        res.render('home');
      } else {
        res.send('unauthorised');
      }
    } else {
      // If invalid, increment the number of login attempts
      loginAttempts++;

      // If the user has exceeded the maximum number of login attempts
      if (loginAttempts >= 3) {
        // Display an error message and suggest the user to contact the system administrator
        res.status(401).send('You have exceeded the maximum number of login attempts. Please contact your system administrator.');
      } else {
        // If the user still has attempts left, display a message with the remaining attempts
        const remainingAttempts = 3 - loginAttempts;
        res.status(401).render('login2', { message: `Invalid username or password. Please try again. You have ${remainingAttempts} attempts remaining.` });
      }
    }
  } catch (err) {
    console.error(`Error while authenticating user: ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
});

  
// appointments route

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
  
app.get('/appointments', (req, res) => {
  const { app_number, app_datetime, patient_national_id } = req.body;
  let sql = 'SELECT * FROM appointment';
  let values = [];

  if (app_number) {
    sql += ' WHERE app_number = ?';
    values.push(app_number);
  }

  if (app_datetime) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' app_datetime = ?';
    values.push(app_datetime);
  }

  if (patient_national_id) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' patient_national_id = ?';
    values.push(patient_national_id);
  }

  db.query(sql, values)
    .then(results => {
      console.log(results);
      res.render('appointments', { appointment: results });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred');
    });
});

// patient_data route


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
  
app.get('/patient_data', (req, res) => {
  const { patient_national_id, name, dob, address, mobile, gender, nationality, next_of_kin, relationship, emergency_contact } = req.body;
  
  let sql = 'SELECT * FROM patient';
  let values = [];

  if (patient_national_id) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' patient_national_id = ?';
    values.push(patient_national_id);
  }

  if (name) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' name = ?';
    values.push(name);
  }

  if (dob) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' dob = ?';
    values.push(dob);
  }

  if (address) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' address = ?';
    values.push(address);
  }

  if (gender) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' gender = ?';
    values.push(gender);
  }

  if (nationality) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' nationality = ?';
    values.push(nationality);
  }

  if (next_of_kin) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' next_of_kin = ?';
    values.push(next_of_kin);
  }

  if (emergency_contact) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' emergency_contact = ?';
    values.push(emergency_contact);
  }
  db.query(sql, values)
  .then(results => {
    console.log(results);
    res.render('patient_data', { patient: results });
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('An error occurred');
  });
});



// get records route

app.get('/record', (req, res) => {
  const { record_number, record_datetime, Allergies, weight, height, blood_group, smoke, drink, patient_national_id } = req.query;
  let sql = 'SELECT * FROM record';
  let values = [];

  if (record_number) {
    sql += ' WHERE record_number = ?';
    values.push(record_number);
  }

  if (record_datetime) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' record_datetime = ?';
    values.push(record_datetime);
  }

  if (Allergies) {
    sql += ' WHERE Allergies = ?';
    values.push(Allergies);
  }

  if (weight) {
    sql += ' WHERE weight = ?';
    values.push(weight);
  }

  if (height) {
    sql += ' WHERE height = ?';
    values.push(height);
  }

  if (blood_group) {
    sql += ' WHERE blood_group = ?';
    values.push(blood_group);
  }

  if (drink) {
    sql += ' WHERE drink = ?';
    values.push(drink);
  }

  if (smoke) {
    sql += ' WHERE smoke = ?';
    values.push(smoke);
  }

  if (patient_national_id) {
    if (values.length === 0) {
      sql += ' WHERE';
    } else {
      sql += ' AND';
    }
    sql += ' patient_national_id = ?';
    values.push(patient_national_id);
  }

  db.query(sql, values)
  .then(results => {
    console.log(results);
    res.render('record', { record: results });
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('An error occurred');
  });
});


// get tests route

app.get('/test', (req, res) => {
  const { test_id, test_name, test_result, app_number } = req.query;
  let sql = 'SELECT * FROM test';
  let values = [];

  if (test_id) {
    sql += ' WHERE test_id = ?';
    values.push(test_id);
  }

  if (test_name) {
    sql += ' WHERE test_name = ?';
    values.push(test_name);
  }

  if (test_result) {
    sql += ' WHERE test_result = ?';
    values.push(test_result);
  }

  if (app_number) {
    sql += ' WHERE app_number = ?';
    values.push(app_number);
  }

  db.query(sql, values)
    .then(results => {
      console.log(results);
      res.render('test', { test: results });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred');
    });
});



// logout route

app.get('/logout', function (req, res) {
  res.render('logout');
});


const db = require('./services/db');
//ar db = require('/db');
//ergistration route
app.use(express.urlencoded({ extended: true }));

app.get('/registration', function (req, res){
  res.render('registration');
});

//submit to database
app.post('/submit', async function (req, res) {
  try {
    const { patient_national_id, name, dob, address, mobile, gender, nationality, next_of_kin, relationship, emergency_contact } = req.body;
    const params = [patient_national_id, name, dob, address, mobile, gender, nationality, next_of_kin, relationship, emergency_contact];
    
    // Replace any undefined values with null
    for (let i = 0; i < params.length; i++) {
      if (typeof params[i] === 'undefined') {
        params[i] = null;
      }
    }
    
    const sql = "INSERT INTO patient (patient_national_id, name, dob, address, mobile, gender, nationality, next_of_kin, relationship, emergency_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    console.log('Executing query:', sql);

    const result = await db.query(sql, params);
    console.log('Query result:', result);

    res.render('successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


 
// home page route
app.get('/home', function (req, res){
    res.render('home');
    });

    let verificationAttempts = 0;

// patient verification route
app.get('/verification', function (req, res) {
  res.render('verification');
});

app.post('/verify', async function (req, res) {
  try {
    const { name, national_id_number } = req.body;

    // Check if the patient with the given name and national ID number exists
    const sql = "SELECT * FROM patient WHERE name = ? AND patient_national_id = ?";
    const result = await db.query(sql, [name, national_id_number]);

    if (result.length > 0) {
      // Patient exists, render success page
      res.render('successful2');
    } else {
      // If invalid, increment the number of login attempts
      verificationAttempts++;

      // If the user has exceeded the maximum number of login attempts
      if (verificationAttempts >= 2) {
        // Display an error message and suggest the user to contact the system administrator
        res.status(401).send('You have exceeded the maximum number of verification attempts. Please contact your system administrator.');
      } else {
        // Patient doesn't exist, render error page
        res.render('verification2');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


 

app.use(express.urlencoded({ extended: true }));
  
app.post('/update/:id', (req, res) => {
  const testId = req.params.id;
  const { test_result } = req.body;

  // Update the record in the database
  const query = `UPDATE test SET test_result = '${test_result}' WHERE test_id = ${testId}`;
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error updating test result:', error);
      return;
    }
    console.log(`Record with ID ${testId} updated successfully`);
    res.render('logout'); // Redirect to the logout after the update
  });
});



    app.get('/db_test', function (req, res) {
      // Assumes a table called test_table exists in your database
      sql = 'select * from patient';
      db.query(sql).then(results => {
        console.log(results);
        res.send(results);
      });
    });


app.listen(3000, function() {
    console.log('server running http://127.0.0.1:3000/');});