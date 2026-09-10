import {NextRequest,NextResponse} from 'next/server';
import {getSpeechProfile,scorePronunciation} from '../../../../src/learning/speech';

export const runtime='nodejs';

export async function POST(req:NextRequest){
  try{
    const form=await req.formData();
    const file=form.get('file');
    const languageCode=String(form.get('languageCode')||'en');
    const target=String(form.get('target')||'');
    if(!(file instanceof File))return NextResponse.json({error:'Audio file is required'},{status:400});
    const profile=getSpeechProfile(languageCode);
    let transcript=''; let provider='browser';
    const sarvamLanguages=['kn','sa','hi','ta','te'];
    if(process.env.SARVAM_API_KEY && sarvamLanguages.includes(languageCode)){
      const body=new FormData(); body.append('file',file,file.name||'recording.webm'); body.append('model','saaras:v3'); body.append('language_code',profile.sttLanguage); body.append('mode','transcribe');
      const response=await fetch('https://api.sarvam.ai/speech-to-text',{method:'POST',headers:{'api-subscription-key':process.env.SARVAM_API_KEY},body});
      if(!response.ok)return NextResponse.json({error:`Sarvam STT failed (${response.status})`},{status:502});
      const data=await response.json(); transcript=String(data.transcript||''); provider='sarvam';
    }else if(process.env.OPENAI_API_KEY){
      const body=new FormData(); body.append('file',file,file.name||'recording.webm'); body.append('model',process.env.OPENAI_STT_MODEL||'gpt-4o-transcribe'); body.append('language',profile.sttLanguage.split('-')[0]); body.append('response_format','json');
      const response=await fetch('https://api.openai.com/v1/audio/transcriptions',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body});
      if(!response.ok)return NextResponse.json({error:`OpenAI STT failed (${response.status})`},{status:502});
      const data=await response.json(); transcript=String(data.text||''); provider='openai';
    }
    const scoring=target?scorePronunciation(target,transcript):null;
    return NextResponse.json({provider,language:profile.locale,transcript,scoring});
  }catch(error){console.error(error);return NextResponse.json({error:'Speech transcription failed'},{status:500});}
}
