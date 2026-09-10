import {NextRequest,NextResponse} from 'next/server';
import {getSpeechProfile} from '../../../../src/learning/speech';

function jsonError(message:string,status=400){return NextResponse.json({error:message},{status});}

export async function POST(req:NextRequest){
  try{
    const {text,languageCode,pace=1}=await req.json();
    if(!text||!languageCode)return jsonError('text and languageCode are required');
    const profile=getSpeechProfile(languageCode);

    if(profile.ttsProvider==='vexyl' && process.env.VEXYL_TTS_URL){
      const base=process.env.VEXYL_TTS_URL.replace(/\/$/,'');
      const headers:{[key:string]:string}={'Content-Type':'application/json'};
      if(process.env.VEXYL_TTS_API_KEY)headers['X-API-Key']=process.env.VEXYL_TTS_API_KEY;
      const submit=await fetch(`${base}/batch/synthesize`,{method:'POST',headers,body:JSON.stringify({text,lang:profile.locale,style:'default'})});
      if(!submit.ok)return jsonError(`VEXYL TTS failed (${submit.status})`,502);
      const job=await submit.json();
      for(let i=0;i<30;i++){
        await new Promise(r=>setTimeout(r,500));
        const status=await fetch(`${base}/batch/status/${job.job_id}`,{headers:{...(process.env.VEXYL_TTS_API_KEY?{'X-API-Key':process.env.VEXYL_TTS_API_KEY}:{})}});
        if(!status.ok)continue;
        const data=await status.json();
        if(data.status==='completed'&&data.audio_b64){
          const audio=Buffer.from(data.audio_b64,'base64');
          return new NextResponse(audio,{headers:{'Content-Type':'audio/wav','Cache-Control':'public,max-age=3600'}});
        }
        if(data.status==='failed')return jsonError('VEXYL TTS job failed',502);
      }
      return jsonError('VEXYL TTS timed out while generating Sanskrit audio',504);
    }

    // Sarvam Bulbul v3 for supported Indian languages.
    if(profile.ttsProvider==='sarvam' && process.env.SARVAM_API_KEY){
      const response=await fetch('https://api.sarvam.ai/text-to-speech',{
        method:'POST',headers:{'Content-Type':'application/json','api-subscription-key':process.env.SARVAM_API_KEY},
        body:JSON.stringify({text,model:'bulbul:v3',language_code:profile.locale,speaker:profile.ttsVoice||'shubh',pace:Number(pace)||1,output_audio_codec:'wav'})
      });
      if(!response.ok)return jsonError(`Sarvam TTS failed (${response.status})`,502);
      const data=await response.json();
      const base64=data?.audios?.[0];
      if(!base64)return jsonError('Sarvam returned no audio',502);
      const audio=Buffer.from(base64,'base64');
      return new NextResponse(audio,{headers:{'Content-Type':'audio/wav','Cache-Control':'public,max-age=3600'}});
    }

    // Global TTS path. The instruction explicitly names the target language so Sanskrit is never silently treated as Hindi.
    if(process.env.OPENAI_API_KEY){
      const instructions=`Speak only in ${profile.locale}. This is a language-learning app. Preserve the exact target-language words and script; never translate them. ${profile.pronunciationNotes.join(' ')}`;
      const response=await fetch('https://api.openai.com/v1/audio/speech',{
        method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
        body:JSON.stringify({model:process.env.OPENAI_TTS_MODEL||'gpt-4o-mini-tts',voice:profile.ttsVoice||'marin',input:text,instructions,response_format:'mp3',speed:Math.min(1.5,Math.max(.5,Number(pace)||1))})
      });
      if(!response.ok)return jsonError(`OpenAI TTS failed (${response.status})`,502);
      const buffer=Buffer.from(await response.arrayBuffer());
      return new NextResponse(buffer,{headers:{'Content-Type':'audio/mpeg','Cache-Control':'public,max-age=3600'}});
    }

    return NextResponse.json({provider:'browser',language:profile.locale,reason:`No server TTS provider is configured for ${profile.locale}. Configure OPENAI_API_KEY, SARVAM_API_KEY, or VEXYL_TTS_URL.`});
  }catch(error){console.error(error);return jsonError('TTS service failed',500);}
}
