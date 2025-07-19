// script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('status');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxB-6mspici3--AC6JmM3PnRnm0fxECvzxE1k_22WNOraUH5W6mqKsLou4nOz-UnI4UpQ/exec' ;
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche la soumission normale du formulaire

        statusDiv.innerHTML = 'Envoi en cours...';
        statusDiv.className = ''; // Réinitialise les classes

        const formData = new FormData(form);

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData // Le FormData gère l'encodage correct des champs
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                statusDiv.innerHTML = 'Message envoyé avec succès !';
                statusDiv.className = 'status-success';
                form.reset(); // Réinitialise le formulaire
            } else {
                statusDiv.innerHTML = 'Erreur lors de l\'envoi du message.';
                statusDiv.className = 'status-error';
                console.error('Erreur du serveur:', data);
            }
        })
        .catch(error => {
            statusDiv.innerHTML = 'Une erreur réseau est survenue. Veuillez réessayer.';
            statusDiv.className = 'status-error';
            console.error('Erreur de requête:', error);
        });
    });
});