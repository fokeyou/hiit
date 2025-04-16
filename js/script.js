let timer;
let isRunning = false;
let currentTime = 0;
let currentRound = 0;
let isSprint = true;
let lastPlayedTime = -1;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDisplay = document.getElementById('status');
const progressBar = document.getElementById('progress');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function speak(text) {
    if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }
}

async function updateTimer() {
    if (currentTime <= 0) {
        if (currentRound >= parseInt(document.getElementById('rounds').value)) {
            stopTimer();
            speak('训练完成');
            setTimeout(resetTimer, 2000);
            return;
        }

        isSprint = !isSprint;
        if (isSprint) {
            currentRound++;
            currentTime = parseInt(document.getElementById('sprintTime').value);
            statusDisplay.textContent = `第${currentRound}组 - 冲刺`;
            progressBar.style.backgroundColor = 'var(--primary)';
            speak('开始冲刺');
        } else {
            currentTime = parseInt(document.getElementById('restTime').value);
            statusDisplay.textContent = `第${currentRound}组 - 慢划`;
            progressBar.style.backgroundColor = 'var(--secondary)';
            speak('开始慢划');
        }
    }

    if (currentTime <= 10 && currentTime !== lastPlayedTime) {
        lastPlayedTime = currentTime;
        speak(currentTime.toString());
    }

    const timePercentage = (currentTime / (isSprint ? parseInt(document.getElementById('sprintTime').value) : parseInt(document.getElementById('restTime').value))) * 100;
    progressBar.style.width = `${timePercentage}%`;

    timerDisplay.textContent = formatTime(currentTime);
    currentTime--;
}

async function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startBtn.textContent = '暂停';
    speak('准备开始训练');

    currentRound = 1;
    isSprint = true;
    currentTime = parseInt(document.getElementById('sprintTime').value);
    lastPlayedTime = -1;
    statusDisplay.textContent = `第1组 - 冲刺`;
    progressBar.style.backgroundColor = 'var(--primary)';

    timer = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = '开始';
    window.speechSynthesis.cancel();
}

function resetTimer() {
    stopTimer();
    currentTime = 0;
    currentRound = 1;
    isSprint = true;
    lastPlayedTime = -1;
    timerDisplay.textContent = '00:00';
    statusDisplay.textContent = '准备开始';
    progressBar.style.width = '0%';
    window.speechSynthesis.cancel();
}

startBtn.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

['sprintTime', 'restTime', 'rounds'].forEach(id => {
    const element = document.getElementById(id);
    element.value = localStorage.getItem(id) || element.value;
    element.addEventListener('change', () => {
        localStorage.setItem(id, element.value);
    });
});
