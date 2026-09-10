'use client';
import Link from 'next/link';
import {useState} from 'react';
import AppShell from '../../src/components/AppShell';
import {languageCatalog} from '../../src/learning/languageCatalog';
import {levels} from '../../src/learning/curriculum';

export default function Learn(){
 const [code,setCode]=useState('kn');
 const language=languageCatalog.find(l=>l.code===code)||languageCatalog[0];
 return <AppShell><div className="page-title"><span className="kicker">THE ADVENTURE MAP</span><h1>Your language world</h1><p>Choose a language, then unlock eight progression levels. Every level can generate its own 1–2 minute micro-lesson, practice set and speaking checkpoint.</p></div><div className="practice-language-picker"><span>Learning language</span><select value={code} onChange={e=>setCode(e.target.value)}>{languageCatalog.map(l=><option value={l.code} key={l.code}>{l.name} · {l.native}</option>)}</select></div><div className="map-card">{levels.map((l,i)=><div className={`map-level ${i===0?'current':'locked'}`} key={l.id}><div className="map-number">{i+1}</div><div className="map-art">{['🌱','🔤','🗣️','🧩','🏘️','🎭','💼','🏆'][i]}</div><div className="map-copy"><span>{l.cefr} · LEVEL {l.id}</span><h2>{l.name}</h2><p>{l.focus}. <b>Outcome:</b> {l.outcome}</p><Link className="primary" href={`/lesson/${code}-level-${l.id}`}>Open {language.name} level →</Link></div></div>)}</div></AppShell>;
}
