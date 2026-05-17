import express from "express";
const router = express.Router();

import Turma from "../models/Turma.js";
import Aluno from "../models/Aluno.js";
import Atividade from "../models/Atividade.js";

// GERAR CÓDIGO DA TURMA
function gerarCodigoTurma() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";

  let codigo = "ZLY-";

  for (let i = 0; i < 2; i++) {
    codigo += letras.charAt(Math.floor(Math.random() * letras.length));
  }

  for (let i = 0; i < 4; i++) {
    codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
  }

  return codigo;
}

// GERAR CÓDIGO ÚNICO
async function gerarCodigoUnicoTurma() {
  let codigo_turma;
  let codigoExiste = true;

  while (codigoExiste) {
    codigo_turma = gerarCodigoTurma();

    const turmaEncontrada = await Turma.findOne({
      where: { codigo_turma },
    });

    if (!turmaEncontrada) {
      codigoExiste = false;
    }
  }

  return codigo_turma;
}

// LISTAR TURMAS
router.get("/turmas", async (req, res) => {
  try {
    const turmas = await Turma.findAll({
      order: [["id", "DESC"]],
    });

    const turmasComAlunos = await Promise.all(
      turmas.map(async (turma) => {
        if (!turma.codigo_turma) {
          turma.codigo_turma = await gerarCodigoUnicoTurma();
          await turma.save();
        }

        const totalAlunos = await Aluno.count({
          where: { turma_id: turma.id },
        });

        return {
          ...turma.toJSON(),
          totalAlunos,
        };
      })
    );

    res.render("turmas", {
      turmas: turmasComAlunos,
      page: "turmas",
    });
  } catch (error) {
    console.log("Erro ao buscar turmas:", error);

    res.render("turmas", {
      turmas: [],
      page: "turmas",
    });
  }
});

// CADASTRAR TURMA
router.post("/turmas/cadastrar", async (req, res) => {
  try {
    const { nome, periodo, mascote } = req.body;

    const codigo_turma = await gerarCodigoUnicoTurma();

    await Turma.create({
      nome,
      periodo,
      mascote,
      codigo_turma,
    });

    res.redirect("/turmas");
  } catch (error) {
    console.log("Erro ao cadastrar turma:", error);
    res.redirect("/turmas");
  }
});

// TELA DE EDIÇÃO
router.get("/turmas/editar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const turma = await Turma.findByPk(id);

    if (!turma) {
      return res.redirect("/turmas");
    }

    if (!turma.codigo_turma) {
      turma.codigo_turma = await gerarCodigoUnicoTurma();
      await turma.save();
    }

    res.render("turmaEditar", {
      turma,
      page: "turmas",
    });
  } catch (error) {
    console.log("Erro ao buscar turma para editar:", error);
    res.redirect("/turmas");
  }
});

// ALTERAR TURMA
router.post("/turmas/alterar", async (req, res) => {
  try {
    const { id, nome, periodo, mascote } = req.body;

    await Turma.update(
      { nome, periodo, mascote },
      { where: { id } }
    );

    res.redirect("/turmas");
  } catch (error) {
    console.log("Erro ao alterar turma:", error);
    res.redirect("/turmas");
  }
});

// EXCLUIR TURMA
router.post("/turmas/excluir/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await Atividade.destroy({ where: { turma_id: id } });
    await Aluno.destroy({ where: { turma_id: id } });
    await Turma.destroy({ where: { id } });

    res.redirect("/turmas");
  } catch (error) {
    console.log("Erro ao excluir turma:", error);
    res.redirect("/turmas");
  }
});

export default router;
