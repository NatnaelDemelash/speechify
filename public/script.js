const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('textarea');
const languageSelect = document.querySelector('#languageSelect');
const statusMessage = document.createElement('p');
statusMessage.className = 'text-gray-300 text-center mt-4';
document.querySelector('.bg-gray-800').appendChild(statusMessage);

// Populate language options dynamically
const languages = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ja: 'Japanese',
  tr: 'Turkish',
};

languageSelect.innerHTML = Object.entries(languages)
  .map(([code, name]) => `<option value="${code}">${name}</option>`)
  .join('');

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

// Wait for the voices to be loaded before calling loadVoices
window.speechSynthesis.onvoiceschanged = function () {
  loadVoices();
};

// Optionally, call loadVoices immediately in case the voices are already loaded
loadVoices();

// Function to translate text using MyMemory API
async function translateText(text, targetLang) {
  if (targetLang === 'en') {
    statusMessage.textContent =
      'Please select a language different from English.';
    return text;
  }
  statusMessage.textContent = 'Translating...';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=en|${targetLang}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    statusMessage.textContent = 'Translation complete!';
    return data.responseData.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    statusMessage.textContent = 'Translation failed.';
    return text; // Return original text if translation fails
  }
}

// Play TTS with Translation
playButton.addEventListener('click', async () => {
  const inputText = textInput.value;
  const targetLanguage = languageSelect.value;

  try {
    const translatedText = await translateText(inputText, targetLanguage);
    const utterance = new SpeechSynthesisUtterance(translatedText);
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Speech synthesis error:', error);
  }
});
