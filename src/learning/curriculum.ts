export type LevelDefinition={id:number;name:string;cefr:string;minutes:number;focus:string;outcome:string};

export const levels:LevelDefinition[]=[
 {id:1,name:'Discovery',cefr:'Pre-A1',minutes:90,focus:'sounds, greetings and survival phrases',outcome:'Say and understand your first useful sentences.'},
 {id:2,name:'Beginner',cefr:'A1',minutes:100,focus:'introductions, daily needs and core sentence patterns',outcome:'Handle simple everyday exchanges.'},
 {id:3,name:'Elementary',cefr:'A2',minutes:105,focus:'routine, places, preferences and past/future basics',outcome:'Talk about familiar situations with connected sentences.'},
 {id:4,name:'Intermediate',cefr:'B1',minutes:110,focus:'stories, opinions, reasons and real-world problem solving',outcome:'Hold practical conversations without translating every word.'},
 {id:5,name:'Upper Intermediate',cefr:'B2',minutes:115,focus:'nuance, argument, idioms and longer conversations',outcome:'Express opinions naturally and understand varied speech.'},
 {id:6,name:'Advanced',cefr:'C1',minutes:120,focus:'register, abstraction, professional communication and style',outcome:'Communicate precisely across social and professional settings.'},
 {id:7,name:'Professional',cefr:'C1/C2',minutes:120,focus:'meetings, presentations, negotiation and domain vocabulary',outcome:'Operate confidently in professional contexts.'},
 {id:8,name:'Mastery',cefr:'C2',minutes:120,focus:'subtle meaning, rhetoric, culture and near-native fluency',outcome:'Interpret and produce sophisticated language with control.'},
];

export function getLevel(id:number){return levels.find(x=>x.id===id)||levels[0];}
