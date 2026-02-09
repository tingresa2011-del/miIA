const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000 ;

app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = 'AIzaSyAw1LhZvHMJMnFCTVtFxllgqLbk-5Cz3c4';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Esta variable guarda la memoria mientras el servidor esté encendido
let chatHistory = []; 

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Iniciamos el chat con el historial para que tenga MEMORIA
        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const replyText = response.text();

        // Guardamos en el historial para la próxima pregunta
        chatHistory.push({ role: "user", parts: [{ text: message }] });
        chatHistory.push({ role: "model", parts: [{ text: replyText }] });

        res.json({ reply: replyText });
    } catch (error) {
        console.error("Error:", error.message);
        res.json({ reply: "Error de conexión con Gemini." });
    }
});

app.listen(port, () => {
    console.log(`🚀 MYK IA corriendo en http://localhost:${port}`);
});