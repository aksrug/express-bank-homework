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

// Sukurti naują sąskaitą
app.post('/api/account', (req, res) => {
    const { vardas, pavarde, gimimoData } = req.body;
    const fullName = `${vardas.toLowerCase()}-${pavarde.toLowerCase()}`;

    if (accounts[fullName]) {
        return res.status(400).json({ error: 'Account already exists' });
    }

    if (isAdult(gimimoData) < 18) {
        return res.status(400).json({ error: 'Must be 18 years or older' });
    }

    accounts[fullName] = {
        vardas,
        pavarde,
        gimimoData,
        balance: 0
    };

    res.status(201).json({ message: 'Account created successfully' });
});