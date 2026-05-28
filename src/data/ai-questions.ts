import { Question } from './types';

export const aiQuestions: Question[] = [
  {
    id: 901,
    category: 'AI 前端',
    difficulty: 'easy',
    question: '前端如何接入大模型 API（如 OpenAI/ChatGPT）？',
    answer: `基本接入方式：

1. REST API 调用：
fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer sk-xxx', 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'gpt-4', messages: [...] })
})

2. 流式响应（SSE）：
- 设置 stream: true
- 使用 EventSource 或 ReadableStream 逐步接收
- 实现打字机效果

注意事项：
- API Key 不能暴露在前端，需要后端代理
- 处理超时和重试
- 流式输出的中断与续传
- Token 用量和费用控制`,
    oralAnswer: `前端接入大模型 API 主要有两种方式。

一种是普通的 REST API 调用，用 fetch 发 POST 请求到 OpenAI 的接口，传入 model 和 messages 参数。另一种是流式响应，设置 stream: true，使用 ReadableStream 逐步接收数据，实现打字机效果。

注意事项很重要：API Key 绝对不能暴露在前端代码中，必须通过后端代理；要处理超时和重试机制；流式输出要支持中断和续传；还要注意 Token 用量和费用控制。`,
  },
  {
    id: 902,
    category: 'AI 前端',
    difficulty: 'medium',
    question: '如何实现 AI 对话的流式输出（打字机效果）？',
    answer: `核心技术：Server-Sent Events (SSE) + ReadableStream

实现方式：
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages, stream: true }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let result = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  // 解析 SSE 格式：data: {...}
  const lines = chunk.split('\\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      result += data.choices[0].delta.content || '';
      setMessage(result); // 实时更新 UI
    }
  }
}

优化：
- 使用 requestAnimationFrame 批量更新 DOM
- Markdown 实时渲染（增量解析）
- 代码块语法高亮
- 中断请求（AbortController）`,
    oralAnswer: `流式输出的核心技术是 SSE（Server-Sent Events）加 ReadableStream。

实现流程是：发 fetch 请求时设置 stream: true，拿到 response.body 后用 getReader() 获取读取器，循环 read() 获取数据块，用 TextDecoder 解码后解析 SSE 格式的 data 行，提取 delta.content 拼接到结果中，每次拼接后更新 UI。

优化方面：用 requestAnimationFrame 批量更新 DOM 避免频繁重绘；Markdown 内容要做增量解析和实时渲染；代码块需要语法高亮；要支持用 AbortController 中断请求。`,
  },
  {
    id: 903,
    category: 'AI 前端',
    difficulty: 'medium',
    question: '什么是 RAG（检索增强生成）？前端如何配合实现？',
    answer: `RAG = Retrieval-Augmented Generation（检索增强生成）

原理：先从知识库检索相关文档，再将文档作为上下文交给大模型生成回答，解决大模型知识过时/幻觉问题。

流程：用户提问 → 文本向量化 → 向量数据库检索 → 拼接 Prompt → LLM 生成

前端配合：
1. 文件上传与处理：支持 PDF/Word/网页等格式上传
2. 知识库管理 UI：文档列表、分类、状态展示
3. 对话界面：显示引用来源、支持追问
4. 向量搜索预览：展示检索到的相关片段
5. 反馈机制：用户标记回答质量，优化检索

技术栈：
- 向量数据库：Pinecone、Weaviate、Milvus
- 文本分割：LangChain
- Embedding：OpenAI text-embedding-3
- 前端框架：Vercel AI SDK 简化开发`,
    oralAnswer: `RAG 就是检索增强生成，解决大模型知识过时和幻觉的问题。原理是先从知识库检索相关文档，再把文档作为上下文交给大模型生成回答。

流程是：用户提问后，将问题文本向量化，在向量数据库中检索相似内容，把检索到的文档片段拼接到 Prompt 中，再发给 LLM 生成回答。

前端配合的工作包括：文件上传处理（支持 PDF/Word 等格式）、知识库管理界面、对话界面要显示引用来源支持追问、向量搜索预览展示相关片段、用户反馈机制优化检索质量。

技术栈方面，向量数据库用 Pinecone 或 Milvus，文本分割用 LangChain，Embedding 用 OpenAI 的 text-embedding 模型，前端用 Vercel AI SDK 简化开发。`,
  },
  {
    id: 904,
    category: 'AI 前端',
    difficulty: 'medium',
    question: 'AI 辅助编码工具（Copilot）的原理是什么？前端如何集成类似能力？',
    answer: `原理：
1. 代码补全模型：基于大量代码训练的 LLM（Codex/StarCoder/DeepSeek）
2. 上下文收集：当前文件、打开的标签页、项目结构、注释
3. 提示构造：将上下文拼接为 Prompt 发送给模型
4. 流式返回：实时显示补全建议

前端集成类似能力：
1. Monaco Editor + AI 补全：
   - 注册 CompletionItemProvider
   - 收集光标上下文发送给 API
   - 以 inline suggestion 形式展示
2. 代码审查集成：PR 自动 review
3. 自然语言转代码：输入描述生成组件

相关工具/SDK：
- Vercel AI SDK：统一多模型 API
- LangChain.js：链式调用、Agent
- Continue（VS Code）：开源 AI 编码助手

在 RN 项目中的应用：
- 自动生成组件样板代码
- 根据设计稿描述生成 UI 代码
- 自动编写单元测试`,
    oralAnswer: `Copilot 类工具的原理是：基于大量代码训练的 LLM（如 Codex、StarCoder），收集当前文件、打开的标签页、项目结构等上下文，构造 Prompt 发送给模型，流式返回补全建议。

前端集成类似能力主要通过 Monaco Editor：注册 CompletionItemProvider，收集光标位置的上下文发给 AI API，以 inline suggestion 形式展示补全结果。还可以做代码审查集成（PR 自动 review）和自然语言转代码。

相关工具有 Vercel AI SDK 统一多模型 API、LangChain.js 做链式调用、Continue 是开源的 VS Code AI 编码助手。

在 RN 项目中可以自动生成组件样板代码、根据设计稿描述生成 UI 代码、自动编写单元测试。`,
  },
  {
    id: 905,
    category: 'AI 前端',
    difficulty: 'hard',
    question: '如何在前端/移动端实现本地 AI 推理（On-Device AI）？',
    answer: `为什么要本地推理：隐私保护、离线可用、低延迟、省服务器成本。

技术方案：

1. WebAssembly + ONNX Runtime：
- 将模型转为 ONNX 格式
- 使用 onnxruntime-web 在浏览器中推理
- 支持 WebGL/WebGPU 加速

2. TensorFlow.js：
- 模型格式转换（tf.loadLayersModel）
- WebGL/WebGPU/WASM 后端
- 适合图像分类、姿态检测等

3. WebLLM / MLC-LLM：
- 在浏览器中运行大模型（Llama/Mistral）
- 使用 WebGPU 加速
- 模型量化（4-bit）减小体积

4. React Native 端：
- TFLite / CoreML / NNAPI 原生推理
- react-native-fast-tflite
- ExecuTorch（Meta 推出的移动端推理框架）

挑战：
- 模型体积（需量化/蒸馏）
- 计算资源有限
- 首次加载模型耗时
- 兼容性（WebGPU 仍在推广中）`,
    oralAnswer: `本地 AI 推理的优势是隐私保护、离线可用、低延迟、省服务器成本。

技术方案有几种：WebAssembly + ONNX Runtime 可以在浏览器中跑 ONNX 格式模型，支持 WebGL/WebGPU 加速；TensorFlow.js 适合图像分类、姿态检测等场景；WebLLM/MLC-LLM 可以在浏览器中跑大模型（Llama/Mistral），用 WebGPU 加速加模型量化。

React Native 端可以用 TFLite、CoreML、NNAPI 做原生推理，Meta 推出的 ExecuTorch 是专门的移动端推理框架。

主要挑战是模型体积需要量化蒸馏、移动端计算资源有限、首次加载模型耗时长、WebGPU 兼容性还在推广中。`,
  },
  {
    id: 906,
    category: 'AI 前端',
    difficulty: 'medium',
    question: '前端如何实现 AI 生成内容的 Markdown 实时渲染？',
    answer: `挑战：流式输出时 Markdown 是不完整的（如 ** 只收到一半、代码块未闭合）。

解决方案：

1. 增量解析：
- 使用 markdown-it 或 marked 库
- 每次收到新 chunk 重新解析整段文本
- 优化：只重新渲染变化的部分（diff）

2. 容错处理：
- 未闭合的代码块临时补全 \`\`\`
- 未闭合的粗体/斜体暂不渲染
- 使用自定义 parser 处理中间状态

3. 代码高亮：
- highlight.js / Prism.js
- 流式输出时延迟高亮（等代码块完整）
- 支持复制代码按钮

4. 性能优化：
- 虚拟化长文本
- requestAnimationFrame 批量更新
- React 中用 useMemo 缓存已渲染部分
- 避免整段重新 parse，只处理增量

5. 推荐库：
- react-markdown：React 生态
- @bytemd/react：字节跳动
- Vercel AI SDK 内置流式 Markdown 支持`,
    oralAnswer: `流式 Markdown 渲染的核心挑战是：流式输出时 Markdown 是不完整的，比如粗体标记只收到一半、代码块未闭合。

解决方案是增量解析：每次收到新 chunk 后重新解析整段文本（用 markdown-it 或 marked），优化点是只重新渲染变化的部分做 diff。对未闭合的代码块临时补全闭合符号，未闭合的粗体暂不渲染。

代码高亮用 highlight.js 或 Prism.js，流式输出时等代码块完整后再高亮，支持复制按钮。

性能优化方面：长文本做虚拟化、用 requestAnimationFrame 批量更新、React 中用 useMemo 缓存已渲染部分、避免整段重新 parse 只处理增量。推荐库有 react-markdown 和 Vercel AI SDK 内置的流式 Markdown 支持。`,
  },
  {
    id: 907,
    category: 'AI 前端',
    difficulty: 'hard',
    question: 'AI Agent（智能体）在前端的应用和实现思路？',
    answer: `AI Agent = LLM + 工具调用 + 记忆 + 规划

前端场景：
1. 智能客服：多轮对话 + 查询订单/退款等工具调用
2. 数据分析助手：自然语言 → SQL/图表生成
3. 设计转代码：理解设计稿 → 生成前端代码
4. 自动化测试：理解需求 → 编写并执行测试

实现架构：
用户输入 → LLM 决策 → 选择工具 → 执行 → 观察结果 → 继续/完成

前端实现要点：
1. Function Calling：定义工具 schema，模型返回调用意图
2. 多步推理展示：展示 Agent 思考链（Thinking → Acting → Observing）
3. 工具执行状态：loading、成功、失败的 UI 反馈
4. 会话记忆管理：上下文窗口限制、摘要压缩
5. 安全沙箱：Agent 生成的代码需在沙箱中执行

技术栈：
- LangChain.js / LlamaIndex.TS
- Vercel AI SDK（useChat + tools）
- OpenAI Assistants API
- 前端沙箱：iframe sandbox / Web Worker`,
    oralAnswer: `AI Agent 就是 LLM 加上工具调用、记忆和规划能力的智能体。

前端场景有：智能客服（多轮对话加工具调用查订单退款）、数据分析助手（自然语言转 SQL 和图表）、设计转代码、自动化测试等。

架构是循环式的：用户输入后 LLM 决策选择工具，执行工具后观察结果，决定继续还是完成。

前端实现要点：Function Calling 定义工具 schema 让模型返回调用意图；UI 上展示 Agent 的思考链（Thinking、Acting、Observing）；工具执行要有 loading 和成功失败的状态反馈；会话记忆管理要处理上下文窗口限制做摘要压缩；Agent 生成的代码要在安全沙箱中执行（iframe sandbox 或 Web Worker）。`,
  },
  {
    id: 908,
    category: 'AI 前端',
    difficulty: 'medium',
    question: 'Prompt Engineering 在前端产品中的最佳实践？',
    answer: `Prompt 设计原则：
1. 明确角色：You are a senior frontend developer...
2. 提供上下文：当前代码、错误信息、项目技术栈
3. 指定格式：返回 JSON/Markdown/代码
4. Few-shot 示例：给出输入输出示例
5. 约束条件：字数限制、不使用某些库

前端产品中的实践：
1. 模板化 Prompt：预设场景模板，用户只需填空
2. 动态上下文注入：自动收集相关代码/文档
3. 输出结构化：要求返回 JSON，前端直接解析渲染
4. 多轮优化：根据用户反馈自动修改 Prompt
5. A/B 测试：不同 Prompt 版本对比效果

安全注意：
- Prompt 注入防护：过滤用户输入中的指令
- 输出验证：不直接执行 AI 返回的代码
- 敏感信息过滤：不把用户隐私发送给 API
- Rate Limiting：防止恶意大量调用`,
    oralAnswer: `Prompt Engineering 在产品中的设计原则有：明确角色设定、提供充分上下文、指定输出格式（JSON/Markdown/代码）、给 Few-shot 示例、加约束条件。

前端产品中的实践包括：模板化 Prompt 让用户只需填空不用写完整提示；动态上下文注入自动收集相关代码或文档；要求输出结构化 JSON 方便前端直接解析渲染；多轮优化根据用户反馈修改 Prompt；A/B 测试对比不同 Prompt 版本效果。

安全方面很关键：要防 Prompt 注入（过滤用户输入中的指令）、输出验证（不直接执行 AI 返回的代码）、敏感信息过滤（不把用户隐私发给 API）、Rate Limiting 防止恶意大量调用。`,
  },
  {
    id: 909,
    category: 'AI 前端',
    difficulty: 'hard',
    question: '多模态 AI 在前端的应用场景和技术实现？',
    answer: `多模态 = 文本 + 图像 + 音频 + 视频的理解与生成。

前端应用场景：
1. 图片理解：上传截图 → AI 分析内容/生成代码
2. 语音交互：实时语音转文字 → AI 回复 → TTS 播放
3. 视频分析：直播/录像内容理解和总结
4. 设计稿转代码：Vision API 识别 UI → 生成 React 组件
5. AR/VR 结合：场景理解 + 实时交互

技术实现：
1. Vision（图片）：
- GPT-4V / Claude 3.5 的图片输入
- 前端：canvas 截图 → base64 → API
- 用途：UI 审查、无障碍检查、截图搜索

2. 语音：
- Web Speech API（浏览器原生）
- Whisper API（OpenAI，更准确）
- 前端：MediaRecorder → Blob → API
- 实时转录：WebSocket 流式传输

3. 视频：
- 抽帧 → 图片分析
- 字幕生成：音轨提取 → Whisper
- 内容理解：关键帧 + Vision API

RN 中的应用：
- react-native-vision-camera + 实时 AI 分析
- expo-speech / react-native-tts
- 端上模型实时推理（ExecuTorch）`,
    oralAnswer: `多模态 AI 就是同时处理文本、图像、音频、视频的理解与生成。

前端应用场景有：图片理解（上传截图让 AI 分析内容或生成代码）、语音交互（实时语音转文字加 AI 回复加 TTS）、视频分析（内容总结）、设计稿转代码（Vision API 识别 UI 生成 React 组件）。

技术实现方面：图片用 GPT-4V/Claude 的图片输入，前端用 canvas 截图转 base64 发给 API；语音可以用浏览器原生的 Web Speech API 或更准确的 Whisper API，用 MediaRecorder 录音转 Blob；视频通过抽帧做图片分析加音轨提取做字幕。

RN 中可以用 react-native-vision-camera 加实时 AI 分析、expo-speech 做语音、ExecuTorch 做端上实时推理。`,
  },
  {
    id: 910,
    category: 'AI 前端',
    difficulty: 'easy',
    question: '什么是 Embedding？在前端产品中有什么应用？',
    answer: `Embedding（向量嵌入）：将文本/图片等非结构化数据转为高维向量，语义相似的内容在向量空间中距离相近。

前端应用：
1. 语义搜索：用户输入转 Embedding → 在向量库中找相似内容（比关键词搜索更智能）
2. 推荐系统：用户兴趣向量 vs 内容向量 → 相似度推荐
3. 文档问答（RAG）：文档分块 Embedding → 用户提问时检索相关段落
4. 智能分类：文本向量聚类自动分类

前端实现：
- 调用 Embedding API（OpenAI text-embedding-3-small）
- 存入向量数据库（Pinecone/Supabase pgvector）
- 前端做相似度计算：余弦相似度
- 离线场景：transformers.js 在浏览器中生成 Embedding

成本注意：
- Embedding 调用成本远低于生成式 API
- 可以缓存已计算的向量
- 选择合适维度（更小 = 更快更便宜）`,
    oralAnswer: `Embedding 就是把文本、图片等非结构化数据转成高维向量，语义相似的内容在向量空间中距离更近。

前端应用有：语义搜索（比关键词搜索更智能，理解用户意图）、推荐系统（用户兴趣向量和内容向量做相似度匹配）、RAG 文档问答（文档分块做 Embedding，提问时检索相关段落）、智能分类（向量聚类自动分类）。

实现上：调用 Embedding API（如 OpenAI text-embedding-3-small）得到向量，存入向量数据库（Pinecone 或 Supabase pgvector），检索时计算余弦相似度。离线场景可以用 transformers.js 在浏览器中生成 Embedding。

成本方面 Embedding 调用远低于生成式 API，可以缓存已计算的向量，选择合适的维度能进一步降低成本。`,
  },
];
