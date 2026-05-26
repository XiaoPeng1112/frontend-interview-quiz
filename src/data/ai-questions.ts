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
  },
];
