import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [projetos, setProjetos] = useState([]);
  const [novoProjeto, setNovoProjeto] = useState({
    titulo: "",
    descricao: "",
    autor: "",
  });

  // Carregar projetos ao montar o componente
useEffect(() => {
  axios
    .get("http://localhost:3000/projetos")
    .then((response) => {
      // Adicionando a data a cada projeto, se necessário
      const projetosComData = response.data.map((projeto) => ({
        ...projeto,
        data: projeto.data || new Date().toLocaleDateString("pt-BR"), // Adicionando data se não existir
      }));
      setProjetos(projetosComData);
    })
    .catch((error) => console.error("Erro ao carregar projetos:", error));
}, []);

  // Adicionar novo projeto
  const handleAdicionarProjeto = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/adicionar", novoProjeto)
      .then((response) => {
        setProjetos([...projetos, { ...novoProjeto, id: projetos.length + 1 }]);
        setNovoProjeto({ titulo: "", descricao: "", autor: "" }); // Limpar formulário
      })
      .catch((error) => console.error("Erro ao adicionar projeto:", error));
  };

  return (
    <div className="App">
      <header>
        <h1>Blog de Trabalhos dos Alunos de musica</h1>
        <p>Compartilhe seus projetos e inspire outros!</p>
      </header>

      <div className="container">
        <h2>Lista de Projetos</h2>
        <div className="lista-projetos">
          {projetos.map((projeto) => (
            <div className="trabalho" key={projeto.id}>
              <h3>{projeto.titulo}</h3>
              <p>{projeto.descricao}</p>
              <span>Adicionado por: {projeto.autor} em {projeto.data}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleAdicionarProjeto}>
          <h2>Adicionar um Trabalho</h2>
          <input
            type="text"
            placeholder="Título do Trabalho"
            value={novoProjeto.titulo}
            onChange={(e) =>
              setNovoProjeto({ ...novoProjeto, titulo: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Descrição do Trabalho"
            value={novoProjeto.descricao}
            onChange={(e) =>
              setNovoProjeto({ ...novoProjeto, descricao: e.target.value })
            }
            rows="4"
            required
          ></textarea>
          <input
            type="text"
            placeholder="Seu Nome"
            value={novoProjeto.autor}
            onChange={(e) =>
              setNovoProjeto({ ...novoProjeto, autor: e.target.value })
            }
            required
          />
          <button type="submit">Adicionar</button>
        </form>
      </div>

      <footer>
        <p>&copy; 2024 Blog de Trabalhos dos Alunos. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
