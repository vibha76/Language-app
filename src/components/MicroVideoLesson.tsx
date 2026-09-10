'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {getSpeechProfile} from '../learning/speech';

type Props={code:string;language:string;dialogue:string[][];durationSeconds?:number};

export default function MicroVideoLesson({code,language,dialogue,durationSeconds=90}:Props){
 const profile=getSpeechProfile(code);
 const [scene,setScene]=useState(0); const [playing,setPlaying]=useState(false); const [loadingAudio,setLoadingAudio]=useState(false); const [error,setError]=useState('');
 const audioRef=useRef<HTMLAudioElement>(null);
 const audioContextRef=useRef<AudioContext|null>(null);
 const sourceRef=useRef<AudioBufferSourceNode|null>(null);
 const scenes=useMemo(()=>dialogue.map((line,i)=>({speaker:line[0],text:line[1],translation:line[2]||'',seconds:Math.max(8,Math.floor(durationSeconds/Math.max(dialogue.length,1)))})),[dialogue,durationSeconds]);
 const current=scenes[scene];

 function ensureAudioContext(){
   if(typeof window==='undefined')return null;
   const AudioContextCtor=window.AudioContext||((window as typeof window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext);
   if(!AudioContextCtor)return null;
   const context=audioContextRef.current||new AudioContextCtor();
   audioContextRef.current=context;
   if(context.state==='suspended')void context.resume();
   return context;
 }

 function stopGeneratedAudio(){
   try{sourceRef.current?.stop();}catch{}
   sourceRef.current=null;
 }

 async function playGeneratedAudio(blob:Blob){
   const context=ensureAudioContext();
   if(context){
     const bytes=await blob.arrayBuffer();
     const buffer=await context.decodeAudioData(bytes.slice(0));
     stopGeneratedAudio();
     const source=context.createBufferSource();
     source.buffer=buffer; source.connect(context.destination); source.start();
     sourceRef.current=source;
     source.onended=()=>{if(sourceRef.current===source)sourceRef.current=null;};
     return;
   }
   const url=URL.createObjectURL(blob);
   if(audioRef.current){
     audioRef.current.src=url; audioRef.current.controls=true;
     await audioRef.current.play().catch(()=>{throw new Error('The browser blocked audio playback. Press the audio player play button.');});
   }
 }

 async function speak(text:string){
   if(!text)return;
   setError(''); setLoadingAudio(true);
   try{
     const response=await fetch('/api/ai/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,languageCode:code,pace:.92})});
     if(!response.ok){
       const payload=await response.json().catch(()=>({}));
       throw new Error(payload.error||`TTS request failed (${response.status})`);
     }
     const type=response.headers.get('content-type')||'';
     if(type.includes('audio/')){
       await playGeneratedAudio(await response.blob());
       return;
     }
     const data=await response.json();
     if(data.provider==='browser' && typeof window!=='undefined' && 'speechSynthesis' in window){
       const voices=window.speechSynthesis.getVoices();
       const exact=voices.find(v=>v.lang.toLowerCase()===profile.locale.toLowerCase());
       const languageOnly=voices.find(v=>v.lang.toLowerCase().startsWith(profile.locale.slice(0,2).toLowerCase()));
       if(!exact&&!languageOnly){
         throw new Error(`No ${language} voice is installed in this browser. Configure OPENAI_API_KEY or VEXYL_TTS_URL for reliable ${language} audio.`);
       }
       window.speechSynthesis.cancel();
       const utterance=new SpeechSynthesisUtterance(text); utterance.lang=(exact||languageOnly)!.lang; utterance.voice=exact||languageOnly||null; utterance.rate=.9;
       window.speechSynthesis.speak(utterance);
     }else throw new Error(data.reason||'No speech provider configured');
   }catch(e){setError(e instanceof Error?e.message:'Audio could not be generated.');}
   finally{setLoadingAudio(false);}
 }

 function togglePlaying(){
   if(!playing)ensureAudioContext();
   else stopGeneratedAudio();
   setPlaying(v=>!v);
 }

 useEffect(()=>{if(!playing||!current)return; speak(current.text); const timer=window.setTimeout(()=>setScene(s=>s+1<scenes.length?s+1:0),current.seconds*1000); return()=>{window.clearTimeout(timer);stopGeneratedAudio();};},[playing,scene]);
 useEffect(()=>()=>{stopGeneratedAudio();audioContextRef.current?.close().catch(()=>{});},[]);

 return <section className="micro-video" aria-label={`${language} micro video lesson`}>
   <audio ref={audioRef} onError={()=>setError(`The ${language} audio file could not be played.`)} />
   <div className="micro-video-stage">
     <div className="micro-video-sky" />
     <div className="micro-video-ground" />
     <div className="cartoon-character left"><span>●</span><b>{current?.speaker||'Tutor'}</b></div>
     <div className="cartoon-character right"><span>●</span><b>Lingua</b></div>
     <div className="speech-bubble">{current?.text}</div>
     <div className="micro-caption"><small>{current?.translation}</small><strong>{current?.text}</strong></div>
     <div className="micro-video-badge">🎬 {language} · 1–2 MIN MICRO-LESSON</div>
   </div>
   <div className="micro-video-controls">
     <button className="primary" onClick={togglePlaying}>{playing?'⏸ Pause':'▶ Play lesson'}</button>
     <button className="audio-btn" disabled={loadingAudio} onClick={()=>{ensureAudioContext();void speak(current?.text||'')}}>{loadingAudio?'Generating…':'🔊 Hear line'}</button>
     <button className="audio-btn" onClick={()=>setScene(s=>s+1<scenes.length?s+1:0)}>Next scene →</button>
     <span>{scene+1}/{scenes.length}</span>
   </div>
   {error&&<div className="feedback error">{error}</div>}
   <div className="micro-progress"><i style={{width:`${((scene+1)/Math.max(scenes.length,1))*100}%`}}/></div>
 </section>;
}
