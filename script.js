// ===============================
// Variáveis globais de controle
// ===============================
let estadoMetronomo = 0;         // alternância do metrônomo (0/1)
let intervaloMetronomo = null;
let intervaloTemporizador = null;
let tempoRestante = 120;         // Agora é global

// Elementos da página
const botaoRcp = document.querySelector('.item1');   // botão Massagem
const botaoEmg = document.querySelector('.cabeca');  // botão Emergência
const temporizadorEl = document.querySelector('#temporizador');
const controle = document.querySelector('#controle-metronomo .metronomo');
const contagem_ciclos = document.querySelector("#ciclos");
let contador_ciclos = 0;
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

      osc.type = "square";        // tipo de onda
      osc.frequency.value = 1000; // frequência (Hz) - som agudo
      gain.gain.value = 0.2;      // volume

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05); // duração curta (~50ms)
  }

// ===============================
// Funções de Emergência
// ===============================
function emergencia() {
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
function iniciarAlternancia() {
  if (intervaloMetronomo !== null) return; // evita duplicar intervalos

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
  // Parar o intervalo do metrônomo
  if (intervaloMetronomo !== null) {
    clearInterval(intervaloMetronomo);
    intervaloMetronomo = null;
  }

  // Resetar classe visual
  controle.classList.remove('ligado', 'desligado');
  estadoMetronomo = 0;

  contador_ciclos
}

// ===============================
// Funções de RCP (Massagem Cardíaca)
// ===============================
function iniciarPararRCP() {
  if (botaoRcp.id === 'A') {
    // Ativar RCP
    botaoRcp.style.backgroundColor = '#B22222';
    botaoRcp.textContent = 'PARAR MASSAGEM CARDÍACA';
    contador_ciclos +=1;
    contagem_ciclos.innerText = contador_ciclos; 
      // Em alguns navegadores o áudio só inicia após interação explícita
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
     }
    iniciarAlternancia();

    // Iniciar temporizador
    intervaloTemporizador = setInterval(() => {
      if (tempoRestante > 0) {
        tempoRestante--;
        temporizadorEl.textContent = tempoRestante;
      } else {
        tempoRestante = 120;
        temporizadorEl.textContent = tempoRestante;
      }
    }, 1000);

    botaoRcp.id = 'B'; // Status ativo
  } else {
    // Desativar RCP
    botaoRcp.style.backgroundColor = '#0097b2';
    botaoRcp.textContent = 'INICIAR MASSAGEM CARDÍACA';

    // Parar metrônomo
    resetar();

    // Parar temporizador
    clearInterval(intervaloTemporizador);
    intervaloTemporizador = null;

    tempoRestante = 120;
    temporizadorEl.textContent = tempoRestante;

    botaoRcp.id = 'A'; // Status inativo
  }
}

// ===============================
// Funções de LOCALIZAÇÃO
// ===============================

 let map, marker, geocoder, initialPos;

    // Detecta a posição automaticamente ao carregar a página
    window.onload = function () {
      geocoder = new google.maps.Geocoder();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initialPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            // Busca o endereço e exibe no campo inicial
            geocoder.geocode({ location: initialPos }, (results, status) => {
              if (status === "OK" && results[0]) {
                document.getElementById("detectedAddress").value = results[0].formatted_address;
              } else {
                document.getElementById("detectedAddress").value = "Endereço não encontrado.";
              }
            });
          },
          () => {
            alert("Não foi possível obter sua localização.");
          }
        );
      } else {
        alert("Seu navegador não suporta geolocalização.");
      }
    };

    // Mostra o mapa interativo para ajuste
      function mostrarMapa() {
      // Mostra os elementos do mapa apenas quando o usuário quiser
      document.getElementById("mapContainer").style.display = "block";
      document.getElementById("info").style.display = "block";

      // Verifica se a posição inicial já foi detectada
      if (!initialPos) {
        alert("A posição inicial ainda não foi detectada. Aguarde alguns segundos ou insira um endereço manualmente.");
        return;
      }

      // Cria o mapa apenas se ainda não tiver sido criado
      if (!map) {
        map = new google.maps.Map(document.getElementById("map"), {
          center: initialPos,
          zoom: 16
        });

        // Marker clássico
        marker = new google.maps.Marker({
          position: initialPos,
          map: map,
          draggable: true
        });

        // Atualiza o endereço inicial
        atualizarEndereco(initialPos);

        // Atualiza endereço quando o marcador é arrastado
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

      // Opcional: Esconde o mapa após confirmação
      document.getElementById("mapContainer").style.display = "none";
    }