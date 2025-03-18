// app.js
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
  host: "34.95.165.225",
  port: 3306,
  user: "moreno",
  password: "biel123",
  database: "correntes_do_crepusculo",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL.");
});

// Endpoint para login
app.post("/login", (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) {
    return res.status(400).json({ error: "Login e senha são obrigatórios." });
  }
  const sql = "SELECT * FROM fichas WHERE login = ? AND senha = ?";
  db.query(sql, [login, senha], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no servidor." });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
    return res.json(results[0]);
  });
});

// Endpoint para salvar (inserir ou atualizar) a ficha
app.post("/save", (req, res) => {
  const ficha = req.body;

  // Se existe um campo "id", então atualizar; caso contrário, inserir nova ficha.
  if (ficha.id) {
    const sql = "UPDATE fichas SET ? WHERE id = ?";
    db.query(sql, [ficha, ficha.id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao salvar ficha." });
      }
      return res.json({ message: "Ficha atualizada com sucesso." });
    });
  } else {
    // Para nova ficha, gerar login (primeiro nome do personagem) e senha aleatória de 4 dígitos.
    const nome = ficha.nome || "";
    const firstName = nome.split(" ")[0] || "usuario";
    const randomPass = Math.floor(1000 + Math.random() * 9000).toString();
    ficha.login = firstName;
    ficha.senha = randomPass;
    // Garantir que não há id na inserção
    delete ficha.id;
    const sql = "INSERT INTO fichas SET ?";
    db.query(sql, ficha, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao criar ficha." });
      }
      // Retorna o login e a senha para que o usuário possa anotar
      return res.json({
        message: "Ficha criada com sucesso.",
        login: ficha.login,
        senha: ficha.senha,
      });
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
