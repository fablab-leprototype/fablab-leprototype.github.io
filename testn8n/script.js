document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatDisplay = document.getElementById('chatDisplay');

    // *** REMPLACEZ CETTE URL PAR L'URL DE VOTRE WEBHOOK N8N ***
    // C'est l'URL que vous obtiendrez du nœud Webhook de n8n.
    const N8N_WEBHOOK_URL = 'https://n8n.srv813846.hstgr.cloud/webhook-test/94a24c38-58f0-499e-b2d3-943be4d20519'; 

    // Fonction pour ajouter un message au chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll vers le bas
    }

    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        const message = userInput.value.trim();
        if (message === '') return;

        addMessage('user', message);
        userInput.value = ''; // Vide l'input

        try {
            // Envoi du message directement au webhook n8n
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Si votre webhook n8n est authentifié, ajoutez des headers ici.
                    // Par exemple: 'Authorization': 'Bearer VOTRE_TOKEN_ICI'
                },
                body: JSON.stringify({ message: message }) // n8n recevra ceci comme $json.body.message
            });

            if (!response.ok) {
                // n8n peut renvoyer un statut 400, 500, etc. en cas d'erreur dans le workflow
                throw new Error(`Erreur HTTP ! statut : ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            // Affiche la réponse de l'agent n8n
            // Assurez-vous que votre workflow n8n renvoie une réponse JSON avec une clé 'reply'.
            addMessage('agent', data.reply || 'Désolé, je n\'ai pas pu obtenir de réponse ou le format est incorrect.');

        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            addMessage('agent', 'Désolé, une erreur est survenue lors de la communication avec l\'agent n8n. Vérifiez la console pour plus de détails.');
        }
    });
});