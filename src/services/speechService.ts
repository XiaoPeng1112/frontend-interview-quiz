/**
 * 语音服务：Web Speech API（语音识别）+ speechSynthesis（语音合成读题）
 */

// ========== 语音识别 (STT) ==========

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Check browser support
export function isSpeechRecognitionSupported(): boolean {
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

export function isSpeechSynthesisSupported(): boolean {
  return !!window.speechSynthesis;
}

export type RecognitionStatus = 'idle' | 'listening' | 'processing' | 'error';

export interface RecognitionCallbacks {
  onResult: (text: string, isFinal: boolean) => void;
  onStatusChange: (status: RecognitionStatus) => void;
  onError: (error: string) => void;
}

let recognitionInstance: any = null;

export function startRecognition(callbacks: RecognitionCallbacks): void {
  if (!isSpeechRecognitionSupported()) {
    callbacks.onError('当前浏览器不支持语音识别，请使用 Chrome');
    return;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'zh-CN';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    callbacks.onStatusChange('listening');
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    if (finalTranscript) {
      callbacks.onResult(finalTranscript, true);
    } else if (interimTranscript) {
      callbacks.onResult(interimTranscript, false);
    }
  };

  recognition.onerror = (event: any) => {
    const errorMsg = event.error === 'no-speech'
      ? '未检测到语音'
      : event.error === 'not-allowed'
      ? '麦克风权限被拒绝'
      : `识别错误: ${event.error}`;
    callbacks.onError(errorMsg);
    callbacks.onStatusChange('error');
  };

  recognition.onend = () => {
    callbacks.onStatusChange('idle');
  };

  recognitionInstance = recognition;
  recognition.start();
}

export function stopRecognition(): void {
  if (recognitionInstance) {
    recognitionInstance.stop();
    recognitionInstance = null;
  }
}

// ========== 语音合成 (TTS) ==========

export function speakText(text: string, onEnd?: () => void): void {
  if (!isSpeechSynthesisSupported()) return;

  // 取消正在播放的语音
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.9;
  utterance.pitch = 1;

  // 尝试选择中文语音
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.startsWith('zh'));
  if (zhVoice) {
    utterance.voice = zhVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  return isSpeechSynthesisSupported() && window.speechSynthesis.speaking;
}
