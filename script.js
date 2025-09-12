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

// ===============================
// Eventos principais
// ===============================
botaoRcp.addEventListener('click', iniciarPararRCP);
botaoEmg.addEventListener('click', emergencia);

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
}

// ===============================
// Funções de RCP (Massagem Cardíaca)
// ===============================
function iniciarPararRCP() {
  if (botaoRcp.id === 'A') {
    // Ativar RCP
    botaoRcp.style.backgroundColor = '#B22222';
    botaoRcp.textContent = 'PARAR MASSAGEM CARDÍACA';

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
      document.getElementById("mapContainer").style.display = "block";
      document.getElementById("info").style.display = "block";

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

      // Opcional: Esconde o mapa após confirmação
      document.getElementById("mapContainer").style.display = "none";
    }