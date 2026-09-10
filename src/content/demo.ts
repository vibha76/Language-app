export const demoLanguages = [
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', framework: 'internal', level: 'Beginner' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', framework: 'classical', level: 'Beginner' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', framework: 'cefr-compatible', level: 'Beginner' },
  { code: 'fr', name: 'French', nativeName: 'Français', script: 'Latin', framework: 'CEFR', level: 'A1' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', script: 'Latin', framework: 'CEFR', level: 'A1' },
];

export const demoLessons = {
  kn: {
    title: 'Your First Kannada Conversation',
    vocabulary: [
      { text: 'ನಮಸ್ಕಾರ', transliteration: 'namaskāra', meaning: 'Hello' },
      { text: 'ಹೇಗಿದ್ದೀರಿ?', transliteration: 'hēgiddīri?', meaning: 'How are you?' },
      { text: 'ಚೆನ್ನಾಗಿದ್ದೇನೆ', transliteration: 'cennāgiddēne', meaning: 'I am fine' },
      { text: 'ಧನ್ಯವಾದಗಳು', transliteration: 'dhanyavādagaḷu', meaning: 'Thank you' },
    ],
    dialogue: [['Anu', 'ನಮಸ್ಕಾರ!'], ['Ravi', 'ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಿ?'], ['Anu', 'ಚೆನ್ನಾಗಿದ್ದೇನೆ. ಧನ್ಯವಾದಗಳು!']],
    exercises: ['listen', 'speak', 'match', 'sentence-order', 'mini-test'],
  },
  sa: {
    title: 'Your First Sanskrit Words',
    vocabulary: [
      { text: 'नमस्ते', transliteration: 'namaste', meaning: 'Hello' },
      { text: 'धन्यवादः', transliteration: 'dhanyavādaḥ', meaning: 'Thank you' },
      { text: 'भवान्', transliteration: 'bhavān', meaning: 'you (masculine/formal)' },
      { text: 'भवती', transliteration: 'bhavatī', meaning: 'you (feminine/formal)' },
    ],
    dialogue: [['आर्या', 'नमस्ते!'], ['देवः', 'नमस्ते! कथम् अस्ति?'], ['आर्या', 'अहं कुशला अस्मि।']],
    exercises: ['script', 'listen', 'speak', 'grammar', 'mini-test'],
  },
  fr: {
    title: 'Meeting Someone in Paris',
    vocabulary: [
      { text: 'Bonjour', transliteration: 'bonjour', meaning: 'Hello' },
      { text: "Comment tu t'appelles?", transliteration: 'komɑ̃ ty tapɛl', meaning: 'What is your name?' },
      { text: "Je m'appelle...", transliteration: 'ʒə mapɛl', meaning: 'My name is...' },
      { text: 'Enchanté', transliteration: 'ɑ̃ʃɑ̃te', meaning: 'Nice to meet you' },
    ],
    dialogue: [['Léa', 'Bonjour!'], ['Noah', "Comment tu t'appelles?"], ['Léa', "Je m'appelle Léa. Enchantée!"]],
    exercises: ['listen', 'pronunciation', 'vocabulary', 'sentence-builder', 'conversation'],
  },
};
