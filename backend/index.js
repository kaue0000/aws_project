const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const serverless = require('serverless-http');
const app = express();
app.use(cors());
app.use(express.json());
// Configuração do banco de dados usando variáveis de ambiente da Lambda
const db = mysql.createConnection({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME
});
// Rota para listar alunos
app.get('/alunos', (req, res) => {
 db.query('SELECT * FROM Aluno', (err, results) => {
 if (err) return res.status(500).send(err);
 res.json(results);
 });
});
// Rota para cadastrar aluno
app.post('/alunos', (req, res) => {
 const { Nome, Email } = req.body;
 const query = 'INSERT INTO Aluno (Nome, Email) VALUES (?, ?)';
 db.query(query, [Nome, Email], (err, result) => {
 if (err) return res.status(500).send(err);
 res.status(201).json({ id: result.insertId, Nome, Email });
 });
});
// Exporta a aplicação envolta pelo serverless-http para funcionar na Lambda
module.exports.handler = serverless(app);