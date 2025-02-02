const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('textarea');

// Load all voices
let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = voices
    .map(
      (voice, index) =>
        `<option value="${index}">${voice.name} (${voice.lang})</option>`
    )
    .join('');
}

// Trigger loadVoices when voices are loaded
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// Play TTS
playButton.addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance(textInput.value);
  speechSynthesis.speak(utterance);
});
