import { useState, useEffect, useCallback } from 'react';
import { InterviewRecord } from '../services/gistSync';

const STORAGE_KEY_HISTORY = 'interview-quiz-history';

function loadHistory(): InterviewRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function useInterviewHistory() {
  const [interviewHistory, setInterviewHistory] = useState<InterviewRecord[]>(loadHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(interviewHistory));
  }, [interviewHistory]);

  const handleSaveRecord = useCallback((record: InterviewRecord) => {
    setInterviewHistory(prev => [record, ...prev]);
  }, []);

  const handleClearHistory = useCallback(() => {
    setInterviewHistory([]);
  }, []);

  return {
    interviewHistory,
    setInterviewHistory,
    handleSaveRecord,
    handleClearHistory,
  };
}
