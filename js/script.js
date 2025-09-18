// ===============================
// Variáveis globais de controle
// ===============================
let estadoMetronomo = 0;         
let intervaloMetronomo = null;
let intervaloTemporizador = null;
let tempoRestante = 120;         
let horaEmergenciaAcionada = null;

// Controle de ciclos e atendimento
let contador_ciclos = 0;
let atendimentoAtivo = false;

// Elementos da página
const botaoRcp = document.querySelector('.item1');   // botão Massagem
const botaoEmg = document.querySelector('.cabeca');  // botão Emergência
const temporizadorEl = document.querySelector('#temporizador');
const controle = document.querySelector('#controle-metronomo .metronomo');
const contagem_ciclos = document.querySelector("#ciclos");

// Botões dinâmicos
let botaoProximo = null;
let botaoEncerrar = null;

// ===============================
// Eventos principais
// ===============================
botaoRcp.addEventListener('click', iniciarPararRCP);
botaoEmg.addEventListener('click', emergencia);

// Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClick() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.value = 1000;
    gain.gain.value = 0.2;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

// ===============================
// Funções de Emergência
// ===============================
function emergencia() {
  if (botaoEmg.id === 'C') {
    botaoEmg.textContent = 'EMERGÊNCIA A CAMINHO';
    botaoEmg.style.backgroundColor = '#00FF00';
    window.location.href = 'tel:192';
    botaoEmg.id = 'D'; 
    // Salva na variável global
    horaEmergenciaAcionada = new Date().toLocaleString("pt-BR");
  } else {
    botaoEmg.textContent = 'LIGAR PARA EMERGÊNCIA - SAMU';
    botaoEmg.style.backgroundColor = '#004aad';
    botaoEmg.id = 'C'; 
  }
}

// ===============================
// Funções do Metrônomo
// ===============================
function iniciarAlternancia() {
  if (intervaloMetronomo !== null) return;

  intervaloMetronomo = setInterval(() => {
    if (estadoMetronomo === 0) {
      controle.classList.remove('desligado');
      controle.classList.add('ligado');
    } else {
      controle.classList.remove('ligado');
      controle.classList.add('desligado');
    }
    estadoMetronomo = (estadoMetronomo + 1) % 2;
    playClick();
  }, 500);
}

function resetar() {
  if (intervaloMetronomo !== null) {
    clearInterval(intervaloMetronomo);
    intervaloMetronomo = null;
  }
  controle.classList.remove('ligado', 'desligado');
  estadoMetronomo = 0;
}

// ===============================
// Temporizador
// ===============================
function iniciarTemporizador() {
  // Zera e reinicia
  tempoRestante = 120;
  temporizadorEl.textContent = tempoRestante;

  if (intervaloTemporizador) clearInterval(intervaloTemporizador);

  intervaloTemporizador = setInterval(() => {
    if (tempoRestante > 0) {
      tempoRestante--;
      temporizadorEl.textContent = tempoRestante;
    } else {
      tempoRestante = 120;
      temporizadorEl.textContent = tempoRestante;
    }
  }, 1000);
}

function pararTemporizador() {
  clearInterval(intervaloTemporizador);
  intervaloTemporizador = null;
  tempoRestante = 120;
  temporizadorEl.textContent = tempoRestante;
}

// ===============================
// Funções de RCP (Massagem Cardíaca)
// ===============================
function iniciarPararRCP() {
  if (botaoRcp.id === 'A') {
    // Iniciar atendimento se ainda não ativo
    if (!atendimentoAtivo) {
      atendimentoAtivo = true;
      contador_ciclos = 0;
      contagem_ciclos.innerText = contador_ciclos;

      criarBotoesExtras();
    }

    // Iniciar massagem
    botaoRcp.style.backgroundColor = '#B22222';
    botaoRcp.textContent = 'PARAR MASSAGEM CARDÍACA';
    contador_ciclos += 1;
    contagem_ciclos.innerText = contador_ciclos;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    iniciarAlternancia();

    iniciarTemporizador();

    botaoRcp.id = 'B';
  } else {
    // Parar massagem (sem encerrar ainda)
    botaoRcp.style.backgroundColor = '#0097b2';
    botaoRcp.textContent = 'INICIAR MASSAGEM CARDÍACA';

    resetar();
    pararTemporizador();

    botaoRcp.id = 'A';
  }
}

