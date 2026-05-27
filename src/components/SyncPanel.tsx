import React from 'react';
import type { AuthState } from '../services/oauthService';
import { initiateLogin } from '../services/oauthService';
import './SyncPanel.css';

interface Props {
  auth: AuthState | null;
  onLogout: () => void;
  onSync: () => Promise<void>;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
}

const SyncPanel: React.FC<Props> = ({ auth, onLogout, onSync, syncStatus, lastSyncTime }) => {
  if (!auth) {
    // 未登录状态
    return (
      <div className="sync-panel">
        <div className="sync-login-card">
          <div className="sync-login-info">
            <span className="sync-dot disconnected" />
            <span className="sync-text">登录后可跨设备同步数据</span>
          </div>
          <button className="github-login-btn" onClick={() => initiateLogin()}>
            <svg className="github-icon" viewBox="0 0 16 16" width="16" height="16">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor"/>
            </svg>
            GitHub 登录
          </button>
        </div>
      </div>
    );
  }

  // 已登录状态
  return (
    <div className="sync-panel">
      <div className="sync-status-bar">
        <div className="sync-user-info">
          {auth.avatarUrl && (
            <img className="sync-avatar" src={auth.avatarUrl} alt={auth.login} />
          )}
          <div className="sync-user-text">
            <span className="sync-username">{auth.name || auth.login}</span>
            <span className="sync-connected">
              <span className="sync-dot connected" />
              已同步
            </span>
          </div>
        </div>

        <div className="sync-actions">
          <button
            className="sync-action-btn"
            onClick={onSync}
            disabled={syncStatus === 'syncing'}
          >
            {syncStatus === 'syncing' ? '同步中...' : syncStatus === 'success' ? '✓' : '同步'}
          </button>
          <button className="sync-action-btn danger" onClick={onLogout}>
            退出
          </button>
        </div>
      </div>

      {lastSyncTime && (
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
