import {NextResponse} from 'next/server'; import {mockWriting} from '../../../../src/ai/contracts';
export async function POST(req:Request){const body=await req.json(); const result=await mockWriting.evaluate(String(body.input??''),String(body.target??''),String(body.languageCode??'kn')); return NextResponse.json({provider:'mock',...result,productionReadyAdapter:true});}
