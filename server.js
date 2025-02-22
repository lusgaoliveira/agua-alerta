const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Se você estiver usando PostgreSQL
const nodemailer = require('nodemailer'); // Nodemailer para enviar e-mails
const { Twilio } = require('twilio'); // Twilio para WhatsApp
require('dotenv').config();

const app = express();
const port = 3000;

// Configuração do middleware
app.use(cors());
app.use(express.json()); // Para interpretar JSON

// Configuração do banco de dados (PostgreSQL)
const pool = new Pool({
    user: 'agua_alerta',
    host: 'localhost',
    database: 'db_agua_alerta',
    password: '2000',
    port: 5432
});

// Configuração do Nodemailer para envio de e-mails
const transporter = nodemailer.createTransport({
    service: 'gmail', // ou o serviço de sua escolha
    auth: {
        user: process.env.EMAIL_USER, // Email de envio (utilize variáveis de ambiente para segurança)
        pass: process.env.EMAIL_PASS, // Senha de app
    },
});

// Configuração do Twilio para WhatsApp
const twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioNumber = 'whatsapp:+14155238886'; // Número do Twilio para WhatsApp

// Função para enviar SMS via WhatsApp
async function sendWhatsAppAlert(phone, nivel) {
    try {
        await twilio.messages.create({
            body: `Alerta de Nível de Água: O nível da água atingiu ${nivel}%. Tome as devidas precauções.`,
            from: twilioNumber,
            to: `whatsapp:${phone}`, // O número de telefone do cidadão
        });
        console.log('Mensagem de WhatsApp enviada!');
    } catch (error) {
        console.error('Erro ao enviar WhatsApp:', error);
    }
}

// Função para enviar e-mail
async function sendEmailAlert(email, nivel) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Alerta de Nível de Água Alto',
        text: `O nível da água atingiu ${nivel}%! Por favor, tome as devidas precauções.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail de alerta enviado!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
}

// Rota para cadastrar cidadãos
app.post('/api/citizens', async (req, res) => {
    const { name, email, phone_number } = req.body;

    if (!name || !email || !phone_number) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    try {
        // Inserir dados no banco
        const result = await pool.query(
            'INSERT INTO citizens (name, email, phone_number) VALUES ($1, $2, $3) RETURNING *',
            [name, email, phone_number]
        );

        res.status(201).json({ message: 'Cidadão cadastrado com sucesso!', citizen: result.rows[0] });
    } catch (error) {
        console.error('Erro ao salvar cidadão:', error);
        res.status(500).json({ message: 'Erro ao cadastrar cidadão.' });
    }
});

// Rota para verificar nível da água e enviar alertas
app.post('/api/alerta', async (req, res) => {
    const { nivel, email, phone } = req.body;

    if (nivel > 90) {
        // Enviar e-mail
        await sendEmailAlert(email, nivel);

        // Enviar WhatsApp
        await sendWhatsAppAlert(phone, nivel);

        res.status(200).json({ message: 'Alertas enviados!' });
    } else {
        res.status(200).json({ message: 'Nível de água seguro.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
