/**
 * GitHub OAuth 登录服务
 * 通过 Cloudflare Worker 完成 code → token 交换
 */

// ⚠️ 部署后替换为你实际的值
const GITHUB_CLIENT_ID = 'REPLACE_WITH_YOUR_CLIENT_ID';
const WORKER_BASE_URL = 'https://interview-quiz-oauth.YOUR_SUBDOMAIN.workers.dev';

const AUTH_STORAGE_KEY = 'interview-quiz-auth';

export interface AuthState {
  token: string;
  login: string;
  avatarUrl: string;
  name: string;
}

// 发起 GitHub OAuth 登录
export function initiateLogin(): void {
  // 生成随机 state 防 CSRF
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
  sessionStorage.setItem('oauth_state', state);

  const redirectUri = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'gist',
    state,
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
}

// 处理 OAuth 回调（从 URL 中提取 code）
export async function handleOAuthCallback(): Promise<AuthState | null> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (!code) return null;

  // 验证 state
  const savedState = sessionStorage.getItem('oauth_state');
  if (state !== savedState) {
    console.warn('OAuth state mismatch');
    cleanUrlParams();
    return null;
  }
  sessionStorage.removeItem('oauth_state');

  try {
    // 用 Worker 交换 token
    const tokenRes = await fetch(`${WORKER_BASE_URL}/api/github/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      throw new Error(tokenData.error || 'Token exchange failed');
    }

    // 获取用户信息
    const userRes = await fetch(`${WORKER_BASE_URL}/api/github/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenData.access_token }),
    });

    const userData = await userRes.json();

    const authState: AuthState = {
      token: tokenData.access_token,
      login: userData.login || '',
      avatarUrl: userData.avatar_url || '',
      name: userData.name || userData.login || '',
    };

    saveAuth(authState);
    cleanUrlParams();
    return authState;
  } catch (e) {
    console.error('OAuth callback error:', e);
    cleanUrlParams();
    return null;
  }
}

// 检查 URL 是否包含 OAuth 回调参数
export function hasOAuthCallback(): boolean {
  const params = new URLSearchParams(window.location.search);
  return !!params.get('code');
}

// 从 localStorage 加载已保存的登录状态
export function loadAuth(): AuthState | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

// 保存登录状态
export function saveAuth(auth: AuthState): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

// 退出登录
export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// 清理 URL 中的 OAuth 参数
function cleanUrlParams(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, '', url.pathname + url.hash);
}

// 获取配置信息（用于调试）
export function getOAuthConfig() {
  return {
    clientId: GITHUB_CLIENT_ID,
    workerUrl: WORKER_BASE_URL,
  };
}
