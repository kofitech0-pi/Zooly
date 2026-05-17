import express from "express";
const router = express.Router();

import Atividade from "../models/Atividade.js";
import Turma from "../models/Turma.js";
import Historia from "../models/Historia.js";

// LISTAR ATIVIDADES
router.get("/atividades", async (req, res) => {
  try {
    const turmas = await Turma.findAll({
      order: [["id", "ASC"]],
    });

    const atividades = await Atividade.findAll({
      include: [{ model: Historia, as: "historiaSelecionada" }],
      order: [["id", "DESC"]],
    });

    const historias = await Historia.findAll({
      where: { status: "Ativa" },
      order: [["titulo", "ASC"]],
    });

    console.log("TURMAS ENCONTRADAS:", turmas.length);

    res.render("atividades", {
      atividades,
      turmas,
      historias,
      page: "atividades",
    });
  } catch (error) {
    console.log("Erro ao buscar atividades:", error);
    res.status(500).send("Erro ao carregar atividades");
  }
});

// TELA DE NOVA ATIVIDADE
router.get("/atividades/nova", async (req, res) => {
  try {
    const turmas = await Turma.findAll({ order: [["id", "ASC"]] });
    const historias = await Historia.findAll({
      where: { status: "Ativa" },
      order: [["titulo", "ASC"]],
    });

    const historiaSelecionada = req.query.historia_id
      ? await Historia.findByPk(req.query.historia_id)
      : null;

    res.render("atividadeNova", {
      turmas,
      historias,
      historiaSelecionada,
      page: "atividades",
    });
  } catch (error) {
    console.log("Erro ao carregar nova atividade:", error);
    res.status(500).send("Erro ao carregar nova atividade");
  }
});

// CADASTRAR ATIVIDADE
router.post("/atividades/cadastrar", (req, res) => {
  const {
    nome,
    serie_ano,
    turma_id,
    duracao,
    historia,
    historia_id,
    status,
    fonema,
    interacao_ler,
    interacao_ouvir,
    interacao_falar,
    interacao_escrever,
    missao_ler_texto,
    missao_completar,
    missao_escutar,
    missao_identificar,
    missao_responder,
    missao_descricao,
    bncc_habilidades,
    pontos_total,
  } = req.body;

  Atividade.create({
    nome,
    serie_ano,
    turma_id,
    duracao: duracao || "45 min",
    historia,
    historia_id: historia_id || null,
    status: status || "Agendada",
    fonema: fonema || "",
    interacao_ler: interacao_ler === "on",
    interacao_ouvir: interacao_ouvir === "on",
    interacao_falar: interacao_falar === "on",
    interacao_escrever: interacao_escrever === "on",
    missao_ler_texto: missao_ler_texto === "on",
    missao_completar: missao_completar === "on",
    missao_escutar: missao_escutar === "on",
    missao_identificar: missao_identificar === "on",
    missao_responder: missao_responder === "on",
    missao_descricao,
    bncc_habilidades,
    pontos_total: parseInt(pontos_total) || 0,
  })
    .then(() => {
      res.redirect("/atividades");
    })
    .catch((error) => console.log("Erro ao cadastrar atividade: " + error));
});

// TELA DE EDIÇÃO
router.get("/atividades/editar/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const atividade = await Atividade.findByPk(id);

    const turmas = await Turma.findAll({
      order: [["id", "ASC"]],
    });

    const historias = await Historia.findAll({
      where: { status: "Ativa" },
      order: [["titulo", "ASC"]],
    });

    if (!atividade) {
      return res.redirect("/atividades");
    }

    res.render("atividadeEditar", {
      atividade,
      turmas,
      historias,
      page: "atividades",
    });
  } catch (error) {
    console.log("Erro ao carregar edição da atividade:", error);
    res.status(500).send("Erro ao carregar edição da atividade");
  }
});

// ALTERAR ATIVIDADE
router.post("/atividades/alterar", (req, res) => {
  const {
    id,
    nome,
    serie_ano,
    turma_id,
    duracao,
    historia,
    historia_id,
    status,
    fonema,
    interacao_ler,
    interacao_ouvir,
    interacao_falar,
    interacao_escrever,
    missao_ler_texto,
    missao_completar,
    missao_escutar,
    missao_identificar,
    missao_responder,
    missao_descricao,
    bncc_habilidades,
    pontos_total,
  } = req.body;

  Atividade.update(
    {
      nome,
      serie_ano,
      turma_id,
      duracao,
      historia,
      historia_id: historia_id || null,
      status,
      fonema,
      interacao_ler: interacao_ler === "on",
      interacao_ouvir: interacao_ouvir === "on",
      interacao_falar: interacao_falar === "on",
      interacao_escrever: interacao_escrever === "on",
      missao_ler_texto: missao_ler_texto === "on",
      missao_completar: missao_completar === "on",
      missao_escutar: missao_escutar === "on",
      missao_identificar: missao_identificar === "on",
      missao_responder: missao_responder === "on",
      missao_descricao,
      bncc_habilidades,
      pontos_total: parseInt(pontos_total) || 0,
    },
    { where: { id } }
  )
    .then(() => {
      res.redirect("/atividades");
    })
    .catch((error) => console.log("Erro ao alterar atividade: " + error));
});

// EXCLUIR ATIVIDADE
router.post("/atividades/excluir/:id", (req, res) => {
  const id = req.params.id;

  Atividade.destroy({ where: { id } })
    .then(() => {
      res.redirect("/atividades");
    })
    .catch((error) => console.log("Erro ao excluir: " + error));
});

export default router;
