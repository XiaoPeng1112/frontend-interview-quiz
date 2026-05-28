import { useState, useEffect, useCallback } from 'react';
import {
  AuthState,
  loadAuth,
  logout as logoutAuth,
  handleOAuthCallback,
  hasOAuthCallback,
} from '../services/oauthService';

export function useAuth() {
  const [auth, setAuth] = useState<AuthState | null>(loadAuth);

  // OAuth 回调处理
  useEffect(() => {
    if (hasOAuthCallback()) {
      handleOAuthCallback().then(authState => {
        if (authState) {
          setAuth(authState);
        }
      });
    }
  }, []);

  const handleLogout = useCallback(() => {
    logoutAuth();
    setAuth(null);
  }, []);

  return { auth, setAuth, handleLogout };
}
