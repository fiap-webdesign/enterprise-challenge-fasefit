document.addEventListener('DOMContentLoaded', () => {
    const scoreElement = document.getElementById('score');
    let currentScore = 0; // Começamos com 0 pontos

    // Tenta carregar a pontuação salva (se existir)
    if (localStorage.getItem('fasefitScore')) {
        currentScore = parseInt(localStorage.getItem('fasefitScore'));
        scoreElement.textContent = `Pontos: ${currentScore}`;
    }

    // Lógica para a página de Perfil
    const profileScoreDisplay = document.getElementById('profile-score-value');
    if (profileScoreDisplay) { // Se estiver na página de perfil
        profileScoreDisplay.textContent = currentScore;
    }

    // Lógica para a página de Desafios
    const completeButtons = document.querySelectorAll('.complete-button');
    if (completeButtons.length > 0) { // Se estiver na página de desafios
        completeButtons.forEach(button => {
            const challengeItem = button.closest('.challenge-item');
            const challengeId = challengeItem.dataset.challengeId;

            // Tenta carregar o estado dos desafios (se já foram concluídos)
            if (localStorage.getItem(`challenge_${challengeId}_completed`) === 'true') {
                button.classList.add('completed');
                button.textContent = 'Concluído!';
                challengeItem.classList.add('completed');
            }

            button.addEventListener('click', () => {
                // Verifica se o desafio já foi concluído
                if (button.classList.contains('completed')) {
                    return; // Se já foi, não faz nada
                }

                // Marca o desafio como concluído
                button.classList.add('completed');
                button.textContent = 'Concluído!';
                challengeItem.classList.add('completed');

                // Salva o estado do desafio no armazenamento local do navegador
                localStorage.setItem(`challenge_${challengeId}_completed`, 'true');

                // Aumenta a pontuação
                currentScore += 10; // Cada desafio vale 10 pontos!
                scoreElement.textContent = `Pontos: ${currentScore}`;

                // Salva a nova pontuação no armazenamento local do navegador
                localStorage.setItem('fasefitScore', currentScore);

                alert('Parabéns! Desafio concluído! Você ganhou 10 pontos!'); // Mensagem de parabéns
                
                // Tenta atualizar conquistas após pontuação, caso esteja na página de conquistas
                checkAchievements();
            });
        });
    }

    // Lógica para a página de Conquistas
    const achievementsGrid = document.querySelector('.achievements-grid');
    if (achievementsGrid) { // Se estiver na página de conquistas
        checkAchievements(); // Verifica e atualiza as conquistas ao carregar a página
    }

    function checkAchievements() {
        const achievementItems = document.querySelectorAll('.achievement-item');
        achievementItems.forEach(item => {
            const minScore = parseInt(item.dataset.minScore);
            const achievementId = item.dataset.achievementId;
            const statusBadge = item.querySelector('.status-badge');

            // Verifica se a conquista já está salva como desbloqueada
            const isUnlockedSaved = localStorage.getItem(`achievement_${achievementId}_unlocked`) === 'true';

            if (currentScore >= minScore || isUnlockedSaved) {
                item.classList.add('unlocked');
                statusBadge.textContent = 'Desbloqueado!';
                // Salva o estado da conquista como desbloqueado
                localStorage.setItem(`achievement_${achievementId}_unlocked`, 'true');
            } else {
                item.classList.remove('unlocked');
                statusBadge.textContent = 'Bloqueado';
            }
        });
    }
});