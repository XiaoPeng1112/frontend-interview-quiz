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
    oralAnswer: `HTTP 是明文传输，端口 80，不需要证书。HTTPS 在 HTTP 基础上加了 TLS/SSL 加密层，端口 443，需要 CA 证书。

HTTPS 的握手过程简单说：客户端发送支持的加密套件列表，服务端选择一个并返回证书，客户端验证证书合法性后生成随机密钥，然后双方用这个对称密钥加密通信。

现在基本所有网站都要求 HTTPS，HTTP/2 和 HTTP/3 也默认要求在 HTTPS 上运行。`,
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
    oralAnswer: `跨域是因为浏览器的同源策略，协议 + 域名 + 端口必须完全一致才允许请求。

解决方案主要有：CORS 是最推荐的，服务端设置 Access-Control-Allow-Origin 响应头；代理方式，开发用 webpack proxy，生产用 Nginx 反向代理；JSONP 利用 script 标签不受同源限制的特性，但只支持 GET；postMessage 用于跨窗口通信；WebSocket 不受同源策略限制。

还有个重要概念是 CORS 预检请求：非简单请求（比如带自定义头或 PUT/DELETE 方法）会先发一个 OPTIONS 请求确认服务端允许，才发正式请求。`,
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
    oralAnswer: `HTTP 缓存分两种：强缓存和协商缓存。

强缓存是直接使用本地缓存，不发请求。通过 Cache-Control: max-age 控制（优先级更高）或 Expires 头。命中时返回 200，状态显示 from cache。

协商缓存是发请求问服务器资源是否变了。主要用 ETag/If-None-Match（精确到内容变化，优先级高）或 Last-Modified/If-Modified-Since（秒级精度）。未过期返回 304 Not Modified。

实践中的最佳策略是：HTML 文件设为 no-cache（每次协商确保最新），JS/CSS/图片等静态资源用文件名 hash + 长期强缓存，内容变了 hash 就变，自动缓存失效。`,
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
    oralAnswer: `HTTP/2 的主要改进有：多路复用，一个 TCP 连接上可以并行多个请求，解决了 HTTP/1.1 的队头阻塞；二进制分帧，解析效率更高；HPACK 头部压缩减少传输开销；还支持服务端推送和流优先级。

但 HTTP/2 有个局限：它基于 TCP，TCP 层的队头阻塞问题没解决，一个包丢失会影响所有流。

HTTP/3 基于 QUIC 协议（底层是 UDP），彻底解决了 TCP 队头阻塞；支持 0-RTT 连接建立，首次连接更快；还支持连接迁移，切换网络（比如 WiFi 切 4G）时不用重新建连。`,
  },
];
