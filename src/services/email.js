const nodemailer = require('nodemailer');
require('dotenv').config();
const CitizenRepository = require("../repositories/citizenRepository");

const transport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

const emailCreationOptions = (recipient, content) => {
    return {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: "Alerta: Nível da Água Alto",
        text: content
    }
}

const sendEmail = async (recipient, content) => {
    const emailCreated = emailCreationOptions(recipient, content);

    try {
        const info = await transport.sendMail(emailCreated);
        console.log('E-mail enviado: ' + info.response);
        return info.response;
    } catch (error) {
        console.log('Erro ao enviar e-mail: ', error);
        throw error;
    }
}

const sendEmailToAllUsers = async (content) => {
    try {
        const users = await CitizenRepository.listAll(); 
        console.log("Usuários recuperados:", users);

        for (const user of users) {
            try {
                await sendEmail(user.email, content);
                console.log(`E-mail enviado para ${user.email}`);
            } catch (error) {
                console.error(`Erro ao enviar e-mail para ${user.email}:`, error);
            }
        }
    } catch (error) {
        console.error("Erro ao recuperar usuários:", error);
    }
};

module.exports = { sendEmail, sendEmailToAllUsers };