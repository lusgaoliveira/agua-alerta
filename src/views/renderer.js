window.electron.onSerialData((data) => {
  console.log("Dados recebidos:", data);

  try {
      const jsonData = JSON.parse(data);

      const distancia1 = jsonData.distancia1;
      const distancia2 = jsonData.distancia2;
      const distanciaCalculada = jsonData.distanciaCalculada;

      // Pegando os elementos do DOM
      const distancia1Elem = document.getElementById("distancia1");
      const distancia2Elem = document.getElementById("distancia2");
      const distanciaCalculadaElem = document.getElementById("distanciaCalculada");
      const serialData = document.getElementById("serialData");

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

  } catch (error) {
      console.error("Erro ao processar os dados:", error, "Dado recebido:", data);
  }
});


document.getElementById("formulario").addEventListener("submit", function(event) {
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