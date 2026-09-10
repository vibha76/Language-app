'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronRight, Flame, Globe2, Headphones, Lock, Mic, Play, Sparkles, Star, Trophy, Volume2, PenLine } from 'lucide-react';

const languages = [
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'India', level: 'Beginner', progress: 28, glyph: 'ಕ', tone: 'sage' },
  { id: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', region: 'Classical', level: 'Beginner', progress: 12, glyph: 'सं', tone: 'amber' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'India', level: 'Beginner', progress: 64, glyph: 'ह', tone: 'rose' },
  { id: 'fr', name: 'French', native: 'Français', region: 'Europe', level: 'A1', progress: 0, glyph: 'Fr', tone: 'blue' },
  { id: 'it', name: 'Italian', native: 'Italiano', region: 'Europe', level: 'A1', progress: 0, glyph: 'It', tone: 'violet' },
  { id: 'ja', name: 'Japanese', native: '日本語', region: 'Asia', level: 'A1', progress: 0, glyph: '日', tone: 'sun' },
];

const journey = [
  { title: 'First Words', detail: 'Greetings & essentials', icon: '🌱', state: 'done' },
  { title: 'Sounds & Script', detail: 'Read your first characters', icon: '🔤', state: 'current' },
  { title: 'First Conversations', detail: 'Introduce yourself', icon: '🗣️', state: 'locked' },
  { title: 'Sentence Builder', detail: 'Make useful sentences', icon: '🧩', state: 'locked' },
  { title: 'Everyday Life', detail: 'Home, food & travel', icon: '🏘️', state: 'locked' },
  { title: 'Story Street', detail: 'Learn inside a story', icon: '🎭', state: 'locked' },
];

