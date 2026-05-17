import express from "express";
const router = express.Router();

import Turma from "../models/Turma.js";
import Aluno from "../models/Aluno.js";
import Atividade from "../models/Atividade.js";

function mapearDesempenho(alunos) {
  const imagens = [
    "cobra-botao.png",
    "lagarto-botao.png",
    "papagaio-botao.png",
    "sarue-botao.png",
  ];

  return alunos.map((aluno, index) => {
    const progresso = [95, 68, 32, 75][index % 4];

    let nivel = "Em Alerta";

    if (progresso >= 80) {
      nivel = "Avançado";
    } else if (progresso >= 50) {
      nivel = "Intermediário";
    }

    return {
      id: aluno.id,
      nome: aluno.nome,
      imagem: imagens[index % imagens.length],
      nivel,
      progresso,
      ultima_atividade: ["Hoje, 09:45", "Ontem", "Há 3 dias", "Ontem"][index % 4],
    };
  });
}

// DESEMPENHO: TODAS AS TURMAS
router.get("/desempenho", async (req, res) => {
  try {
    const turmas = await Turma.findAll({ order: [["id", "ASC"]] });

    const alunos = await Aluno.findAll({
      include: [Turma],
      order: [["id", "ASC"]],
    });

    const totalAtividades = await Atividade.count();
    const desempenhos = mapearDesempenho(alunos);

    res.render("desempenho", {
      turmas,
      desempenhos,
      mediaGeral: 84.2,
      totalAtividades,
      alunosDificuldade: desempenhos.filter((a) => a.progresso < 50).length,
      turmaSelecionada: null,
      page: "desempenho",
    });
  } catch (error) {
    console.log("Erro ao carregar desempenho:", error);
    res.status(500).send("Erro ao carregar desempenho");
  }
});

// DESEMPENHO: TURMA ESPECÍFICA
router.get("/desempenho/:id", async (req, res) => {
  const turma_id = req.params.id;

  try {
    const turmas = await Turma.findAll({ order: [["id", "ASC"]] });

    const alunos = await Aluno.findAll({
      where: { turma_id },
      include: [Turma],
      order: [["id", "ASC"]],
    });

    const totalAtividades = await Atividade.count();
    const desempenhos = mapearDesempenho(alunos);

    res.render("desempenho", {
      turmas,
      desempenhos,
      mediaGeral: 84.2,
      totalAtividades,
      alunosDificuldade: desempenhos.filter((a) => a.progresso < 50).length,
      turmaSelecionada: turma_id,
      page: "desempenho",
    });
  } catch (error) {
    console.log("Erro ao carregar desempenho da turma:", error);
    res.status(500).send("Erro ao carregar desempenho");
  }
});

export default router;
