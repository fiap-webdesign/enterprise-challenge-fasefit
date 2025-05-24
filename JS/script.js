document.addEventListener('DOMContentLoaded', () => {
    const scoreElement = document.getElementById('score');
    let currentScore = 0; 

    if (localStorage.getItem('fasefitScore')) {
        currentScore = parseInt(localStorage.getItem('fasefitScore'));
    }
    if (scoreElement) { 
        scoreElement.textContent = `Pontos: ${currentScore}`;
    }

    const profileScoreDisplay = document.getElementById('profile-score-value');
    if (profileScoreDisplay) { 
        profileScoreDisplay.textContent = currentScore;
    }

    const resetButton = document.getElementById('reset-score-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja zerar sua pontuação e o progresso dos desafios?')) {
                currentScore = 0;
                localStorage.setItem('fasefitScore', currentScore); 
                if (scoreElement) {
                    scoreElement.textContent = `Pontos: ${currentScore}`; 
                }
                if (profileScoreDisplay) {
                    profileScoreDisplay.textContent = currentScore;
                }

                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('challenge_') || key.startsWith('achievement_')) {
                        localStorage.removeItem(key);
                    }
                }
                
                location.reload(); 
            }
        });
    }


    const completeButtons = document.querySelectorAll('.complete-button');
    if (completeButtons.length > 0) { 
        completeButtons.forEach(button => {
            const challengeItem = button.closest('.challenge-item'); 
            const challengeId = challengeItem.dataset.challengeId; 
            const pointsPerChallenge = 10; 

            if (localStorage.getItem(`challenge_${challengeId}_completed`) === 'true') {
                button.classList.add('completed');
                button.textContent = 'Concluído!';
                challengeItem.classList.add('completed');
            }

            button.addEventListener('click', () => {
                if (button.classList.contains('completed')) {
                    button.classList.remove('completed'); 
                    button.textContent = 'Concluir'; 
                    challengeItem.classList.remove('completed'); 
                    localStorage.removeItem(`challenge_${challengeId}_completed`);

                    currentScore -= pointsPerChallenge; 
                    if (currentScore < 0) {
                        currentScore = 0;
                    }

                    if (scoreElement) { 
                        scoreElement.textContent = `Pontos: ${currentScore}`;
                    }
                    localStorage.setItem('fasefitScore', currentScore); 

                    alert('Desafio desmarcado. Pontos removidos.'); 
                } else {
                    button.classList.add('completed'); 
                    button.textContent = 'Concluído!'; 
                    challengeItem.classList.add('completed'); 

                    localStorage.setItem(`challenge_${challengeId}_completed`, 'true');

                    currentScore += pointsPerChallenge; 
                    if (scoreElement) { 
                        scoreElement.textContent = `Pontos: ${currentScore}`;
                    }

                    localStorage.setItem('fasefitScore', currentScore);

                    alert('Parabéns! Desafio concluído! Você ganhou ' + pointsPerChallenge + ' pontos!');
                }
                checkAchievements(); 
            });
        });
    }

    const achievementsGrid = document.querySelector('.achievements-grid');
    if (achievementsGrid) { 
        checkAchievements(); 
    }

    function checkAchievements() {
        const achievementItems = document.querySelectorAll('.achievement-item');
        achievementItems.forEach(item => {
            const minScore = parseInt(item.dataset.minScore);
            const achievementId = item.dataset.achievementId;
            const statusBadge = item.querySelector('.status-badge');

            const isUnlockedSaved = localStorage.getItem(`achievement_${achievementId}_unlocked`) === 'true';

            if (currentScore >= minScore || isUnlockedSaved) {
                item.classList.add('unlocked');
                statusBadge.textContent = 'Desbloqueado!';
                localStorage.setItem(`achievement_${achievementId}_unlocked`, 'true');
            } else {
                item.classList.remove('unlocked');
                statusBadge.textContent = 'Bloqueado';
                localStorage.removeItem(`achievement_${achievementId}_unlocked`); 
            }
        });
    }
});