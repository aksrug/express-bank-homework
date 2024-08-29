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

// Gauti sąskaitos informaciją
app.get('/api/account/:fullName', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
        vardas: account.vardas,
        pavarde: account.pavarde,
        gimimoData: account.gimimoData
    });
});

// Ištrinti sąskaitą
app.delete('/api/account/:fullName', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    if (account.balance !== 0) {
        return res.status(400).json({ error: 'Account must be empty to delete' });
    }

    delete accounts[fullName];
    res.json({ message: 'Account deleted successfully' });
});

// Atnaujinti sąskaitos informaciją
app.put('/api/account/:fullName', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const { vardas, pavarde, gimimoData } = req.body;

    if (!accounts[fullName]) {
        return res.status(404).json({ error: 'Account not found' });
    }

    if (isAdult(gimimoData) < 18) {
        return res.status(400).json({ error: 'Must be 18 years or older' });
    }

    const newFullName = `${vardas.toLowerCase()}-${pavarde.toLowerCase()}`;

    if (newFullName !== fullName && accounts[newFullName]) {
        return res.status(400).json({ error: 'New account name already exists' });
    }

    accounts[newFullName] = { ...accounts[fullName], vardas, pavarde, gimimoData };
    if (newFullName !== fullName) {
        delete accounts[fullName];
    }

    res.json({ message: 'Account updated successfully' });
});

// Gauti arba atnaujinti varda
app.get('/api/account/:fullName/name', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ vardas: account.vardas });
});

app.put('/api/account/:fullName/name', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const { vardas } = req.body;
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    account.vardas = vardas;
    res.json({ message: 'Name updated successfully' });
});

// Gauti arba atnaujinti pavarde
app.get('/api/account/:fullName/surname', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ pavarde: account.pavarde });
});

app.put('/api/account/:fullName/surname', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const { pavarde } = req.body;
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    account.pavarde = pavarde;
    res.json({ message: 'Surname updated successfully' });
});

// Gauti arba atnaujinti gimimo datą
app.get('/api/account/:fullName/dob', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ gimimoData: account.gimimoData });
});

app.put('/api/account/:fullName/dob', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const { gimimoData } = req.body;
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    if (isAdult(gimimoData) < 18) {
        return res.status(400).json({ error: 'Must be 18 years or older' });
    }

    account.gimimoData = gimimoData;
    res.json({ message: 'Date of birth updated successfully' });
});

// Išsiimti pinigus
app.post('/api/withdrawal', (req, res) => {
    const { piniguKiekis, vardas, pavarde } = req.body;
    const fullName = `${vardas.toLowerCase()}-${pavarde.toLowerCase()}`;
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    if (account.balance < piniguKiekis) {
        return res.status(400).json({ error: 'Insufficient funds' });
    }

    account.balance -= piniguKiekis;
    res.json({ message: `Withdrawal successful. New balance: ${(account.balance / 100).toFixed(2)} EUR` });
});

// Įnešti pinigus
app.post('/api/deposit', (req, res) => {
    const { piniguKiekis, vardas, pavarde } = req.body;
    const fullName = `${vardas.toLowerCase()}-${pavarde.toLowerCase()}`;
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    account.balance += piniguKiekis;
    res.json({ message: `Deposit successful. New balance: ${(account.balance / 100).toFixed(2)} EUR` });
});
