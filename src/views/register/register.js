document.getElementById("citizenForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone_number: document.getElementById("phone_number").value
    };

    window.electron.send("save-citizen", formData);
});
