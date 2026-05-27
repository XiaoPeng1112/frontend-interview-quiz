/**
 * Cloudflare Worker: GitHub OAuth Token Exchange Proxy
 * 
 * 环境变量（在 Cloudflare Dashboard 设置）:
 *   - GITHUB_CLIENT_ID: GitHub OAuth App 的 Client ID
 *   - GITHUB_CLIENT_SECRET: GitHub OAuth App 的 Client Secret
 *   - ALLOWED_ORIGIN: 允许的前端域名（如 https://xiaopeng1112.github.io）
 */

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(request.url);

    // Route: POST /api/github/oauth/token
    if (url.pathname === '/api/github/oauth/token') {
      try {
        const body = await request.json();
        const { code } = body;

        if (!code) {
          return new Response(JSON.stringify({ error: 'Missing code parameter' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Exchange code for token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        });

        const tokenData = await tokenRes.json();

        if (tokenData.error) {
          return new Response(JSON.stringify({ error: tokenData.error_description || tokenData.error }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Internal error: ' + e.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Route: POST /api/github/user - get user info (for showing username)
    if (url.pathname === '/api/github/user') {
      try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
          return new Response(JSON.stringify({ error: 'Missing token' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const userRes = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'interview-quiz-worker',
          },
        });

        const userData = await userRes.json();

        return new Response(JSON.stringify({
          login: userData.login,
          avatar_url: userData.avatar_url,
          name: userData.name,
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Internal error: ' + e.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },
};
