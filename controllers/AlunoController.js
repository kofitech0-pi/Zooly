import express from "express";
const router = express.Router();

import Aluno from "../models/Aluno.js";
import Turma from "../models/Turma.js";

//LISTAR ALUNOS DE UMA TURMA
router.get("/turmas/:turma_id/alunos", async (req, res) => {
  try {
    const turma_id = req.params.turma_id;

    const turma = await Turma.findByPk(turma_id);

    if (!turma) {
      return res.redirect("/turmas");
    }

    const alunos = await Aluno.findAll({
      where: { turma_id },
      order: [["id", "ASC"]],
    });

    const alunosComDados = alunos.map((aluno, index) => ({
      ...aluno.toJSON(),
      progresso: [85, 40, 92, 15][index % 4],
      ultimo_acesso: ["Hoje, 10:45", "Ontem, 16:20", "Há 2 horas", "Há 4 dias"][
        index % 4
      ],
    }));

    res.render("alunos", {
      turma,
      alunos: alunosComDados,
      page: "alunos",
    });
  } catch (error) {
    console.log("Erro ao buscar alunos:", error);
    res.status(500).send("Erro ao carregar página de alunos");
  }
});

// CADASTRAR ALUNO
router.post("/alunos/cadastrar", async (req, res) => {
  try {
    const { nome, idade, ra, nome_responsavel, email_responsavel, imagem, turma_id } =
      req.body;

    await Aluno.create({
      nome,
      idade,
      ra,
      nome_responsavel,
      email_responsavel,
      imagem,
      turma_id,
    });

    res.redirect(`/turmas/${turma_id}/alunos`);
  } catch (error) {
    console.log("Erro ao cadastrar aluno:", error);
    res.redirect("/turmas");
  }
});

// TELA DE EDIÇÃO
router.get("/alunos/editar/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const aluno = await Aluno.findByPk(id);

    if (!aluno) {
      return res.redirect("/turmas");
    }

    const turmas = await Turma.findAll({
      order: [["id", "ASC"]],
    });

    res.render("alunoEditar", {
      aluno,
      turmas,
      page: "alunos",
    });
  } catch (error) {
    console.log("Erro ao buscar aluno para editar:", error);
    res.redirect("/turmas");
  }
});

// ALTERAR ALUNO 
router.post("/alunos/alterar", async (req, res) => {
  try {
    const { id, nome, idade, ra, nome_responsavel, email_responsavel, imagem, turma_id } =
      req.body;

    await Aluno.update(
      { nome, idade, ra, nome_responsavel, email_responsavel, imagem, turma_id },
      { where: { id } }
    );

    res.redirect(`/turmas/${turma_id}/alunos`);
  } catch (error) {
    console.log("Erro ao alterar aluno:", error);
    res.redirect("/turmas");
  }
});

// EXCLUIR ALUNO
router.post("/alunos/excluir/:id/:turma_id", async (req, res) => {
  try {
    const { id, turma_id } = req.params;

    await Aluno.destroy({ where: { id } });

    res.redirect(`/turmas/${turma_id}/alunos`);
  } catch (error) {
    console.log("Erro ao excluir aluno:", error);
    res.redirect("/turmas");
  }
});

export default router;
