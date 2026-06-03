import express from "express";
const router = express.Router();

import Atividade from "../models/Atividade.js";
import Turma from "../models/Turma.js";
import Historia from "../models/Historia.js";
import Questao from "../models/Questao.js";

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
router.post("/atividades/cadastrar", async (req, res) => {
  console.log(req.body);

  const {
    nome, serie_ano, turma_id, duracao, historia, historia_id, status, fonema,
    interacao_ler, interacao_ouvir, interacao_falar, interacao_escrever,
    missao_ler_texto, missao_completar, missao_escutar, missao_identificar,
    missao_responder, missao_descricao, bncc_habilidades, pontos_total,
  } = req.body;

  try {
    const atividade = await Atividade.create({
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
    });

    const questaoKeys = Object.keys(req.body).filter(k => k.startsWith("q_enunciado_"));
    for (const key of questaoKeys) {
      const num = key.split("_").pop();
      await Questao.create({
        atividade_id: atividade.id,
        enunciado: req.body[`q_enunciado_${num}`],
        tipo: req.body[`q_tipo_${num}`],
        pontos: parseInt(req.body[`q_pontos_${num}`]) || 0,
      });
    }

    res.redirect("/atividades");
  } catch (error) {
    console.log("Erro ao cadastrar atividade:", error);
    res.status(500).send("Erro ao cadastrar atividade");
  }
});

// TELA DE EDIÇÃO
router.get("/atividades/editar/:id", async (req, res) => {
try {
const id = req.params.id;

const atividade = await Atividade.findByPk(id, {
include: [{ model: Questao, as: "questoes" }],
});

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
router.post("/atividades/alterar", async (req, res) => {
const {
id, nome, serie_ano, turma_id, duracao, historia, historia_id, status, fonema,
interacao_ler, interacao_ouvir, interacao_falar, interacao_escrever,
missao_ler_texto, missao_completar, missao_escutar, missao_identificar,
missao_responder, missao_descricao, bncc_habilidades, pontos_total,
} = req.body;

try {
await Atividade.update(
{
nome, serie_ano, turma_id, duracao, historia,
historia_id: historia_id || null, status, fonema,
interacao_ler: interacao_ler === "on",
interacao_ouvir: interacao_ouvir === "on",
interacao_falar: interacao_falar === "on",
interacao_escrever: interacao_escrever === "on",
missao_ler_texto: missao_ler_texto === "on",
missao_completar: missao_completar === "on",
missao_escutar: missao_escutar === "on",
missao_identificar: missao_identificar === "on",
missao_responder: missao_responder === "on",
missao_descricao, bncc_habilidades,
pontos_total: parseInt(pontos_total) || 0,
},
{ where: { id } }
);

await Questao.destroy({ where: { atividade_id: id } });

const questaoKeys = Object.keys(req.body).filter(k => k.startsWith("q_enunciado_"));
for (const key of questaoKeys) {
const num = key.split("_").pop();
await Questao.create({
atividade_id: id,
enunciado: req.body[`q_enunciado_${num}`],
tipo: req.body[`q_tipo_${num}`],
pontos: parseInt(req.body[`q_pontos_${num}`]) || 0,
});
}

res.redirect("/atividades");
} catch (error) {
console.log("Erro ao alterar atividade:", error);
res.status(500).send("Erro ao alterar atividade");
}
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