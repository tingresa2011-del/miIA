const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// REEMPLAZA 192.168.1.XX por tu IP real (Ejemplo: 192.168.1.15)
const port = process.env.PORT || 3000;

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Mostrar mensaje del usuario
    addMessage(text, 'user');
    userInput.value = '';

    try {
        // Usamos tu IP y el puerto 3000 donde corre server.js
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        // 2. Mostrar respuesta de MYK IA formateada con Marked
        if (typeof marked !== 'undefined') {
            addMessage(marked.parse(data.reply), 'bot', true);
        } else {
            addMessage(data.reply, 'bot', false);
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        addMessage("Error: No se pudo conectar con el servidor. Revisa la IP y el Firewall.", 'bot');
    }
}

// Función para manejar la creación de burbujas
function addMessage(content, sender, isHTML = false) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    
    if (isHTML) {
        div.innerHTML = content; // Para las listas y negritas de la IA
    } else {
        const p = document.createElement('p');
        p.innerText = content; // Para el texto simple del usuario
        div.appendChild(p);
    }
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Escuchar la tecla Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});