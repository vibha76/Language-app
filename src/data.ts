export type Language = { code:string; name:string; native:string; region:string; framework:string; script:string; level:string; learners:string; difficulty:string; glyph:string; tone:string; progress:number };
export const languages: Language[] = [
{code:'kn',name:'Kannada',native:'ಕನ್ನಡ',region:'India',framework:'Internal levels',script:'Kannada',level:'Beginner',learners:'1.2M',difficulty:'Moderate',glyph:'ಕ',tone:'sage',progress:28},
{code:'sa',name:'Sanskrit',native:'संस्कृतम्',region:'Classical',framework:'Internal levels',script:'Devanagari',level:'Beginner',learners:'420K',difficulty:'Advanced',glyph:'सं',tone:'amber',progress:12},
{code:'hi',name:'Hindi',native:'हिन्दी',region:'India',framework:'CEFR-aligned',script:'Devanagari',level:'Beginner',learners:'4.8M',difficulty:'Easy',glyph:'ह',tone:'rose',progress:64},
{code:'fr',name:'French',native:'Français',region:'Europe',framework:'CEFR',script:'Latin',level:'A1',learners:'3.1M',difficulty:'Moderate',glyph:'Fr',tone:'blue',progress:0},
{code:'it',name:'Italian',native:'Italiano',region:'Europe',framework:'CEFR',script:'Latin',level:'A1',learners:'1.7M',difficulty:'Easy',glyph:'It',tone:'violet',progress:0},
{code:'ja',name:'Japanese',native:'日本語',region:'Asia',framework:'Internal levels',script:'Japanese',level:'A1',learners:'2.4M',difficulty:'Advanced',glyph:'日',tone:'sun',progress:0},
{code:'es',name:'Spanish',native:'Español',region:'Europe',framework:'CEFR',script:'Latin',level:'A1',learners:'5.2M',difficulty:'Easy',glyph:'Es',tone:'rose',progress:0},
{code:'de',name:'German',native:'Deutsch',region:'Europe',framework:'CEFR',script:'Latin',level:'A1',learners:'1.8M',difficulty:'Moderate',glyph:'De',tone:'amber',progress:0},
{code:'ta',name:'Tamil',native:'தமிழ்',region:'India',framework:'Internal levels',script:'Tamil',level:'Beginner',learners:'860K',difficulty:'Moderate',glyph:'த',tone:'violet',progress:0},
{code:'te',name:'Telugu',native:'తెలుగు',region:'India',framework:'Internal levels',script:'Telugu',level:'Beginner',learners:'740K',difficulty:'Moderate',glyph:'త',tone:'sage',progress:0},
];
export const lesson = { id:'kn-greetings-01', language:'Kannada', code:'kn', title:'Your First Kannada Conversation', subtitle:'Meet, greet, and make your first four sentences.', duration:'12 min', xp:50,
 vocabulary:[['ನಮಸ್ಕಾರ','Namaskāra','Hello'],['ಹೇಗಿದ್ದೀರಿ?','Hēgiddīri?','How are you?'],['ಚೆನ್ನಾಗಿದ್ದೇನೆ','Chennāgiddēne','I am fine'],['ಧನ್ಯವಾದಗಳು','Dhanyavādagalu','Thank you']],
 dialogue:[['Anu','ನಮಸ್ಕಾರ!','Hello!'],['Ravi','ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಿ?','Hello! How are you?'],['Anu','ಚೆನ್ನಾಗಿದ್ದೇನೆ. ಧನ್ಯವಾದಗಳು.','I am fine. Thank you.']],
 exercises:[{type:'listen',prompt:'Listen and choose the meaning',answer:'I am fine',options:['Good morning','I am fine','Thank you','Goodbye']},{type:'match',prompt:'What does ಧನ್ಯವಾದಗಳು mean?',answer:'Thank you',options:['Hello','How are you?','Thank you','I am fine']},{type:'order',prompt:'Build: “I am fine.”',answer:'ಚೆನ್ನಾಗಿದ್ದೇನೆ',options:['ನಮಸ್ಕಾರ','ಚೆನ್ನಾಗಿದ್ದೇನೆ','ಧನ್ಯವಾದಗಳು','ಇಲ್ಲ']}]};
export const levels=[['Discovery','Sounds, scripts & first words','done'],['Beginner','Useful words & simple sentences','current'],['Elementary','Daily conversations','locked'],['Intermediate','Stories & flexible grammar','locked'],['Upper Intermediate','Natural conversation','locked'],['Advanced','Nuance & expression','locked'],['Professional','Work, study & specialist language','locked'],['Mastery','Near-fluent communication','locked']];
export const skills=[['Speaking',84],['Listening',91],['Reading',76],['Writing',68],['Grammar',81],['Vocabulary',88]];
