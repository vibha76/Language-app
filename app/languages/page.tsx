'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import AppShell from '../../src/components/AppShell';
import {languages} from '../../src/data';

export default function Languages(){
 const [filter,setFilter]=useState('All');
 const list=useMemo(()=>filter==='All'?languages:languages.filter(l=>filter==='Indian'?l.region==='India':filter==='European'?l.region==='Europe':filter==='Asian'?l.region==='Asia':filter==='Easy'?l.difficulty==='Easy':filter==='Advanced'?l.difficulty==='Advanced':true),[filter]);
 return <AppShell><div className="page-title"><span className="kicker">LANGUAGE EXPLORER</span><h1>Choose your next world.</h1><p>Every language opens its own script, sounds, vocabulary, stories and progression path.</p></div><div className="filters">{['All','Indian','European','Asian','Easy','Advanced'].map(f=><button className={filter===f?'chosen':''} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div><div className="explorer-grid">{list.map(l=><Link className="explorer-card" href={`/lesson/${l.code}-greetings-01`} key={l.code}><div className={`language-glyph ${l.tone}`}>{l.glyph}</div><div className="explorer-main"><span>{l.region} · {l.framework}</span><h2>{l.name}</h2><b>{l.native}</b><p>{l.script} script · {l.difficulty} · {l.learners} learners</p><div className="mini-progress"><i style={{width:`${Math.max(l.progress,4)}%`}}/></div><small>{l.progress?`${l.progress}% complete`:'Ready to begin'} · {l.level}</small></div><span className="card-arrow">→</span></Link>)}</div></AppShell>}
