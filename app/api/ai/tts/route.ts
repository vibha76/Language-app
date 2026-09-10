import {NextRequest,NextResponse} from 'next/server';
import {getSpeechProfile} from '../../../../src/learning/speech';

function jsonError(message:string,status=400){return NextResponse.json({error:message},{status});}

export async function POST(req:NextRequest){
  try{
    const {text,languageCode,pace=1}=await req.json();
    if(!text||!languageCode)return jsonError('text and languageCode are required');
    const profile=getSpeechProfile(languageCode);

    // Indian production path. Sarvam currently exposes Bulbul v3 for 10 Indian languages + English;
    // Sanskrit is intentionally routed elsewhere because it is not in that TTS language list.
    if(profile.ttsProvider==='sarvam' && process.env.SARVAM_API_KEY){
      const response=await fetch('https://api.sarvam.ai/text-to-speech',{
        method:'POST',headers:{'Content-Type':'application/json','api-subscription-key':process.env.SARVAM_API_KEY},
        body:JSON.stringify({text,model:'bulbul:v3',language_code:profile.locale,speaker:profile.ttsVoice||'shubh',pace:Number(pace)||1,output_audio_codec:'mp3'})
      });
      if(!response.ok)return jsonError(`Sarvam TTS failed (${response.status})`,502);
      const data=await response.json();
      const base64=data?.audios?.[0];
      if(!base64)return jsonError('Sarvam returned no audio',502);
      return NextResponse.json({provider:'sarvam',mimeType:'audio/wav',base64,language:profile.locale});
    }

    if(process.env.OPENAI_API_KEY){
      const instructions=`Speak the following text naturally in ${profile.locale}. This is a language-learning app. Preserve the exact words and script. Do not translate. ${profile.pronunciationNotes.join(' ')}`;
      const response=await fetch('https://api.openai.com/v1/audio/speech',{
        method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
        body:JSON.stringify({model:process.env.OPENAI_TTS_MODEL||'gpt-4o-mini-tts',voice:profile.ttsVoice||'marin',input:text,instructions,response_format:'mp3',speed:Math.min(1.5,Math.max(.5,Number(pace)||1))})
      });
      if(!response.ok)return jsonError(`OpenAI TTS failed (${response.status})`,502);
      const buffer=Buffer.from(await response.arrayBuffer());
      return new NextResponse(buffer,{headers:{'Content-Type':'audio/mpeg','Cache-Control':'public,max-age=3600'}});
    }

    return NextResponse.json({provider:'browser',language:profile.locale,reason:'No server TTS key configured. The client may use SpeechSynthesis as a fallback.'});
  }catch(error){
    console.error(error);
    return jsonError('TTS service failed',500);
  }
}
