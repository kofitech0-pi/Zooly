import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Turma from "./Turma.js";

const Aluno = connection.define("alunos", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  idade: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  ra: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nome_responsavel: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email_responsavel: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagem: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "cobra-botao.png",
  },
  turma_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Aluno.belongsTo(Turma, { foreignKey: "turma_id" });
Turma.hasMany(Aluno, { foreignKey: "turma_id" });

export default Aluno;
