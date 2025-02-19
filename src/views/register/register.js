document.getElementById("citizenForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone_number: document.getElementById("phone_number").value
    };

    window.electron.send("save-citizen", formData);
});

// Escuta o evento de sucesso e pede ao `main.js` para fechar a janela
window.electron.ipcRenderer.on("citizen-saved", () => {
    console.log("Cidadão cadastrado com sucesso. Pedindo ao processo principal para fechar a janela.");
    window.electron.send("close-register-window");
});
