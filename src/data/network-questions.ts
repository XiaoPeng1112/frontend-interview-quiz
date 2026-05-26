import { Question } from './types';

export const networkQuestions: Question[] = [
  {
    id: 601,
    category: '网络',
    difficulty: 'easy',
    question: 'HTTP 和 HTTPS 的区别？',
    answer: `HTTP：端口 80，明文传输，不需要证书。
HTTPS：端口 443，TLS/SSL 加密，需要 CA 证书。

HTTPS 握手：客户端发送加密套件列表 → 服务端选择并返回证书 → 客户端验证证书生成随机密钥 → 对称加密通信。

HTTP/2、HTTP/3 默认要求 HTTPS。`,
  },
  {
    id: 602,
    category: '网络',
    difficulty: 'medium',
    question: '跨域是什么？有哪些解决方案？',
    answer: `同源策略：协议 + 域名 + 端口 完全相同才同源。

解决方案：
1. CORS（推荐）：服务端设 Access-Control-Allow-Origin
2. 代理：dev 用 webpack proxy，prod 用 Nginx 反代
3. JSONP：script 标签不受限，仅 GET
4. postMessage：跨窗口通信
5. WebSocket：不受同源限制

CORS 预检：非简单请求先发 OPTIONS 确认。`,
  },
  {
    id: 603,
    category: '网络',
    difficulty: 'medium',
    question: 'HTTP 缓存策略？强缓存和协商缓存？',
    answer: `强缓存：不发请求，直接用缓存。
- Cache-Control: max-age（优先级高）
- Expires（已过时）
命中返回 200 (from cache)。

协商缓存：发请求验证。
- ETag / If-None-Match（精确，优先）
- Last-Modified / If-Modified-Since（秒级）
未过期返回 304。

最佳实践：
- HTML：no-cache（每次协商）
- JS/CSS/图片：hash 文件名 + max-age=31536000`,
  },
  {
    id: 604,
    category: '网络',
    difficulty: 'hard',
    question: 'HTTP/2 和 HTTP/3 的改进？',
    answer: `HTTP/2 改进：
1. 多路复用：一个 TCP 连接并行多个请求
2. 二进制分帧：解析效率更高
3. HPACK 头部压缩
4. 服务端推送
5. 流优先级

局限：TCP 层队头阻塞，丢包时所有流受影响。

HTTP/3：
- 基于 QUIC（UDP）
- 解决 TCP 队头阻塞
- 0-RTT 连接建立
- 连接迁移（网络切换不断连）`,
  },
];
