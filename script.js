// ===============================
// Variáveis globais de controle
// ===============================
let estadoMetronomo = 0;     // alternância do metrônomo (0/1)
let intervaloMetronomo = null;
let intervaloTemporizador = null;

// Elementos da página
const botaoRcp = document.querySelector('.item1');   // botão Massagem
const botaoEmg = document.querySelector('.cabeca');  // botão Emergência
const temporizadorEl = document.querySelector('#temporizador');
const circulo = document.querySelector('#circulo');  // círculo animado (imagens)

// ===============================
// Eventos principais
// ===============================
botaoRcp.addEventListener('click', iniciarPararRCP);
botaoEmg.addEventListener('click', emergencia);

// ===============================
// Funções de Emergência
// ===============================
function emergencia() {
  // Verifica status do botão
  if (botaoEmg.id === 'C') {
    botaoEmg.textContent = 'EMERGÊNCIA A CAMINHO';
    botaoEmg.style.backgroundColor = '#00FF00';

    // Discar para SAMU
    window.location.href = 'tel:192';

    // Mostrar hora de início
    const horaInicio = document.querySelector('#hora-inicio');
    const agora = new Date();
    const horario = agora.toLocaleTimeString('pt-BR');
    horaInicio.textContent = horario;

    // Mostrar hora do mal súbito
    const horaSubito = document.querySelector('#hora-subito');
    const inputSubito = document.querySelector('#input-subito');

    if (inputSubito && inputSubito.value) {
      horaSubito.innerHTML = `<p>${inputSubito.value}</p>`;
    } else {
      horaSubito.textContent = 'Sem dados';
    }

    botaoEmg.id = 'D'; // Ativado
  } else {
    // Resetar estado
    botaoEmg.textContent = 'LIGAR PARA EMERGÊNCIA - SAMU';
    botaoEmg.style.backgroundColor = '#004aad';

    document.querySelector('#hora-inicio').textContent = '';

    const horaSubito = document.querySelector('#hora-subito');
    horaSubito.innerHTML = '<input id="input-subito" type="time">';

    botaoEmg.id = 'C'; // Desativado
  }
}

// ===============================
// Funções do Metrônomo
// ===============================
function TESTAR() {
  const controle = document.querySelector('#controle-metronomo .metronomo');

  if (estadoMetronomo === 0) {
    controle.classList.remove('desligado');
    controle.classList.add('ligado');
  } else {
    controle.classList.remove('ligado');
    controle.classList.add('desligado');
  }

  estadoMetronomo = (estadoMetronomo + 1) % 2;

  iniciarAlternancia();
}

function iniciarAlternancia() {
  if (intervaloMetronomo !== null) return; // evita duplicar intervalos
  intervaloMetronomo = setInterval(TESTAR, 500);
}

function resetar() {
  const controle = document.querySelector('#controle-metronomo .metronomo');

  // Parar o intervalo se estiver rodando
  if (intervaloMetronomo !== null) {
    clearInterval(intervaloMetronomo);
    intervaloMetronomo = null;
  }

  // Resetar estados
  controle.classList.remove('ligado', 'desligado');
  estadoMetronomo = 0;
}

// ===============================
// Funções de RCP (Massagem Cardíaca)
// ===============================
function iniciarPararRCP() {
  const circulos = ['./img/circle1.png', './img/circle2.png'];
  let indiceCirculo = 0;
  let tempoRestante = 120;

  if (botaoRcp.id === 'A') {
    // Ativar RCP
    botaoRcp.style.backgroundColor = '#B22222';
    botaoRcp.textContent = 'PARAR MASSAGEM CARDÍACA';

    // Iniciar metrônomo (círculos piscando)
    intervaloMetronomo = setInterval(() => {
      if (circulo) {
        circulo.src = circulos[indiceCirculo];
        indiceCirculo = (indiceCirculo + 1) % circulos.length;
      }
    }, 500);

    // Iniciar temporizador
    intervaloTemporizador = setInterval(() => {
      if (tempoRestante > 0) {
        tempoRestante--;
        temporizadorEl.textContent = tempoRestante;
      } else {
        tempoRestante = 120; // reinicia
        temporizadorEl.textContent = tempoRestante;
      }
    }, 1000);

    botaoRcp.id = 'B'; // Status ativo
  } else {
    // Desativar RCP
    botaoRcp.style.backgroundColor = '#0097b2';
    botaoRcp.textContent = 'INICIAR MASSAGEM CARDÍACA';

    // Parar metrônomo
    clearInterval(intervaloMetronomo);
    intervaloMetronomo = null;
    if (circulo) circulo.src = './img/circle0.png';

    // Parar temporizador
    clearInterval(intervaloTemporizador);
    intervaloTemporizador = null;
    temporizadorEl.textContent = '120';

    botaoRcp.id = 'A'; // Status inativo
  }
}
