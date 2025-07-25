// script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('status');
    const SCRIPT_URL = 'https://script.google.com/a/macros/leprototype.info/s/AKfycbwcbPWzg1rZw1LMe13-UGN8VRyF9wRCi-1w7DqtvcYbRxLqtcka9FsDF3WfQJQ04bX4/exec';
    
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
                statusDiv.innerHTML = 'Demande de réservation envoyée avec succès !';
                statusDiv.className = 'status-success';
                form.reset(); // Réinitialise le formulaire
            } else {
                statusDiv.innerHTML = 'Erreur lors de l\'envoi Demande de la réservation.';
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