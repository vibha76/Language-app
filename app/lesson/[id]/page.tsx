'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import AppShell from '../../../src/components/AppShell';
import MicroVideoLesson from '../../../src/components/MicroVideoLesson';
import {getLesson} from '../../../src/data';
import {getSpeechProfile} from '../../../src/learning/speech';

export default function LessonPage({params}:{params:Promise<{id:string}>}){
 const [id,setId]=useState('');
 useEffect(()=>{params.then(p=>setId(p.id));},[params]);
 if(!id)return <AppShell><div className="loading-state">Loading lesson…</div></AppShell>;
 return <LessonContent id={id}/>;
}

function LessonContent({id}:{id:string}){
 const code=id.split('-')[0];
 const lesson=getLesson(code);
 const profile=getSpeechProfile(code);
 const [step,setStep]=useState(0); const [answer,setAnswer]=useState(''); const [done,setDone]=useState(false);
 const [recording,setRecording]=useState(false); const [transcript,setTranscript]=useState(''); const [score,setScore]=useState<number|null>(null); const [feedback,setFeedback]=useState<{word:string;status:string;spoken:string}[]>([]); const [speechError,setSpeechError]=useState('');
 const mediaRef=useRef<MediaRecorder|null>(null); const chunksRef=useRef<Blob[]>([]);
 const ex=lesson.exercises[Math.min(Math.max(step-lesson.vocabulary.length-1,0),lesson.exercises.length-1)];
 const total=lesson.vocabulary.length+lesson.exercises.length+2;
 const currentWord=lesson.vocabulary[Math.max(0,step-1)];

 async function startRecording(){
   setSpeechError(''); setTranscript(''); setScore(null); setFeedback([]);
   try{
     const stream=await navigator.mediaDevices.getUserMedia({audio:true});
     const recorder=new MediaRecorder(stream,{mimeType:'audio/webm'});
     chunksRef.current=[]; mediaRef.current=recorder;
     recorder.ondataavailable=e=>{if(e.data.size)chunksRef.current.push(e.data)};
     recorder.onstop=async()=>{
       stream.getTracks().forEach(t=>t.stop());
       const blob=new Blob(chunksRef.current,{type:'audio/webm'});
       const form=new FormData(); form.append('file',blob,'lesson-speaking.webm'); form.append('languageCode',code); form.append('target',currentWord?.[0]||lesson.dialogue[0]?.[1]||'');
       try{
         const response=await fetch('/api/ai/transcribe',{method:'POST',body:form});
         const data=await response.json();
         if(!response.ok)throw new Error(data.error||'Speech recognition failed');
         setTranscript(data.transcript||''); setScore(data.scoring?.score??null); setFeedback(data.scoring?.feedback||[]);
       }catch(e){setSpeechError(e instanceof Error?e.message:'Speech recognition failed.');}
     };
     recorder.start(); setRecording(true);
   }catch(e){setSpeechError(e instanceof Error?e.message:'Microphone permission is required.');}
 }
 function stopRecording(){mediaRef.current?.stop();setRecording(false);}

 return <AppShell><div className="lesson-head"><div><span className="kicker">{lesson.language.toUpperCase()} · LEVEL 1</span><h1>{lesson.title}</h1><p>{lesson.subtitle}</p></div><div className="lesson-meta">⏱ {lesson.duration} · ⭐ +{lesson.xp} XP</div></div>
 <div className="lesson-layout"><div className="lesson-main">
   <MicroVideoLesson code={code} language={lesson.language} dialogue={lesson.dialogue} durationSeconds={90}/>
   {step===0?<section className="discover"><span className="kicker">MICRO-VIDEO → LISTEN → SPEAK</span><h2>Learn a useful sentence in under two minutes.</h2><p>Watch the animated scene, hear the native-language line, then record yourself. The lesson stays tied to <b>{lesson.language}</b> all the way through.</p><div className="button-row"><button className="primary" onClick={()=>setStep(1)}>Start the lesson →</button><button className="audio-btn" onClick={()=>window.speechSynthesis?.speak(Object.assign(new SpeechSynthesisUtterance(lesson.dialogue[0]?.[1]||''),{lang:profile.locale,rate:.9}))}>🔊 Quick browser pronunciation</button></div></section>
   :step<=lesson.vocabulary.length?<section className="exercise-card"><div className="exercise-top"><span className="kicker">WORD {step} OF {lesson.vocabulary.length}</span><span>{Math.round((step/(total-1))*100)}%</span></div><h2>Meet this word</h2><div className="word-big">{currentWord?.[0]}</div><div className="word-details"><b>{currentWord?.[1]}</b><span>{currentWord?.[2]}</span></div><div className="button-row"><button className="audio-btn" onClick={async()=>{await fetch('/api/ai/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:currentWord?.[0],languageCode:code,pace:.9})}).then(async r=>{const type=r.headers.get('content-type')||'';if(type.includes('audio/')){const a=new Audio(URL.createObjectURL(await r.blob()));await a.play()}else if(profile.locale&&'speechSynthesis' in window){const u=new SpeechSynthesisUtterance(currentWord?.[0]);u.lang=profile.locale;u.rate=.9;window.speechSynthesis.speak(u)}})}>🔊 Hear {lesson.language}</button><button className={recording?'audio-btn recording':'primary'} onClick={recording?stopRecording:startRecording}>{recording?'⏹ Stop & evaluate':'🎤 Say it yourself'}</button></div>{transcript&&<div className="speech-result"><div><b>Your transcript</b><p>{transcript}</p></div><div className="speech-score"><strong>{score}%</strong><span>accuracy</span></div></div>}{feedback.length>0&&<div className="word-feedback">{feedback.map(x=><span className={x.status} key={`${x.word}-${x.spoken}`}>{x.word}{x.status==='correct'?' ✓':x.status==='missing'?' ✕':' → '+x.spoken}</span>)}</div>}{speechError&&<div className="feedback error">{speechError}</div>}<button className="primary wide" onClick={()=>{setStep(step+1);setTranscript('');setScore(null);setFeedback([])}}>I’ve got it →</button></section>
   :!done?<section className="exercise-card"><div className="exercise-top"><span className="kicker">PRACTICE · {step-lesson.vocabulary.length} OF {lesson.exercises.length}</span><span>{Math.round((step/(total-1))*100)}%</span></div><h2>{ex.prompt}</h2><button className="audio-btn" onClick={()=>{const u=new SpeechSynthesisUtterance(lesson.dialogue[Math.min(step,lesson.dialogue.length-1)]?.[1]||lesson.vocabulary[0][0]);u.lang=profile.locale;u.rate=.88;window.speechSynthesis?.speak(u)}}>🎧 Listen</button><div className="option-grid">{ex.options.map(o=><button className={answer===o?'chosen':''} onClick={()=>setAnswer(o)} key={o}>{o}</button>)}</div>{answer&&<div className={`feedback ${answer===ex.answer?'':'error'}`}>{answer===ex.answer?'✓ Correct.':'Not quite — listen again and retry.'}</div>}<button className="primary wide" disabled={!answer} onClick={()=>{if(answer===ex.answer){if(step>=total-1)setDone(true);else{setStep(step+1);setAnswer('')}}}}>{step===total-1?'Finish':'Check answer'} →</button></section>:<div className="complete"><div>🏆</div><span className="kicker">LESSON COMPLETE</span><h2>{lesson.language} conversation unlocked.</h2><p>You earned <b>+{lesson.xp} XP</b> and completed listening, vocabulary and speaking practice.</p><Link className="primary" href="/learn">Continue journey →</Link></div>}
 </div><aside className="lesson-side"><span className="kicker">TODAY’S SKILLS</span>{[['🎧','Listening'],['🗣️','Speaking'],['📚','Vocabulary'],['🧩','Grammar'],['✍️','Writing']].map(x=><div className="skill-row" key={x[1]}><span>{x[0]}</span><b>{x[1]}</b><small>+{x[1]==='Vocabulary'?'12':'8'}%</small></div>)}<div className="tip"><b>Pronunciation coach</b><p>{profile.pronunciationNotes[0]||'Listen first, then speak at a comfortable pace.'}</p></div></aside></div></AppShell>;
}
