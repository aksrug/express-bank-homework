const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

let accounts = {}; 

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


app.post('/api/account', (req, res) => {
    const { firstName, lastName, dateOfBirth } = req.body;
    const fullName = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;

    if (accounts[fullName]) {
        return res.status(400).json({ error: 'Account already exists' });
    }

    if (isAdult(dateOfBirth) < 18) {
        return res.status(400).json({ error: 'Must be 18 years or older' });
    }

    accounts[fullName] = {
        firstName,
        lastName,
        dateOfBirth,
        balance: 0
    };

    res.status(201).json({ message: 'Account created successfully' });
});


app.get('/api/account/:fullName', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
        firstName: account.firstName,
        lastName: account.lastName,
        dateOfBirth: account.dateOfBirth
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


app.put('/api/account/:fullName', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const { firstName, lastName, dateOfBirth } = req.body;

    if (!accounts[fullName]) {
        return res.status(404).json({ error: 'Account not found' });
    }

    if (isAdult(dateOfBirth) < 18) {
        return res.status(400).json({ error: 'Must be 18 years or older' });
    }

    const newFullName = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;

    if (newFullName !== fullName && accounts[newFullName]) {
        return res.status(400).json({ error: 'New account name already exists' });
    }

    accounts[newFullName] = { ...accounts[fullName], firstName, lastName, dateOfBirth };
    if (newFullName !== fullName) {
        delete accounts[fullName];
    }

    res.json({ message: 'Account updated successfully' });
});


app.get('/api/account/:fullName/name', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ firstName: account.firstName });
});

app.put('/api/account/:fullName/name', (req, res) => {
    const fullName = req.params.fullName.toLowerCase();
    const { firstName } = req.body;
    const account = accounts[fullName];

    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    account.firstName = firstName;
    res.json({ message: 'First name updated successfully' });
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

// Pervesti pinigus tarp sąskaitų
app.post('/api/transfer', (req, res) => {
    const { isVardas, isPavarde, iVardas, iPavarde, piniguKiekis } = req.body;

    const fromFullName = `${isVardas.toLowerCase()}-${isPavarde.toLowerCase()}`;
    const toFullName = `${iVardas.toLowerCase()}-${iPavarde.toLowerCase()}`;

    const fromAccount = accounts[fromFullName];
    const toAccount = accounts[toFullName];

    if (!fromAccount || !toAccount) {
        return res.status(404).json({ error: 'One or both accounts not found' });
    }

    if (fromAccount.balance < piniguKiekis) {
        return res.status(400).json({ error: 'Insufficient funds' });
    }

    fromAccount.balance -= piniguKiekis;
    toAccount.balance += piniguKiekis;

    res.json({ message: `Transfer successful. New balance: ${(fromAccount.balance / 100).toFixed(2)} EUR (from), ${(toAccount.balance / 100).toFixed(2)} EUR (to)` });
});

// Paleisti serverį
const port = 3100;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
