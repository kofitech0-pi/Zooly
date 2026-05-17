import express from "express";
const router = express.Router();

import Turma from "../models/Turma.js";
import Aluno from "../models/Aluno.js";
import Atividade from "../models/Atividade.js";

// DASHBOARD PRINCIPAL
router.get("/", async (req, res) => {
  try {
    const totalTurmas = await Turma.count();
    const totalAlunos = await Aluno.count();
    const totalAtividades = await Atividade.count();

    const alunos = await Aluno.findAll({
      order: [["id", "ASC"]],
      limit: 3,
    });

    const imagens = [
      "cobra-botao.png",
      "lagarto-botao.png",
      "papagaio-botao.png",
      "sarue-botao.png",
    ];

    const desempenhos = alunos.map((aluno, index) => ({
      id: aluno.id,
      estudante: aluno.nome,
      imagem: imagens[index % imagens.length],
      fonema: ["/b/", "/v/", "/r/"][index % 3],
      palavras: ["Bola, Bala, Bule", "Vaca, Vela, Vento", "Rato, Roda, Rua"][
        index % 3
      ],
      score: [80, 93, 60][index % 3],
      data: ["18 Mar, 2026", "19 Mar, 2026", "20 Mar, 2026"][index % 3],
    }));
    res.render("index", {
      totalTurmas,
      totalAlunos,
      totalAtividades,
      totalMissoes: totalAtividades,
      ultimaMissao: "20/03/2026",
      desempenhos,
      page: "home",
    });
  } catch (error) {
    console.log("Erro ao carregar dashboard:", error);

    res.render("index", {
      totalTurmas: 0,
      totalAlunos: 0,
      totalAtividades: 0,
      totalMissoes: 0,
      ultimaMissao: "--/--/----",
      desempenhos: [],
      page: "home",
    });
  }
});

// CONFIGURAÇÕES
router.get("/configuracoes", (req, res) => {
  res.render("configuracoes", { page: "configuracoes" });
});

export default router;
