import "dotenv/config";
import express from "express";
import session from "express-session";

//  CONTROLLERS 
import HomeController from "./controllers/HomeController.js";
import DesempenhoController from "./controllers/DesempenhoController.js";
import TurmaController from "./controllers/TurmaController.js";
import AlunoController from "./controllers/AlunoController.js";
import AtividadeController from "./controllers/AtividadeController.js";
import AuthController from "./controllers/AuthController.js";

//  MIDDLEWARE DE AUTENTICAÇÃO 
import { requireAuth } from "./middlewares/auth.js";

//  MODELS 
import connection from "./config/sequelize-config.js";
import Turma from "./models/Turma.js";
import Aluno from "./models/Aluno.js";
import Atividade from "./models/Atividade.js";
import Historia from "./models/Historia.js";
import Users from "./models/Users.js";

//  HISTÓRIAS 
async function seedHistorias() {
  const totalHistorias = await Historia.count();

  if (totalHistorias > 0) return;

  await Historia.bulkCreate([
    {
      titulo: "A Sereia da Juréia",
      descricao_curta: "Uma lenda das águas e das vozes que ecoam perto da mata.",
      texto: "Perto das águas tranquilas da Juréia, os pescadores contavam que uma sereia cantava ao entardecer. Seu canto parecia chamar os sons da mata: o sopro do vento, o pio dos pássaros e o barulho das ondas. Um dia, uma criança ouviu a melodia e percebeu palavras escondidas no canto da sereia.",
      nivel_leitura: "Fácil",
      origem: "Juréia - Vale do Ribeira",
      categoria: "Folclore Caiçara",
      imagem: "🧜‍♀️",
    },
    {
      titulo: "O Guardião da Mata",
      descricao_curta: "Uma história sobre respeito à floresta e aos animais.",
      texto: "Nas matas do Vale do Ribeira, diziam que havia um pequeno guardião que protegia as árvores e os bichos. Ele caminhava em silêncio, observando quem cuidava da natureza. Quando uma criança recolhia o lixo da trilha, o guardião deixava folhas brilhantes pelo caminho como sinal de agradecimento.",
      nivel_leitura: "Fácil",
      origem: "Vale do Ribeira",
      categoria: "Folclore Regional",
      imagem: "🌳",
    },
    {
      titulo: "O Mistério da Caverna",
      descricao_curta: "Uma aventura nas cavernas do Vale do Ribeira.",
      texto: "Em uma caverna antiga, as gotas de água faziam sons diferentes nas pedras. Cada gota parecia formar uma palavra. Um grupo de crianças entrou com cuidado e descobriu que a caverna guardava ecos de histórias antigas, contadas por pessoas que viviam perto do rio.",
      nivel_leitura: "Médio",
      origem: "Cavernas do Vale do Ribeira",
      categoria: "Aventura",
      imagem: "🦇",
    },
    {
      titulo: "O Rio que Contava Histórias",
      descricao_curta: "Uma lenda sobre memórias carregadas pelas águas do rio.",
      texto: "O rio corria devagar entre as árvores e parecia conversar com quem prestava atenção. Os moradores diziam que ele guardava histórias de barcos, peixes, festas e famílias. Quando a água batia nas pedras, as crianças tentavam descobrir quais sons se repetiam na fala do rio.",
      nivel_leitura: "Fácil",
      origem: "Rio Ribeira de Iguape",
      categoria: "Cultura Local",
      imagem: "🌊",
    },
  ]);
}

//  APP 
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

//  SESSÃO 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 horas
  })
);

//  PROTEÇÃO DE ROTAS 
app.use(requireAuth);

//  ROTAS 
app.use("/", AuthController);
app.use("/", HomeController);
app.use("/", DesempenhoController);
app.use("/", TurmaController);
app.use("/", AlunoController);
app.use("/", AtividadeController);

//  INICIAR SERVIDOR 
const port = 8080;

connection
  .sync({ alter: true })
  .then(async () => {
    await seedHistorias();
    console.log("Banco sincronizado com sucesso.");

    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Erro ao sincronizar banco:", error);
  });
