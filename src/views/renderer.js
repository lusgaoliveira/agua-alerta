window.electron.onSerialData((data) => {
  console.log("Dados recebidos:", data);

  let distancia1, distancia2, distanciaCalculada;

  try {
    // Tenta interpretar os dados como JSON
    const jsonData = JSON.parse(data);
    distancia1 = jsonData.distancia1;
    distancia2 = jsonData.distancia2;
    distanciaCalculada = jsonData.distanciaCalculada;
  } catch (error) {
    // Caso não seja JSON, tenta extrair os dados do texto
    console.warn("Dados em formato de texto detectados. Extraindo informações...");

    if (/Sensor 1/.test(data)) {
      distancia1 = parseInt(data.match(/\d+/)[0], 10);
    } else if (/Sensor 2/.test(data)) {
      distancia2 = parseInt(data.match(/\d+/)[0], 10);
    } else if (/Média/.test(data)) {
      distanciaCalculada = parseInt(data.match(/\d+/)[0], 10);
    }
  }

  // Pegando os elementos do DOM
  const distancia1Elem = document.getElementById("distancia1");
  const distancia2Elem = document.getElementById("distancia2");
  const distanciaCalculadaElem = document.getElementById("distanciaCalculada");
  const serialData = document.getElementById("serialData");
  const nivelElem = document.getElementById("nivel");
  const waterElem = document.getElementById("water");

  // Atualizando os valores apenas se os elementos existirem
  if (distancia1Elem && distancia1 !== undefined) {
    distancia1Elem.innerText = `Distância Sensor 1: ${distancia1} cm`;
  }
  if (distancia2Elem && distancia2 !== undefined) {
    distancia2Elem.innerText = `Distância Sensor 2: ${distancia2} cm`;
  }
  if (distanciaCalculadaElem && distanciaCalculada !== undefined) {
    distanciaCalculadaElem.innerText = `Distância Média: ${distanciaCalculada} cm`;
  }

  if (serialData) {
    serialData.style.display = "none";
  }

  // Animação do nível de água com base na distância calculada
  if (nivelElem && waterElem && distanciaCalculada !== undefined) {
    const porcentagem = Math.max(0, Math.min(100, 100 - distanciaCalculada)); // Converte a distância em nível de água
    nivelElem.innerText = porcentagem;

    anime({
      targets: waterElem,
      height: `${porcentagem}%`,
      easing: "easeInOutQuad",
      duration: 1000
    });
  }
});


document.getElementById("citizenForm").addEventListener("submit", function(event) {
  event.preventDefault(); 
  const formData = new FormData(event.target);

  const dadosFormulario = {};
  formData.forEach((value, key) => {
    dadosFormulario[key] = value; 
  });

  console.log("Dados do formulário:", dadosFormulario);
});


window.electron.ipcRenderer.on("citizen-saved", async() => {
  console.log("Cidadão cadastrado com sucesso. Fechando janela...");
  window.close();
});