export type AIService = 'speech-to-text' | 'text-to-speech' | 'pronunciation' | 'writing' | 'conversation' | 'adaptive' | 'content-generation';

export interface AIProvider { readonly name: string; supports(service: AIService): boolean; run<TInput, TOutput>(service: AIService, input: TInput, context: Record<string, unknown>): Promise<TOutput>; }

export interface PronunciationResult { score: number; recognizedText: string; phonemes?: Array<{ expected: string; heard: string; score: number }>; strengths: string[]; improvements: string[]; }
export interface WritingResult { score: number; correctedText: string; issues: Array<{ category: 'grammar'|'spelling'|'style'|'usage'; message: string; correction?: string }>; retryPrompt: string; }
export interface ConversationTurn { role: 'learner'|'tutor'; text: string; } 

export class MockAIProvider implements AIProvider {
  readonly name = 'mock';
  supports() { return true; }
  async run<TOutput>(service: AIService, input: unknown): Promise<TOutput> {
    // Explicitly a development adapter. Replace with a credentialed provider in production.
    if (service === 'pronunciation') return ({ score: 87, recognizedText: String(input ?? ''), strengths: ['Good vowel clarity'], improvements: ['Try a slightly cleaner final consonant'] } as TOutput);
    if (service === 'writing') return ({ score: 90, correctedText: String(input ?? ''), issues: [], retryPrompt: 'Write one more sentence using today’s grammar.' } as TOutput);
    return ({ status: 'mock', service } as TOutput);
  }
}