// ===============================
// Botões auxiliares
// ===============================
function criarBotoesExtras() {
  if (!botaoProximo) {
    botaoProximo = document.createElement("button");
    botaoProximo.textContent = "Próximo Socorrista";
    botaoProximo.style.backgroundColor = "#ffa500";
    botaoProximo.onclick = () => {
      contador_ciclos++;
      contagem_ciclos.innerText = contador_ciclos;
      iniciarTemporizador(); // 🔁 reinicia o temporizador a cada troca
    };
    document.querySelector("#container-manipulacao").appendChild(botaoProximo);
  }

  if (!botaoEncerrar) {
    botaoEncerrar = document.createElement("button");
    botaoEncerrar.textContent = "Encerrar Atendimento";
    botaoEncerrar.style.backgroundColor = "#555";
    botaoEncerrar.style.color = "#fff";
    botaoEncerrar.onclick = encerrarAtendimento;
    document.querySelector("#container-manipulacao").appendChild(botaoEncerrar);
  }
}

// ===============================
// Encerrar Atendimento
// ===============================
function encerrarAtendimento() {
  const atendimento = {
    genero: document.querySelector("input[name='genero']:checked")?.value,
    perfil: document.querySelector("#perfil-etaria").value,
    horaInicio: document.querySelector("#horaInicio").value,
    horaMalSubito: document.querySelector("#horaMalSubito").value,
    ciclos: contador_ciclos,
    endereco: document.querySelector("#detectedAddress").value,
    horaEmergencia: horaEmergenciaAcionada || "Não acionada", // pega da variável
    dataRegistro: new Date().toLocaleString("pt-BR")
  };

  let atendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];
  atendimentos.push(atendimento);
  localStorage.setItem("atendimentos", JSON.stringify(atendimentos));

  alert("Atendimento encerrado e salvo!");

  // Resetar estado
    atendimentoAtivo = false;
    contador_ciclos = 0;
    contagem_ciclos.innerText = "0";
    horaEmergenciaAcionada = null; // resetar para próximo atendimento

    // Remover botões extras
    if (botaoProximo) {
        botaoProximo.remove();
        botaoProximo = null;
    }
    if (botaoEncerrar) {
        botaoEncerrar.remove();
        botaoEncerrar = null;
    }

  // Parar recursos ativos
  resetar();
  pararTemporizador();

  // Limpar a página (exemplo: reload total)
  location.reload();
}

// ===============================
// Funções de LOCALIZAÇÃO
// ===============================
let map, marker, geocoder, initialPos;
window.onload = function () {
  geocoder = new google.maps.Geocoder();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        initialPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        geocoder.geocode({ location: initialPos }, (results, status) => {
          if (status === "OK" && results[0]) {
            document.getElementById("detectedAddress").value = results[0].formatted_address;
          } else {
            document.getElementById("detectedAddress").value = "Endereço não encontrado.";
          }
        });
      },
      () => { alert("Não foi possível obter sua localização."); }
    );
  } else {
    alert("Seu navegador não suporta geolocalização.");
  }
};

function mostrarMapa() {
  document.getElementById("mapContainer").style.display = "block";
  document.getElementById("info").style.display = "block";

  if (!initialPos) {
    alert("A posição inicial ainda não foi detectada.");
    return;
  }
  if (!map) {
    map = new google.maps.Map(document.getElementById("map"), {
      center: initialPos,
      zoom: 16
    });
    marker = new google.maps.Marker({
      position: initialPos,
      map: map,
      draggable: true
    });
    atualizarEndereco(initialPos);
    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      atualizarEndereco(pos);
    });
  }
}

function atualizarEndereco(latlng) {
  const lat = typeof latlng.lat === "function" ? latlng.lat() : latlng.lat;
  const lng = typeof latlng.lng === "function" ? latlng.lng() : latlng.lng;
  document.getElementById("lat").textContent = lat.toFixed(6);
  document.getElementById("lng").textContent = lng.toFixed(6);
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === "OK" && results[0]) {
      document.getElementById("address").value = results[0].formatted_address;
    } else {
      document.getElementById("address").value = "Endereço não encontrado.";
    }
  });
}

function confirmarEndereco() {
  const endereco = document.getElementById("address").value;
  const lat = document.getElementById("lat").textContent;
  const lng = document.getElementById("lng").textContent;
  document.getElementById("detectedAddress").value = endereco;
  alert(`Novo endereço confirmado:\n\n${endereco}\nLat: ${lat}\nLng: ${lng}`);
  document.getElementById("mapContainer").style.display = "none";
}
