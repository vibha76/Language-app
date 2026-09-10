import {NextRequest,NextResponse} from 'next/server';
import {getLevel} from '../../../../src/learning/curriculum';

export async function POST(req:NextRequest){
  try{
    const {language,native,code,level=1,topic='everyday conversation'}=await req.json();
    if(!language||!code)return NextResponse.json({error:'language and code are required'},{status:400});
    const definition=getLevel(Number(level));
    if(!process.env.OPENAI_API_KEY)return NextResponse.json({provider:'seed',level:definition});
    const system=`You are the curriculum engine for LinguaVerse. Create accurate language-learning content. Never substitute Hindi for Sanskrit or another Indian language. Preserve the target language's native script. Return only valid JSON with keys title,subtitle,vocabulary,dialogue,exercises. vocabulary must be 4 arrays [target,romanization,meaning]. dialogue must be 4 arrays [speaker,target,translation]. exercises must be 3 objects with type,prompt,answer,options. Target language: ${language} (${native}), BCP47 code ${code}. Level: ${definition.name} (${definition.cefr}). Focus: ${definition.focus}. Lesson length: 1–2 minutes. Topic: ${topic}. Include culturally natural, pedagogically correct sentences. For Sanskrit, use Sanskrit grammar and vocabulary rather than Hindi.`;
    const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:process.env.OPENAI_LESSON_MODEL||'gpt-5.6-luna',messages:[{role:'system',content:system},{role:'user',content:`Create the lesson for ${language} level ${definition.id}.` }],temperature:.3,response_format:{type:'json_object'}})});
    if(!response.ok)return NextResponse.json({error:`Lesson generation failed (${response.status})`},{status:502});
    const data=await response.json();
    const content=data?.choices?.[0]?.message?.content;
    if(!content)return NextResponse.json({error:'Lesson generator returned no content'},{status:502});
    return NextResponse.json({provider:'openai',level:definition,...JSON.parse(content)});
  }catch(error){console.error(error);return NextResponse.json({error:'Lesson generation failed'},{status:500});}
}
