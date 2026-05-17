import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Turma from "./Turma.js";
import Historia from "./Historia.js";

const Atividade = connection.define("atividades", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  serie_ano: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  turma_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  historia_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  duracao: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "45 min",
  },
  historia: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM("Em Andamento", "Agendada", "Concluída"),
    allowNull: false,
    defaultValue: "Agendada",
  },
  interacao_ler: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  interacao_ouvir: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  interacao_falar: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  interacao_escrever: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  missao_ler_texto: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  missao_completar: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  missao_escutar: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  missao_identificar: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  missao_responder: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  missao_descricao: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  bncc_habilidades: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  pontos_total: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  fonema: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Atividade.belongsTo(Turma, { foreignKey: "turma_id" });
Turma.hasMany(Atividade, { foreignKey: "turma_id" });

Atividade.belongsTo(Historia, { foreignKey: "historia_id", as: "historiaSelecionada" });
Historia.hasMany(Atividade, { foreignKey: "historia_id", as: "atividades" });

export default Atividade;
