'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {getSpeechProfile} from '../learning/speech';

type Props={code:string;language:string;dialogue:string[][];durationSeconds?:number};

export default function MicroVideoLesson({code,language,dialogue,durationSeconds=90}:Props){
 const profile=getSpeechProfile(code);
 const [scene,setScene]=useState(0); const [playing,setPlaying]=useState(false); const [loadingAudio,setLoadingAudio]=useState(false); const [error,setError]=useState('');
 const audioRef=useRef<HTMLAudioElement>(null);
 const scenes=useMemo(()=>dialogue.map((line,i)=>({speaker:line[0],text:line[1],translation:line[2]||'',seconds:Math.max(8,Math.floor(durationSeconds/Math.max(dialogue.length,1)))})),[dialogue,durationSeconds]);
 const current=scenes[scene];

 async function speak(text:string){
   if(!text)return;
   setError(''); setLoadingAudio(true);
   try{
     const response=await fetch('/api/ai/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,languageCode:code,pace:.92})});
     const type=response.headers.get('content-type')||'';
     if(type.includes('audio/')){
       const blob=await response.blob();
       const url=URL.createObjectURL(blob);
       if(audioRef.current){audioRef.current.src=url; await audioRef.current.play();}
       return;
     }
     const data=await response.json();
     if(data.provider==='browser' && typeof window!=='undefined' && 'speechSynthesis' in window){
       window.speechSynthesis.cancel();
       const utterance=new SpeechSynthesisUtterance(text); utterance.lang=profile.locale; utterance.rate=.9;
       window.speechSynthesis.speak(utterance);
     }else throw new Error(data.reason||'No speech provider configured');
   }catch(e){setError(e instanceof Error?e.message:'Audio could not be generated.');}
   finally{setLoadingAudio(false);}
 }

 useEffect(()=>{if(!playing||!current)return; speak(current.text); const timer=window.setTimeout(()=>setScene(s=>s+1<scenes.length?s+1:0),current.seconds*1000); return()=>window.clearTimeout(timer);},[playing,scene]);

 return <section className="micro-video" aria-label={`${language} micro video lesson`}>
   <audio ref={audioRef} onEnded={()=>{}} />
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
     <button className="primary" onClick={()=>setPlaying(v=>!v)}>{playing?'⏸ Pause':'▶ Play lesson'}</button>
     <button className="audio-btn" disabled={loadingAudio} onClick={()=>speak(current?.text||'')}>{loadingAudio?'Generating…':'🔊 Hear line'}</button>
     <button className="audio-btn" onClick={()=>setScene(s=>s+1<scenes.length?s+1:0)}>Next scene →</button>
     <span>{scene+1}/{scenes.length}</span>
   </div>
   {error&&<div className="feedback error">{error}</div>}
   <div className="micro-progress"><i style={{width:`${((scene+1)/Math.max(scenes.length,1))*100}%`}}/></div>
 </section>;
}
