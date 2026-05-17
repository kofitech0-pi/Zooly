import express from "express";
import bcrypt from "bcrypt";
import Users from "../models/Users.js";

const router = express.Router();

// TELA LOGIN
router.get("/login", (req, res) => {
  res.render("login", { erro: null });
});

// TELA CADASTRO 
router.get("/cadastro", (req, res) => {
  res.render("cadastro", { erro: null });
});

// CADASTRAR PROFESSOR
router.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha, confirmar_senha, codigo_escola } = req.body;

    if (senha !== confirmar_senha) {
      return res.render("cadastro", { erro: "As senhas não conferem." });
    }

    const usuarioExiste = await Users.findOne({ where: { email } });

    if (usuarioExiste) {
      return res.render("cadastro", { erro: "E-mail já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await Users.create({ nome, email, senha: senhaHash, codigo_escola });

    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.render("cadastro", { erro: "Erro ao cadastrar usuário. Tente novamente." });
  }
});

// LOGIN 
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Users.findOne({ where: { email } });

    if (!usuario) {
      return res.render("login", { erro: "E-mail não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.render("login", { erro: "Senha incorreta." });
    }

    req.session.usuarioId = usuario.id;
    req.session.usuarioNome = usuario.nome;

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("login", { erro: "Erro ao realizar login. Tente novamente." });
  }
});

//  LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
