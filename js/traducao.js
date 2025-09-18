// ===============================
// Dicionários separados
// ===============================
let dicionario_leigo = JSON.parse(localStorage.getItem("dicionario_leigo")) || {
    "rcp": "Reanimação Cardiopulmonar",
    "botaoRcp": "INICIAR MASSAGEM CARDÍACA",
    "botaoRcp2": "PARAR MASSAGEM CARDÍACA",
    "qualidade": "Qualidade da Compressão",
    "tempo": "Tempo de Compressão",
    "cronometro": "Cronômetro",
    "ciclos": "Ciclos"

};

let dicionario_tecnico = JSON.parse(localStorage.getItem("dicionario_tecnico")) || {
    "rcp": "Reanimação Cardiopulmonar",
    "botaoRcp": "INICIAR COMPRESSÃO TORÁCICA",
    "botaoRcp2": "PARAR COMPRESSÃO TORÁCICA",
    "qualidade": "Qualidade da Compressão",
    "tempo": "Tempo de Compressão",
    "cronometro": "Cronômetro",
    "ciclos": "Ciclos"
};

let modoTecnico = false; // false = leigo, true = técnico
let dicionario = {};

// Atualiza o dicionário atual
function atualizarTextoBotao() {
  dicionario = modoTecnico ? dicionario_tecnico : dicionario_leigo;
  // Atualiza todos os textos de acordo com o dicionário
  document.getElementById("A").textContent = dicionario.botaoRcp;
  document.getElementById("txtRcp").textContent = dicionario.rcp;
  document.getElementById("txtQualidade").textContent = dicionario.qualidade;
  document.getElementById("txtTempo").textContent = dicionario.tempo;
  document.getElementById("txtCronometro").textContent = dicionario.cronometro;
  document.getElementById("txtCiclos").textContent = dicionario.ciclos;
}

// Alterna entre leigo e técnico
function alternarModo() {
  modoTecnico = !modoTecnico;
  atualizarTextoBotao();
}

// Inicializa
atualizarTextoBotao();

// Função para alterar termos e salvar no localStorage
function alterarTermos(botaoRcpLeigo, botaoRcpTecnico) {
  dicionario_leigo.botaoRcp = botaoRcpLeigo;
  dicionario_tecnico.botaoRcp = botaoRcpTecnico;

  localStorage.setItem("dicionario_leigo", JSON.stringify(dicionario_leigo));
  localStorage.setItem("dicionario_tecnico", JSON.stringify(dicionario_tecnico));

  atualizarTextoBotao();
}

// Botão escondido para alternar modo
const botaoModo = document.querySelector('#tradutor');   // botão Massagem

//botaoModo.style.display = "none"; // escondido
botaoModo.textContent = "Alternar modo técnico";

