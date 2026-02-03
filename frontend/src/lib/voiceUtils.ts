// frontend/src/lib/voiceUtils.ts

/**
 * Voice recognition utilities for speech-to-text functionality
 */

export interface VoiceRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export class VoiceRecognizer {
  private recognition: any;
  private isListening: boolean = false;
  
  constructor(options: VoiceRecognitionOptions = {}) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition not supported in this browser');
    }
    
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = options.continuous ?? false;
    this.recognition.interimResults = options.interimResults ?? false;
    this.recognition.maxAlternatives = options.maxAlternatives ?? 1;
    this.recognition.lang = options.lang ?? 'en-US';
  }
  
  startListening(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): void {
    if (this.isListening) return;
    
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.resultIndex][0].transcript;
      onResult(transcript);
    };
    
    this.recognition.onerror = (event: any) => {
      if (onError) {
        onError(event.error);
      }
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) {
        onEnd();
      }
    };
    
    this.recognition.start();
    this.isListening = true;
  }
  
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  abort(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
    }
  }
  
  isSupported(): boolean {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }
}