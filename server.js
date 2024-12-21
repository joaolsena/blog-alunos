//node server.js


const express = require("express");
const cors = require("cors");
const fs = require("fs"); // File System para ler e escrever arquivos
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Caminho para o arquivo de projetos
const projetosFilePath = path.join(__dirname, "projetos.json");

// Função para carregar projetos do arquivo JSON
const carregarProjetos = () => {
  if (fs.existsSync(projetosFilePath)) {
    const data = fs.readFileSync(projetosFilePath);
    return JSON.parse(data);
  }
  return []; // Caso o arquivo não exista, retorna um array vazio
};

// Função para salvar projetos no arquivo JSON
const salvarProjetos = (projetos) => {
  fs.writeFileSync(projetosFilePath, JSON.stringify(projetos, null, 2));
};

// Rota para obter os projetos
app.get("/projetos", (req, res) => {
  const projetos = carregarProjetos();
  res.json(projetos);
});

// Rota para adicionar um novo projeto
app.post("/adicionar", (req, res) => {
  const projetos = carregarProjetos();
  const novoProjeto = {
    ...req.body,
    id: projetos.length + 1,
    data: new Date().toLocaleDateString("pt-BR"), // Adiciona data ao projeto
  };
  projetos.push(novoProjeto);
  salvarProjetos(projetos); // Salva no arquivo
  res.status(201).json(novoProjeto);
});

// Rota para excluir um projeto
app.delete("/projetos/:id", (req, res) => {
  const projetos = carregarProjetos();
  const projetosFiltrados = projetos.filter((projeto) => projeto.id !== parseInt(req.params.id));
  salvarProjetos(projetosFiltrados); // Salva no arquivo
  res.status(200).json({ message: "Projeto excluído com sucesso!" });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
