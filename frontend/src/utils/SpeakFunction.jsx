export const speakFunction = (text_to_speak) => {
  const speech = new SpeechSynthesisUtterance(text_to_speak);
  speech.lang = 'en-IN'; // You can change language if needed
  speech.pitch = 2;
  speech.rate = 1.6;
  speech.volume = 1;
  
  window.speechSynthesis.speak(speech);
};
