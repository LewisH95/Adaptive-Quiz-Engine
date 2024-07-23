const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {response} = require("express");

const application = express();
const port = 3000;


application.use(bodyParser.json());
application.use(express.static(path.join(__dirname, '../src')));

// Hello World Front End Test Endpoint
application.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Back End Hello World fetch test from Spring Endpoint
application.get('/api/hello', async (req, res) => {
    fetch('http://localhost:8080/api/hello')
        .then(response => {
            if (!response.ok) {
                throw new Error("Connection not complete");
            }
            return response.text();
        })
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            console.error("Error attempting to fetch message", error);
            res.status(500).send('Error fetching message');

        });
});

// Back end Hard Coded question fetch test from Spring Question Controller endpoint.
application.get("/api/questionTest,", async (req, res) => {
    fetch('http://localhost:8080/api/questionTest')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error: Question not found!")
            }
            return response.json();
        })
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error("Question not found.", error);
            res.status(200).send("Question not found.")
        })
})


// Server will respond with the Homepage.html first when the localhost is accessed.
application.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/html/loginPage.html'));
});

// Server Start
application.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
