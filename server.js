// Ficheiro: server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Criação e ligação à Base de Dados SQLite
const db = new sqlite3.Database('./bateponto.db', (err) => {
    if (err) console.error("Erro ao ligar à base de dados:", err.message);
    else console.log("Ligado à base de dados SQLite.");
});

// Criação da tabela de utilizadores (se não existir)
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identificador TEXT UNIQUE,
    senha TEXT,
    perfil TEXT
)`);

// Rota: TELA LG2 (Criar Conta)
app.post('/api/registo', (req, res) => {
    const { identificador, senha } = req.body;
    db.run(`INSERT INTO usuarios (identificador, senha) VALUES (?, ?)`, [identificador, senha], function(err) {
        if (err) return res.status(400).json({ erro: "Utilizador já existe." });
        res.json({ sucesso: true, id: this.lastID });
    });
});

// Rota: TELA LG1 (Login)
app.post('/api/login', (req, res) => {
    const { identificador, senha } = req.body;
    db.get(`SELECT * FROM usuarios WHERE identificador = ? AND senha = ?`, [identificador, senha], (err, row) => {
        if (row) res.json({ sucesso: true, utilizador: row });
        else res.status(401).json({ erro: "Dados incorretos." });
    });
});

app.listen(3000, () => console.log('Servidor a correr na porta 3000'));