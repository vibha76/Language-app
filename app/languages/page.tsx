'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import AppShell from '../../src/components/AppShell';
import {languageCatalog} from '../../src/learning/languageCatalog';

export default function Languages(){
 const [filter,setFilter]=useState('All');
 const list=useMemo(()=>filter==='All'?languageCatalog:languageCatalog.filter(l=>filter==='Indian'?l.region==='India':filter==='European'?l.region==='Europe':filter==='Asian'?l.region==='Asia':filter==='Easy'?l.difficulty==='Easy':filter==='Advanced'?l.difficulty==='Advanced':true),[filter]);
 return <AppShell><div className="page-title"><span className="kicker">LANGUAGE EXPLORER</span><h1>Choose your next world.</h1><p>32 launch languages share one curriculum engine: native script, language-specific speech, eight levels and adaptive micro-lessons.</p></div><div className="filters">{['All','Indian','European','Asian','Easy','Advanced'].map(f=><button className={filter===f?'chosen':''} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div><div className="explorer-grid">{list.map((l,i)=><Link className="explorer-card" href={`/lesson/${l.code}-level-1`} key={l.code}><div className={`language-glyph ${['sage','amber','rose','blue','violet','sun'][i%6]}`}>{l.native.slice(0,2)}</div><div className="explorer-main"><span>{l.region} · {l.script}</span><h2>{l.name}</h2><b>{l.native}</b><p>{l.difficulty} · {l.locale} · 8 levels</p><div className="mini-progress"><i style={{width:'4%'}}/></div><small>Ready to begin · Pre-A1 → C2</small></div><span className="card-arrow">→</span></Link>)}</div></AppShell>}