export default function Home() {
  const [selected, setSelected] = useState('kn');
  const [lessonStarted, setLessonStarted] = useState(false);
  const [practice, setPractice] = useState<string | null>(null);
  const [questDone, setQuestDone] = useState(false);
  const language = useMemo(() => languages.find(l => l.id === selected) ?? languages[0], [selected]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">L</div><span>Lingua<span>Verse</span></span></div>
        <div className="profile-mini"><div className="avatar">V</div><div><strong>Vibha</strong><small>Explorer · 1,240 XP</small></div></div>
        <nav>
          {['Home','Learn','Practice','Conversation','Vocabulary','Grammar','Tests','Progress'].map((item, i) => <a className={i === 0 ? 'active' : ''} key={item} href="#"><span>{['⌂','◈','◉','◌','◇','∿','✓','◒'][i]}</span>{item}</a>)}
        </nav>
        <div className="sidebar-bottom"><a href="#">🏆 Certificates</a><a href="#">⚙ Settings</a></div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="crumb">My journey <ChevronRight size={15}/> {language.name}</div><div className="top-actions"><div className="streak"><Flame size={17}/> 7</div><button className="icon-btn"><Globe2 size={18}/></button><div className="avatar small">V</div></div></header>

        <div className="hero">
          <div><div className="eyebrow"><Sparkles size={15}/> YOUR NEXT ADVENTURE</div><h1>Ready for a little <em>Kannada?</em></h1><p>12 minutes today can unlock your next scene. Your tutor already picked the best route for you.</p><button className="primary" onClick={() => setLessonStarted(true)}>{lessonStarted ? 'Lesson in progress' : 'Continue learning'} <ArrowRight size={18}/></button></div>
          <div className="hero-orbit"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-character">🦊</div><div className="speech">ನಮಸ್ಕಾರ!<br/><small>Let’s learn.</small></div></div>
        </div>

        <div className="section-head"><div><span className="kicker">YOUR WORLD</span><h2>Language journey</h2></div><button className="text-btn">View map <ArrowRight size={15}/></button></div>
        <div className="journey-card">
          {journey.map((node, i) => <div className={`journey-node ${node.state}`} key={node.title}><div className="node-icon">{node.state === 'locked' ? <Lock size={17}/> : node.state === 'done' ? <Check size={18}/> : node.icon}</div><div className="node-copy"><strong>{node.title}</strong><small>{node.detail}</small></div>{i < journey.length - 1 && <div className="connector"/>}</div>)}
        </div>

        <div className="grid-two">
          <section className="panel quest"><div className="panel-title"><div><span className="kicker">12 MINUTES</span><h3>Today&apos;s quest</h3></div><div className="quest-badge"><Trophy size={15}/> +100 XP</div></div><p className="muted">Small, focused practice. Big compounding gains.</p>
            {[['🎧','Listen to 3 lines', '3 min'],['🗣️','Speak 5 sentences','4 min'],['📚','Review 10 words','3 min'],['✍️','Build 2 sentences','2 min']].map(([icon,label,time], i) => <button className={`quest-row ${i === 0 && !questDone ? 'suggested' : ''}`} key={label} onClick={() => setQuestDone(true)}><span className="quest-icon">{questDone || i < 1 ? <Check size={17}/> : icon}</span><span><strong>{label}</strong><small>{time}</small></span><ChevronRight size={16}/></button>)}
          </section>

          <section className="panel ai-card"><div className="ai-glow"/><div className="tutor-avatar">✨</div><span className="kicker">YOUR AI TUTOR</span><h3>Skip what you already know.</h3><p>"You&apos;re strong at recognition. Let&apos;s spend today&apos;s energy on speaking and sentence building."</p><button className="secondary" onClick={() => setPractice('conversation')}>Practice with me <Mic size={16}/></button></section>
        </div>

        <div className="section-head language-head"><div><span className="kicker">EXPLORE</span><h2>Your languages</h2></div><button className="text-btn">Explore all <ArrowRight size={15}/></button></div>
        <div className="language-grid">{languages.map(l => <button className={`language-card ${selected === l.id ? 'selected' : ''}`} key={l.id} onClick={() => setSelected(l.id)}><div className={`language-glyph ${l.tone}`}>{l.glyph}</div><div className="language-copy"><strong>{l.name}</strong><span>{l.native}</span><small>{l.region} · {l.level}</small></div>{l.progress > 0 ? <div className="progress-ring"><b>{l.progress}%</b></div> : <div className="new-pill">Start</div>}</button>)}</div>

        <div className="section-head"><div><span className="kicker">PICK UP WHERE YOU LEFT OFF</span><h2>Practice studio</h2></div></div>
        <div className="practice-grid">{[['🎤','Speaking','Pronunciation','87%','speaking'],['🎧','Listening','Everyday phrases','91%','listening'],['✍️','Writing','Sentence builder','68%','writing'],['🧠','Vocabulary','Words due today','8','vocab']].map(([icon,title,sub,score,key]) => <button className="practice-card" key={title} onClick={() => setPractice(key)}><div className="practice-icon">{icon}</div><div><span>{title}</span><strong>{sub}</strong></div><b>{score}</b><ArrowRight size={16}/></button>)}</div>

        <footer>Built as a content-driven learning system · <span>{language.name} selected</span> · AI services are adapter-ready</footer>
      </section>

      {practice && <div className="modal-backdrop" onClick={() => setPractice(null)}><div className="practice-modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setPractice(null)}>×</button><span className="kicker">PRACTICE STUDIO</span><h2>{practice === 'speaking' ? 'Say it naturally.' : practice === 'writing' ? 'Build the sentence.' : practice === 'conversation' ? 'Talk with your tutor.' : practice === 'listening' ? 'Listen for meaning.' : 'Strengthen recall.'}</h2><div className="practice-prompt">{practice === 'speaking' || practice === 'conversation' ? 'ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಿ?' : practice === 'writing' ? 'Translate: “I am fine.”' : practice === 'listening' ? '🔊  ಚೆನ್ನಾಗಿದ್ದೇನೆ' : 'ಧನ್ಯವಾದಗಳು'}</div><button className="primary wide"><Play size={17}/> Start {practice} practice</button></div></div>}
    </main>
  );
}
