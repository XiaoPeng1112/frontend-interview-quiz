import React, { useState } from 'react';
import {
  GistConfig,
  loadGistConfig,
  saveGistConfig,
  clearGistConfig,
  validateToken,
  createGist,
  SyncData,
} from '../services/gistSync';
import './SyncPanel.css';

interface Props {
  onConfigChange: (config: GistConfig | null) => void;
  onSync: () => Promise<void>;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  currentData: SyncData;
}

const SyncPanel: React.FC<Props> = ({ onConfigChange, onSync, syncStatus, lastSyncTime, currentData }) => {
  const [showSetup, setShowSetup] = useState(false);
  const [token, setToken] = useState('');
  const [gistId, setGistId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const config = loadGistConfig();
  const isConfigured = !!config;

  const handleSetup = async () => {
    if (!token.trim()) {
      setError('请输入 GitHub Token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const valid = await validateToken(token.trim());
      if (!valid) {
        setError('Token 无效，请检查后重试');
        setLoading(false);
        return;
      }

      let finalGistId = gistId.trim();

      if (!finalGistId) {
        // 创建新 Gist
        finalGistId = await createGist(token.trim(), currentData);
      }

      const newConfig: GistConfig = { token: token.trim(), gistId: finalGistId };
      saveGistConfig(newConfig);
      onConfigChange(newConfig);
      setShowSetup(false);
      setToken('');
      setGistId('');
    } catch (e: any) {
      setError(e.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    clearGistConfig();
    onConfigChange(null);
  };

  if (showSetup) {
    return (
      <div className="sync-panel">
        <div className="sync-setup">
          <h3>配置云同步</h3>
          <p className="sync-setup-desc">
            使用 GitHub Gist 存储数据，实现跨设备同步。
            需要一个有 Gist 权限的 Personal Access Token。
          </p>

          <div className="sync-field">
            <label>GitHub Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="sync-input"
            />
          </div>

          <div className="sync-field">
            <label>Gist ID（选填，留空则自动创建）</label>
            <input
              type="text"
              value={gistId}
              onChange={(e) => setGistId(e.target.value)}
              placeholder="已有 Gist ID 可填入，实现多端共用"
              className="sync-input"
            />
          </div>

          {error && <div className="sync-error">{error}</div>}

          <div className="sync-setup-actions">
            <button
              className="sync-btn primary"
              onClick={handleSetup}
              disabled={loading}
            >
              {loading ? '连接中...' : '连接'}
            </button>
            <button
              className="sync-btn"
              onClick={() => { setShowSetup(false); setError(''); }}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sync-panel">
      <div className="sync-status-bar">
        <div className="sync-info">
          <span className={`sync-dot ${isConfigured ? 'connected' : 'disconnected'}`} />
          <span className="sync-text">
            {isConfigured ? '已连接云同步' : '未配置云同步'}
          </span>
        </div>

        {isConfigured ? (
          <div className="sync-actions">
            <button
              className="sync-action-btn"
              onClick={onSync}
              disabled={syncStatus === 'syncing'}
            >
              {syncStatus === 'syncing' ? '同步中...' : syncStatus === 'success' ? '✓ 已同步' : '同步'}
            </button>
            <button className="sync-action-btn danger" onClick={handleDisconnect}>
              断开
            </button>
          </div>
        ) : (
          <button className="sync-action-btn" onClick={() => setShowSetup(true)}>
            配置
          </button>
        )}
      </div>

      {lastSyncTime && isConfigured && (
        <div className="sync-last-time">
          上次同步: {new Date(lastSyncTime).toLocaleString()}
        </div>
      )}

      {syncStatus === 'error' && (
        <div className="sync-error">同步失败，请检查网络后重试</div>
      )}
    </div>
  );
};

export default SyncPanel;
