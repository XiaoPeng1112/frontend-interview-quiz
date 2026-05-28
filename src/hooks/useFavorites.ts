import { useState, useEffect, useCallback } from 'react';

type MarkType = 'favorite' | 'mastered' | 'weak';

const STORAGE_KEY_FAV = 'interview-quiz-favorites';
const STORAGE_KEY_MARKS = 'interview-quiz-marks';

function loadFavorites(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAV);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function loadMarks(): Record<number, MarkType> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MARKS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(loadFavorites);
  const [marks, setMarks] = useState<Record<number, MarkType>>(loadMarks);

  // 持久化
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAV, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MARKS, JSON.stringify(marks));
  }, [marks]);

  const handleToggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSetMark = useCallback((id: number, mark: MarkType | null) => {
    setMarks(prev => {
      const next = { ...prev };
      if (mark === null) delete next[id];
      else next[id] = mark;
      return next;
    });
  }, []);

  return {
    favorites,
    setFavorites,
    marks,
    setMarks,
    handleToggleFavorite,
    handleSetMark,
  };
}
