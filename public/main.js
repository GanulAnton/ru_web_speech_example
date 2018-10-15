// Speech synthesis
const synth = window.speechSynthesis;

const inputForm = document.querySelector('form');
const inputTxt = document.querySelector('.text');
const voiceSelect = document.querySelector('select');

const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('.value--pitch-value');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('.value--rate-value');

let voices = [];

function populateVoiceList() {
  voices = synth.getVoices();
  const selectedIndex =
    voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for (i = 0; i < voices.length; i++) {
    const option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if (voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }
  if (inputTxt.value !== '') {
    const utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function(event) {
      console.log('SpeechSynthesisUtterance.onend');
    };
    utterThis.onerror = function(event) {
      console.error('SpeechSynthesisUtterance.onerror');
    };
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );
    for (i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  speak();

  inputTxt.blur();
};

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function() {
  rateValue.textContent = rate.value;
};

voiceSelect.onchange = function() {
  speak();
};
// end of speech synthesis

// Speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const colors = {
  красный: 'red',
  оранжевый: 'orange',
  желтый: 'yellow',
  зеленый: 'green',
  голубой: 'blue',
  синий: 'indigo',
  фиолетовый: 'violet'
};

const colorsList = Object.keys(colors);

const grammar =
  '#JSGF V1.0; grammar colors; public <color> = ' +
  colorsList.join(' | ') +
  ' ;';

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'ru-RU';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const microphoneIcon = document.querySelector('.microphone__image');
const microphoneWrapper = document.querySelector('.microphone-wrapper');
const audioRecordAnimation = document.querySelector('.audio-record-animation');
const speechRecognitionSection = document.querySelector(
  '.speech-recognition-section'
);
const recognitionTextResult = document.querySelector('.recognition-result');

microphoneIcon.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
};

recognition.onaudiostart = function() {
  microphoneWrapper.style.visibility = 'hidden';
  audioRecordAnimation.style.visibility = 'visible';
};

recognition.onresult = function(event) {
  const last = event.results.length - 1;
  const colorKey = event.results[last][0].transcript;
  const color = colors[colorKey];

  recognitionTextResult.textContent = 'Результат: ' + color + '.';
  speechRecognitionSection.style.backgroundColor = color;
  console.log('Confidence: ' + event.results[0][0].confidence);
};

recognition.onspeechend = function() {
  recognition.stop();
  microphoneWrapper.style.visibility = 'visible';
  audioRecordAnimation.style.visibility = 'hidden';
};

recognition.onnomatch = function(event) {
  alert("I didn't recognise that color.");
};

recognition.onerror = function(event) {
  alert(`Error occurred in recognition: ${event.error}`);
};
// end of speech recognition
