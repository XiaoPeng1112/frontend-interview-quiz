/**
 * GitHub Gist 跨端同步服务
 * 使用 GitHub Personal Access Token 读写 Gist 实现数据同步
 */

const GIST_STORAGE_KEY = 'interview-quiz-gist-config';

export interface GistConfig {
  token: string;
  gistId: string;
}

export interface SyncData {
  favorites: number[];
  marks: Record<string, string>; // id -> markType
  interviewHistory: InterviewRecord[];
  lastSyncAt: string;
}

export interface InterviewRecord {
  id: string;
  date: string;
  category: string;
  totalQuestions: number;
  elapsed: number; // seconds
  scores: number[]; // 0=未评 1=不会 2=部分 3=掌握
  questionIds: number[];
  masteredCount: number;
  partialCount: number;
  failedCount: number;
}

const FILENAME = 'interview-quiz-sync.json';

// 保存/读取 Gist 配置
export function saveGistConfig(config: GistConfig): void {
  localStorage.setItem(GIST_STORAGE_KEY, JSON.stringify(config));
}

export function loadGistConfig(): GistConfig | null {
  try {
    const raw = localStorage.getItem(GIST_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function clearGistConfig(): void {
  localStorage.removeItem(GIST_STORAGE_KEY);
}

// 创建新 Gist
export async function createGist(token: string, data: SyncData): Promise<string> {
  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'Frontend Interview Quiz - Sync Data',
      public: false,
      files: {
        [FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`创建 Gist 失败: ${res.status}`);
  }

  const json = await res.json();
  return json.id;
}

// 读取 Gist 数据
export async function readGist(token: string, gistId: string): Promise<SyncData | null> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Authorization': `token ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`读取 Gist 失败: ${res.status}`);
  }

  const json = await res.json();
  const file = json.files?.[FILENAME];
  if (!file) return null;

  try {
    return JSON.parse(file.content);
  } catch {
    return null;
  }
}

// 更新 Gist 数据
export async function updateGist(token: string, gistId: string, data: SyncData): Promise<void> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        [FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`更新 Gist 失败: ${res.status}`);
  }
}

// 验证 Token 有效性
export async function validateToken(token: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `token ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 合并远端与本地数据（取并集策略）
export function mergeData(local: SyncData, remote: SyncData): SyncData {
  const localTime = new Date(local.lastSyncAt).getTime();
  const remoteTime = new Date(remote.lastSyncAt).getTime();

  // 收藏：取并集
  const mergedFavSet = new Set([...local.favorites, ...remote.favorites]);

  // 标记：以时间较新的为主覆盖
  const baseMark = localTime > remoteTime ? remote.marks : local.marks;
  const overrideMark = localTime > remoteTime ? local.marks : remote.marks;
  const mergedMarks = { ...baseMark, ...overrideMark };

  // 面试历史：合并去重
  const historyMap = new Map<string, InterviewRecord>();
  for (const r of remote.interviewHistory) historyMap.set(r.id, r);
  for (const r of local.interviewHistory) historyMap.set(r.id, r);
  const mergedHistory = Array.from(historyMap.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    favorites: Array.from(mergedFavSet),
    marks: mergedMarks,
    interviewHistory: mergedHistory,
    lastSyncAt: new Date().toISOString(),
  };
}
