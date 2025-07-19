
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatDisplay = document.getElementById('chatDisplay');
    const imageBtn = document.getElementById('imageBtn');
    const emailBtn = document.getElementById('emailBtn');

    // Nouveaux éléments pour l'historique
    const prevMessageBtn = document.getElementById('prevMessageBtn');
    const nextMessageBtn = document.getElementById('nextMessageBtn');
    const historyIndexSpan = document.getElementById('historyIndex');

    let messageHistory = []; // Tableau pour stocker l'historique des messages de l'utilisateur
    let historyPointer = -1; // Pointeur vers l'index actuel dans l'historique (-1 signifie pas de message dans l'input)

    // *** REMPLACEZ CETTE URL PAR L'URL DE VOTRE WEBHOOK N8N ***
    const N8N_WEBHOOK_URL_TEST = 'https://n8n.srv813846.hstgr.cloud/webhook-test/94a24c38-58f0-499e-b2d3-943be4d20519'; 
    const N8N_WEBHOOK_URL_PROD = 'https://n8n.srv813846.hstgr.cloud/webhook/94a24c38-58f0-499e-b2d3-943be4d20519'; 
    const N8N_WEBHOOK_URL = N8N_WEBHOOK_URL_PROD ;

    // Fonction pour ajouter un message au chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll vers le bas
    }

    // Fonction pour mettre à jour l'affichage de l'index de l'historique et l'état des boutons
    function updateHistoryUI() {
        if (messageHistory.length === 0) {
            historyIndexSpan.textContent = '0/0';
            prevMessageBtn.disabled = true;
            nextMessageBtn.disabled = true;
        } else {
            // Si le pointeur est à -1, cela signifie que l'utilisateur est en train de taper un nouveau message,
            // ou qu'il a navigué au-delà du dernier message de l'historique.
            // On affiche le total des messages disponibles.
            const displayIndex = historyPointer === -1 ? messageHistory.length : historyPointer + 1;
            historyIndexSpan.textContent = `${displayIndex}/${messageHistory.length}`;
            
            prevMessageBtn.disabled = historyPointer <= 0;
            nextMessageBtn.disabled = historyPointer >= messageHistory.length -1;
        }
    }

    // Gestionnaire d'événement pour le bouton "Image"
    imageBtn.addEventListener('click', () => {
        userInput.value = 'img: ';
        userInput.focus();
        historyPointer = -1; // Réinitialise le pointeur si l'utilisateur commence une nouvelle saisie
        updateHistoryUI();
    });

    // Gestionnaire d'événement pour le bouton "Email"
    emailBtn.addEventListener('click', () => {
        userInput.value += ' . Email cela a l\'adresse'; 
        userInput.focus();
        historyPointer = -1; // Réinitialise le pointeur si l'utilisateur commence une nouvelle saisie
        updateHistoryUI();
    });

    // Gestionnaire d'événement pour le bouton "Précédent"
    prevMessageBtn.addEventListener('click', () => {
        if (messageHistory.length > 0 && historyPointer > 0) {
            historyPointer--;
            userInput.value = messageHistory[historyPointer];
            userInput.focus();
        } else if (messageHistory.length > 0 && historyPointer === 0) {
             // Si on est au premier message, on reste au premier mais on désactive le bouton
            userInput.value = messageHistory[historyPointer];
            userInput.focus();
        }
        updateHistoryUI();
    });

    // Gestionnaire d'événement pour le bouton "Suivant"
    nextMessageBtn.addEventListener('click', () => {
        if (messageHistory.length > 0 && historyPointer < messageHistory.length - 1) {
            historyPointer++;
            userInput.value = messageHistory[historyPointer];
            userInput.focus();
        } else if (messageHistory.length > 0 && historyPointer === messageHistory.length - 1) {
            // Si on est au dernier message, on permet de vider l'input pour un nouveau message
            historyPointer = -1; // Passe à un état "nouveau message"
            userInput.value = '';
            userInput.focus();
        }
        updateHistoryUI();
    });

    // Réinitialise le pointeur de l'historique quand l'utilisateur commence à taper
    userInput.addEventListener('input', () => {
        historyPointer = -1;
        updateHistoryUI();
    });


    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const message = userInput.value.trim();
        if (message === '') return;

        // Ajoute le message à l'historique seulement s'il n'est pas déjà le dernier message
        if (messageHistory.length === 0 || messageHistory[messageHistory.length - 1] !== message) {
            messageHistory.push(message);
        }
        historyPointer = -1; // Réinitialise le pointeur après l'envoi
        updateHistoryUI(); // Met à jour l'UI de l'historique


        addMessage('user', message);
        userInput.value = ''; // Vide l'input

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            addMessage('agent', data.reply || 'Désolé, je n\'ai pas pu obtenir de réponse ou le format est incorrect.');

        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            addMessage('agent', 'Désolé, une erreur est survenue lors de la communication avec l\'agent n8n. Vérifiez la console pour plus de détails.');
        }
    });

    // Initialise l'UI de l'historique au chargement de la page
    updateHistoryUI();
});