/**
 * Cloudflare Worker: GitHub OAuth + AI 面试分析
 * 
 * 环境变量（在 Cloudflare Dashboard 设置）:
 *   - GITHUB_CLIENT_ID: GitHub OAuth App 的 Client ID
 *   - GITHUB_CLIENT_SECRET: GitHub OAuth App 的 Client Secret
 *   - ALLOWED_ORIGIN: 允许的前端域名（如 https://xiaopeng1112.github.io）
 * 
 * AI 绑定（在 Cloudflare Dashboard → Workers → Settings → AI 中开启）:
 *   - AI: Workers AI binding（自动可用，无需 API Key）
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

    // Route: POST /api/github/user - get user info
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

    // Route: POST /api/ai/analyze - AI 智能分析面试记录（使用 Cloudflare Workers AI 免费模型）
    if (url.pathname === '/api/ai/analyze') {
      try {
        const body = await request.json();
        const { content, categories } = body;

        if (!content || !content.trim()) {
          return new Response(JSON.stringify({ error: 'Missing content' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // 检查 AI binding 是否可用
        if (!env.AI) {
          return new Response(JSON.stringify({ error: 'Workers AI not configured. Please add AI binding in Cloudflare Dashboard.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const systemPrompt = `你是一位资深前端面试官和技术导师。用户会给你一段面试记录（可能是面试笔记、问答记录、或面试复盘总结），请你分析这段面试内容并返回结构化的 JSON。

可选的知识领域分类有：${(categories || []).join('、')}

请严格返回以下 JSON 格式（不要返回其他任何内容，不要有代码块标记）：
{"extractedTopics":["涉及的知识领域数组，从上面的分类中选择"],"questions":[{"question":"从面试记录中提取或推断出的面试题","evaluation":"对候选人在这道题表现的评价（如果能推断）","suggestion":"改进建议"}],"weakPoints":["薄弱点分析，每个是一句话的建议"],"summary":"100字以内的整体分析总结","recommendKeywords":["推荐练习的关键词，用于在题库中匹配相关题目"]}`;

        // 调用 Cloudflare Workers AI（免费，无需 API Key）
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: content.slice(0, 6000) },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        });

        const aiContent = aiResponse.response || '';

        // 尝试解析 AI 返回的 JSON
        let parsed;
        try {
          // 移除可能的 markdown 代码块标记和前后多余内容
          let cleaned = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          // 尝试提取 JSON 对象
          const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            cleaned = jsonMatch[0];
          }
          parsed = JSON.parse(cleaned);
        } catch {
          parsed = { raw: aiContent, parseError: true };
        }

        return new Response(JSON.stringify({ success: true, analysis: parsed }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'AI analysis error: ' + e.message }), {
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
