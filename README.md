![LICENSE](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![Gluten Status](https://img.shields.io/badge/Gluten-Free-green.svg)
![Eco Status](https://img.shields.io/badge/ECO-Friendly-green.svg)
[![Discord](https://discord.com/api/guilds/571393319201144843/widget.png)](https://discord.gg/dRwW4rw)

# Bank API Project

This is a simple RESTful API for managing bank accounts. The API allows users to create accounts, deposit and withdraw money, transfer funds between accounts, and update account information.

## 🎯 Project features/goals

- Create, update, and delete bank accounts.
- Deposit and withdraw money from accounts.
- Transfer funds between accounts.
- Validate account creation based on age (must be 18 years or older).
- All transactions are done in cents, and amounts are formatted in Euros (e.g., `123.45 EUR`).

## 🧰 Getting Started

### 💻 Prerequisites

Node.js - _download and install_

```
https://nodejs.org
```

Git - _download and install_

```
https://git-scm.com
```

Insomnia (or other equivalents) - _download and install_

```
https://insomnia.rest/download
```
### 🏃 Run locally

Would like to run this project locally? Open terminal and follow these steps:

1. Clone the repo to your selected folder
    ```sh
    git clone https://github.com/aksrug/express-bank-homework .
    ```
2. Install NPM packages
    ```sh
    npm i
    ```
3. Run the server
    ```sh
    npm run dev
    ```
This will start the API server on http://localhost:3100.

## API Endpoints
Create Account
- Endpoint: /api/account
- Method: POST
- Description: Creates a new bank account.
- Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01"
}
- Response:
{
  "message": "Account created successfully"
}

Get Account Information
- Endpoint: /api/account/:fullName
- Method: GET
- Description: Retrieves the details of an account.
- URL Parameters:
fullName: The full name of the account holder (e.g., john-doe).
- Response:
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01"
}

Delete Account
- Endpoint: /api/account/:fullName
- Method: DELETE
- Description: Deletes an account if the balance is zero.
- URL Parameters:
fullName: The full name of the account holder (e.g., john-doe).
- Response:
{
  "message": "Account deleted successfully"
}

Update Account Information
- Endpoint: /api/account/:fullName
- Method: PUT
- Description: Updates the account details (first name, last name, and date of birth).
- URL Parameters:
fullName: The full name of the account holder (e.g., john-doe).
- Request Body:
{
  "firstName": "John",
  "lastName": "Smith",
  "dateOfBirth": "1980-01-01"
}
- Response:
{
  "message": "Account updated successfully"
}

Get or Update First Name
**Get First Name:**
- Endpoint: /api/account/:fullName/name
- Method: GET
- Description: Retrieves the first name of the account holder.
- Response:
{
  "firstName": "John"
}
**Update First Name:**
- Endpoint: /api/account/:fullName/name
- Method: PUT
- Description: Updates the first name of the account holder.
- Request Body:
{
  "firstName": "Jonathan"
}
- Response:
{
  "message": "First name updated successfully"
}

Get or Update Last Name
**Get Last Name:**
- Endpoint: /api/account/:fullName/surname
- Method: GET
- Description: Retrieves the last name of the account holder.
- Response:
{
  "lastName": "Doe"
}
**Update Last Name:**
- Endpoint: /api/account/:fullName/surname
- Method: PUT
- Description: Updates the last name of the account holder.
- Request Body:
{
  "lastName": "Smith"
}
- Response: 
{
  "message": "Last name updated successfully"
}

Get or Update Date of Birth
**Get Date of Birth:**

- Endpoint: /api/account/:fullName/dob
- Method: GET
- Description: Retrieves the date of birth of the account holder.
- Response:
{
  "dateOfBirth": "1980-01-01"
}

**Update Date of Birth:**

- Endpoint: /api/account/:fullName/dob
- Method: PUT
- Description: Updates the date of birth of the account holder.
- Request Body:
{
  "dateOfBirth": "1981-02-02"
}
- Response: 
{
  "message": "Date of birth updated successfully"
}

Withdraw Money
- Endpoint: /api/withdrawal
- Method: POST
- Description: Withdraws money from the specified account.
- Request Body:
{
  "amount": 1000,
  "firstName": "John",
  "lastName": "Doe"
}

- Response:
{
  "message": "Withdrawal successful. New balance: 123.45 EUR"
}

Deposit Money
- Endpoint: /api/deposit
- Method: POST
- Description: Deposits money into the specified account.
- Request Body:
{
  "amount": 2000,
  "firstName": "John",
  "lastName": "Doe"
}

- Response:
{
  "message": "Deposit successful. New balance: 123.45 EUR"
}

Transfer Money Between Accounts
- Endpoint: /api/transfer
- Method: POST
- Description: Transfers money from one account to another.
- Request Body:
{
  "fromFirstName": "John",
  "fromLastName": "Doe",
  "toFirstName": "Jane",
  "toLastName": "Doe",
  "amount": 500
}

- Response:
{
  "message": "Transfer successful. New balance: 123.45 EUR (from), 678.90 EUR (to)"
}



## 👀 Authors

Rugile: [Github](https://github.com/aksrug)

## ⚠️ License

Distributed under the MIT License. See LICENSE.txt for more information.

## 🔗 Other resources

No other resources.


   
