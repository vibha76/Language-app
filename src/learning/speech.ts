export type SpeechProfile = {
  code:string;
  locale:string;
  sttLanguage:string;
  ttsProvider:'sarvam'|'openai'|'vexyl'|'browser';
  ttsVoice?:string;
  pronunciationNotes:string[];
};

export const speechProfiles:Record<string,SpeechProfile>={
  kn:{code:'kn',locale:'kn-IN',sttLanguage:'kn-IN',ttsProvider:'sarvam',ttsVoice:'kavitha',pronunciationNotes:['Keep retroflex consonants distinct from dental sounds.','Do not rush vowel length.']},
  sa:{code:'sa',locale:'sa-IN',sttLanguage:'sa-IN',ttsProvider:'openai',ttsVoice:'marin',pronunciationNotes:['Sanskrit is treated as its own language, not Hindi.','Hold vowel length and aspirated consonants clearly.','For Vedic material, pitch accents require a dedicated Vedic audio source.']},
  hi:{code:'hi',locale:'hi-IN',sttLanguage:'hi-IN',ttsProvider:'sarvam',ttsVoice:'priya',pronunciationNotes:['Keep dental and retroflex consonants distinct.']},
  ta:{code:'ta',locale:'ta-IN',sttLanguage:'ta-IN',ttsProvider:'sarvam',ttsVoice:'kavitha',pronunciationNotes:['Keep short and long vowels distinct.']},
  te:{code:'te',locale:'te-IN',sttLanguage:'te-IN',ttsProvider:'sarvam',ttsVoice:'anand',pronunciationNotes:['Keep long vowels stable and avoid English stress patterns.']},
  fr:{code:'fr',locale:'fr-FR',sttLanguage:'fr',ttsProvider:'openai',ttsVoice:'marin',pronunciationNotes:['Watch French final consonants and liaison.','Keep nasal vowels distinct.']},
  it:{code:'it',locale:'it-IT',sttLanguage:'it',ttsProvider:'openai',ttsVoice:'coral',pronunciationNotes:['Keep double consonants audible.','Use clear five-vowel articulation.']},
  ja:{code:'ja',locale:'ja-JP',sttLanguage:'ja',ttsProvider:'openai',ttsVoice:'shimmer',pronunciationNotes:['Think in mora timing rather than English stress.','Hold long vowels for their full mora.']},
  es:{code:'es',locale:'es-ES',sttLanguage:'es',ttsProvider:'openai',ttsVoice:'coral',pronunciationNotes:['Keep vowels pure and consistent.','Use Spanish syllable timing rather than English stress.']},
  de:{code:'de',locale:'de-DE',sttLanguage:'de',ttsProvider:'openai',ttsVoice:'cedar',pronunciationNotes:['Keep vowel length contrasts clear.','Watch final consonant devoicing.']},
};

export function getSpeechProfile(code:string){return speechProfiles[code]||{code,locale:'en-US',sttLanguage:'en',ttsProvider:'openai',ttsVoice:'marin',pronunciationNotes:[]};}

export function normalizeSpeechText(value:string){
  return value.toLocaleLowerCase().normalize('NFKC').replace(/[\p{P}\p{S}]/gu,' ').replace(/\s+/g,' ').trim();
}

export function scorePronunciation(target:string,spoken:string){
  const a=normalizeSpeechText(target).split(' ').filter(Boolean);
  const b=normalizeSpeechText(spoken).split(' ').filter(Boolean);
  const matrix=Array.from({length:a.length+1},()=>Array<number>(b.length+1).fill(0));
  for(let i=0;i<=a.length;i++)matrix[i][0]=i;
  for(let j=0;j<=b.length;j++)matrix[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)matrix[i][j]=a[i-1]===b[j-1]?matrix[i-1][j-1]:Math.min(matrix[i-1][j]+1,matrix[i][j-1]+1,matrix[i-1][j-1]+1);
  const distance=matrix[a.length][b.length];
  const base=Math.max(a.length,b.length,1);
  const score=Math.max(0,Math.round((1-distance/base)*100));
  const feedback=a.map((word,i)=>({word,status:b[i]===word?'correct':b[i]?'check':'missing',spoken:b[i]||''}));
  return {score,feedback,normalizedTarget:a.join(' '),normalizedSpoken:b.join(' ')};
}
