window.electron.onSerialData((event, data) => {
  console.log("Dados recebidos:", data);
  
  try {
    const jsonData = JSON.parse(data);

    const distancia1 = jsonData.distancia1;
    const distancia2 = jsonData.distancia2;
    const distanciaCalculada = jsonData.distanciaCalculada;

    if (distancia1 !== undefined) {
      document.getElementById("distancia1").innerText = "Distância Sensor 1: " + distancia1 + " cm";
    }
    if (distancia2 !== undefined) {
      document.getElementById("distancia2").innerText = "Distância Sensor 2: " + distancia2 + " cm";
    }
    if (distanciaCalculada !== undefined) {
      document.getElementById("distanciaCalculada").innerText = "Distância Média: " + distanciaCalculada + " cm";
    }
  } catch (error) {
    console.error("Erro ao processar os dados:", error);
  }
});
