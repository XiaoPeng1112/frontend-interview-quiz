import { useState, useEffect, useCallback } from 'react';
import {
  SyncData,
  InterviewRecord,
  loadGistId,
  saveGistId,
  clearGistId,
  findExistingGist,
  createGist,
  readGist,
  updateGist,
  mergeData,
} from '../services/gistSync';
import { AuthState } from '../services/oauthService';
import { hasOAuthCallback } from '../services/oauthService';

type MarkType = 'favorite' | 'mastered' | 'weak';

interface UseSyncParams {
  auth: AuthState | null;
  favorites: Set<number>;
  marks: Record<number, MarkType>;
  interviewHistory: InterviewRecord[];
  setFavorites: (v: Set<number>) => void;
  setMarks: (v: Record<number, MarkType>) => void;
  setInterviewHistory: (v: InterviewRecord[]) => void;
  onLogout: () => void;
}

export function useSync({
  auth,
  favorites,
  marks,
  interviewHistory,
  setFavorites,
  setMarks,
  setInterviewHistory,
  onLogout,
}: UseSyncParams) {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // 构建当前同步数据
  const buildSyncData = useCallback((): SyncData => ({
    favorites: Array.from(favorites),
    marks: Object.fromEntries(
      Object.entries(marks).map(([k, v]) => [k, v])
    ),
    interviewHistory,
    lastSyncAt: new Date().toISOString(),
  }), [favorites, marks, interviewHistory]);

  // 从 SyncData 恢复状态
  const applySyncData = useCallback((data: SyncData) => {
    setFavorites(new Set(data.favorites));
    const restoredMarks: Record<number, MarkType> = {};
    for (const [k, v] of Object.entries(data.marks)) {
      if (v === 'favorite' || v === 'mastered' || v === 'weak') {
        restoredMarks[Number(k)] = v as MarkType;
      }
    }
    setMarks(restoredMarks);
    setInterviewHistory(data.interviewHistory || []);
  }, [setFavorites, setMarks, setInterviewHistory]);

  // 同步操作
  const handleSync = useCallback(async () => {
    if (!auth) return;

    setSyncStatus('syncing');
    try {
      let gistId = loadGistId();

      if (!gistId) {
        gistId = await findExistingGist(auth.token);
        if (gistId) {
          saveGistId(gistId);
        }
      }

      const localData = buildSyncData();

      if (!gistId) {
        gistId = await createGist(auth.token, localData);
        saveGistId(gistId);
        setLastSyncTime(localData.lastSyncAt);
      } else {
        const remoteData = await readGist(auth.token, gistId);

        if (remoteData) {
          const merged = mergeData(localData, remoteData);
          applySyncData(merged);
          await updateGist(auth.token, gistId, merged);
          setLastSyncTime(merged.lastSyncAt);
        } else {
          await updateGist(auth.token, gistId, localData);
          setLastSyncTime(localData.lastSyncAt);
        }
      }

      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (e) {
      console.error('Sync error:', e);
      setSyncStatus('error');
    }
  }, [auth, buildSyncData, applySyncData]);

  // 登录后自动同步
  useEffect(() => {
    if (auth && !hasOAuthCallback()) {
      handleSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const handleLogout = useCallback(() => {
    clearGistId();
    onLogout();
    setLastSyncTime(null);
  }, [onLogout]);

  return { syncStatus, lastSyncTime, handleSync, handleLogout };
}
