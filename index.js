const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

let accounts = {}; // Čia saugosime visas sąskaitas

// Pagalbinė funkcija tikrinti amžių
function isAdult(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
    }
    return age;
}