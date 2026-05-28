import { Question } from './types';

export const aiAdvancedQuestions: Question[] = [
  {
    id: 1301,
    category: 'AI Native',
    difficulty: 'hard',
    question: 'MCP（Model Context Protocol）协议是什么？它解决了什么问题？前端如何接入？',
    answer: `MCP（Model Context Protocol）：Anthropic 提出的开放协议，标准化 AI 模型与外部工具/数据源的连接方式。

解决的核心问题：
- 每个 AI 应用都要为每个工具写定制化集成代码（N×M 问题）
- MCP 将其简化为 N+M（客户端实现协议 + 服务端实现协议）

协议架构：
┌─────────────┐     MCP协议      ┌─────────────┐
│ MCP Client  │ ←─────────────→ │ MCP Server  │
│（AI 应用侧） │   JSON-RPC 2.0  │（工具/数据侧）│
└─────────────┘                  └─────────────┘

核心概念：
1. Resources：暴露数据/文件给模型读取（类比 REST GET）
2. Tools：让模型调用外部功能（类比 Function Calling）
3. Prompts：预定义 Prompt 模板，规范交互模式
4. Sampling：服务端请求模型生成内容（反向调用）

传输方式：
- stdio：本地进程通信（桌面工具常用）
- HTTP + SSE：远程服务（Web 场景）
- WebSocket：双向实时通信

前端接入方式：
1. 作为 MCP Client：
- 集成 @modelcontextprotocol/sdk
- 连接多个 MCP Server（文件系统/数据库/API）
- 将 MCP Tools 转化为 LLM 的 function calling schema

2. 作为 MCP Server：
- 将前端应用能力封装为 MCP Server
- 例：暴露「获取页面状态」「执行 UI 操作」等 Tool
- 让 AI 可以读取和操作前端应用

实际应用场景：
- IDE 插件：读取代码上下文 + 执行重构操作
- 企业工具：连接内部 API/数据库/文档系统
- 自动化：AI 编排多个系统完成复杂任务`,
    oralAnswer: `MCP 是 Anthropic 提出的开放协议，标准化 AI 模型与外部工具和数据源的连接方式。它解决的是 N 乘 M 的集成问题——原来每个 AI 应用要为每个工具写定制代码，MCP 简化为 N+M，客户端和服务端各自实现协议就行。

协议架构是 MCP Client（AI 应用侧）通过 JSON-RPC 2.0 与 MCP Server（工具侧）通信。核心概念有四个：Resources 暴露数据给模型读取，Tools 让模型调用外部功能，Prompts 是预定义模板，Sampling 是服务端反向请求模型生成内容。传输方式支持 stdio（本地）、HTTP+SSE（Web）、WebSocket。

前端既可以作为 MCP Client 连接多个 Server 获取工具列表传给 LLM，也可以作为 MCP Server 把前端应用能力暴露出去，让 AI 能读取和操作界面。`,
  },
  {
    id: 1302,
    category: 'AI Native',
    difficulty: 'hard',
    question: 'AI Agent Workflow 的架构设计有哪些模式？前端如何实现复杂的多步 Agent？',
    answer: `AI Agent Workflow 架构模式：

1. ReAct（Reasoning + Acting）：
- 最基础的 Agent 模式
- 循环：Thought → Action → Observation → Thought...
- 适合：简单工具调用场景
- 缺点：线性执行，无法并行/回溯

2. Plan-and-Execute：
- 先整体规划步骤，再逐步执行
- Planner（生成计划）→ Executor（执行步骤）→ Replanner（动态调整）
- 适合：复杂多步任务
- 优势：全局视角，减少错误累积

3. Multi-Agent 协作：
- 多个专业 Agent 协作完成任务
- 模式：分层（Manager-Worker）/ 平等协作 / 辩论式
- 适合：跨领域复杂任务
- 例：研究 Agent + 编码 Agent + Review Agent

4. 状态机模式（Graph-Based）：
- 将工作流建模为有向图
- 节点 = 状态/操作，边 = 条件转移
- 支持循环、分支、并行
- LangGraph 就是此模式的代表实现

前端实现要点：

1. 状态管理：
- Agent 执行状态（idle/thinking/acting/waiting）
- 工具调用结果缓存
- 会话历史 + 中间状态持久化

2. 流式 UI 展示：
- 实时展示 Agent 思考链
- 工具调用状态（发起/执行中/成功/失败）
- 可展开/折叠的步骤详情
- 进度条（已完成步骤 / 计划总步骤）

3. 人机交互节点：
- Agent 遇到歧义时请求用户确认
- 用户可随时中断/修正 Agent 方向
- 关键操作（如写入/删除）需人工审批

4. 错误处理：
- 单步重试 vs 整体重规划
- Token 超限时的摘要压缩
- 超时和无限循环检测（最大步数限制）`,
    oralAnswer: `Agent Workflow 有四种主要架构模式。

ReAct 是最基础的，循环执行 Thought-Action-Observation，线性执行适合简单场景。Plan-and-Execute 先整体规划再逐步执行，有全局视角减少错误累积。Multi-Agent 协作让多个专业 Agent 协作，适合跨领域复杂任务。状态机模式把工作流建模为有向图，支持循环、分支、并行，LangGraph 就是代表。

前端实现要点有四个：状态管理要跟踪 Agent 执行状态和中间结果；流式 UI 展示思考链、工具调用状态、可展开的步骤详情和进度条；人机交互节点让用户在关键操作时确认或修正方向；错误处理包括单步重试、Token 超限摘要压缩、最大步数限制防无限循环。`,
  },
  {
    id: 1303,
    category: 'AI Native',
    difficulty: 'hard',
    question: 'LangGraph 的核心概念和原理？如何用它构建可控的 AI 工作流？',
    answer: `LangGraph 核心概念：

基于有向图的 Agent 编排框架，让 AI 工作流像状态机一样精确可控。

核心抽象：
1. State（状态）：工作流的全局数据容器，各节点共享和更新
2. Node（节点）：执行单元，可以是 LLM 调用/工具调用/纯函数
3. Edge（边）：节点间的连接，支持条件路由
4. Graph（图）：完整的工作流定义

与 LangChain 的关系：
- LangChain：线性链式调用（Chain）
- LangGraph：图结构调用，支持循环、分支、并行

核心特性：
1. 条件路由（Conditional Edges）：
- 根据 LLM 输出动态选择下一步
- 例：if llm_output.tool_call → 工具节点, else → 结束节点

2. 循环支持：
- 可以从后续节点回到前面节点
- 实现 ReAct 循环、多轮迭代优化
- 设置最大循环次数防止死循环

3. 状态持久化（Checkpointing）：
- 每个节点执行后保存 State 快照
- 支持暂停/恢复执行（长任务、人工审批）
- 支持从任意节点重放

4. 人工介入（Human-in-the-loop）：
- interrupt_before / interrupt_after 配置
- 暂停执行等待人工审批
- 人工修改 State 后继续

前端集成实践：

1. 可视化构建：
- 拖拽式 Graph 编辑器（类似流程图工具）
- 节点类型面板 + 属性配置
- 实时预览和调试

2. 运行时展示：
- 图形化展示当前执行到哪个节点
- 各节点输入/输出实时显示
- 分支选择高亮当前路径

3. 调试能力：
- 单步执行（Step by Step）
- 断点（在某节点暂停）
- State 快照对比

适用场景：
- 复杂客服（多轮收集信息 → 决策 → 执行）
- 代码生成（规划 → 编码 → 测试 → 修复 循环）
- 数据分析（问题理解 → 查询生成 → 执行 → 可视化）`,
    oralAnswer: `LangGraph 是基于有向图的 Agent 编排框架，让 AI 工作流像状态机一样精确可控。

它有四个核心抽象：State 是全局数据容器，Node 是执行单元可以是 LLM 调用或工具调用，Edge 是节点间连接支持条件路由，Graph 是完整工作流定义。跟 LangChain 的区别是，LangChain 是线性链式调用，LangGraph 支持循环、分支和并行。

核心特性方面，条件路由可以根据 LLM 输出动态选择下一步。循环支持可以从后续节点回到前面实现 ReAct 循环。Checkpointing 每个节点执行后保存状态快照，支持暂停恢复。Human-in-the-loop 通过 interrupt_before/after 配置暂停等待人工审批。

前端集成主要是三块：可视化构建做拖拽式 Graph 编辑器；运行时展示当前执行到哪个节点、各节点输入输出；调试能力包括单步执行、断点和 State 快照对比。适用场景有复杂客服、代码生成和数据分析这些需要多步循环的任务。`,
  },
  {
    id: 1304,
    category: 'AI Native',
    difficulty: 'hard',
    question: 'AI Native 应用的前端架构应该怎么设计？与传统 CRUD 应用有什么根本性不同？',
    answer: `AI Native 应用的前端架构设计：

根本性差异：

传统 CRUD：
- 确定性交互：用户操作 → 确定性响应
- 同步为主：请求 → 响应（毫秒级）
- UI 固定：设计稿 → 还原
- 数据展示：获取数据 → 格式化展示

AI Native：
- 非确定性：同样输入可能不同输出
- 流式为主：请求 → 长时间流式生成（秒~分钟级）
- UI 动态：根据 AI 输出动态构造界面
- 内容生成：AI 产出非结构化/半结构化内容

架构设计：

1. 流式数据层：
- 传输：SSE/WebSocket 长连接
- 状态：StreamState = idle | streaming | paused | completed | error
- 缓冲：增量 token 聚合 + 批量渲染（避免逐字符 re-render）
- 中断：AbortController 随时取消

2. AI 交互层：
- 对话管理：消息列表 + 上下文窗口 + 历史摘要
- 工具调用：Function Call 结果展示和交互
- 多模态：文本/图片/文件统一消息模型

3. 动态 UI 层：
- AI 生成的 UI（Generative UI）：根据返回内容动态渲染组件
- 结构化输出解析：JSON Schema 校验 + 容错渲染
- 渐进式渲染：Markdown 增量解析 + 代码块流式高亮

4. 可靠性层：
- 重试策略：指数退避 + 断点续传
- 缓存：相同 Prompt 结果缓存（适用于确定性场景）
- 降级：AI 不可用时 → 规则兜底 / 人工介入
- 反馈循环：用户评价 → Prompt 优化 → 效果提升

5. 成本控制层：
- Token 用量监控和预算
- Prompt 精简和缓存
- 模型分级：简单任务用小模型，复杂任务用大模型
- 批量操作合并请求

技术栈推荐：
- Vercel AI SDK（统一多模型 + 流式 + React Hooks）
- LangChain.js（Agent/RAG/Chain）
- TanStack Query（AI 请求的缓存和状态管理）
- Zod（结构化输出校验）`,
    oralAnswer: `AI Native 应用和传统 CRUD 应用有根本性差异。传统应用是确定性交互，同步请求毫秒级响应，UI 固定还原设计稿。AI Native 是非确定性的，同样输入可能不同输出，流式生成需要秒到分钟级，UI 要根据 AI 输出动态构造。

架构设计上有五层。流式数据层用 SSE 或 WebSocket 长连接，状态包括 idle、streaming、paused、completed、error，通过增量 token 聚合批量渲染避免逐字符重渲染，AbortController 随时取消。AI 交互层管理对话消息列表、上下文窗口、工具调用和多模态。动态 UI 层做 Generative UI，根据返回内容动态渲染组件，结构化输出用 JSON Schema 校验加容错渲染，Markdown 增量解析。可靠性层做重试指数退避、缓存、降级兜底和反馈循环。成本控制层监控 Token 用量、Prompt 精简缓存、模型分级。

技术栈推荐 Vercel AI SDK 统一多模型流式加 React Hooks，LangChain.js 做 Agent 和 RAG，TanStack Query 管缓存状态，Zod 做结构化输出校验。`,
  },
  {
    id: 1305,
    category: 'AI Native',
    difficulty: 'hard',
    question: 'RAG（检索增强生成）系统的工程化实现有哪些关键挑战？前端如何优化 RAG 体验？',
    answer: `RAG 工程化关键挑战：

一、检索质量：

1. 分块策略（Chunking）：
- 固定长度切分 → 语义断裂
- 语义分块（按段落/标题/代码块）→ 更精确但实现复杂
- 递归分块：大块 → 检索 → 小块 → 精确定位
- Chunk 大小影响：太小丢失上下文，太大引入噪音

2. 向量检索优化：
- Embedding 模型选择（通用 vs 领域微调）
- 混合检索：向量检索 + 关键词检索（BM25）+ 重排序（Reranker）
- 多路召回 + 融合排序
- 元数据过滤：先缩小范围再向量搜索

3. 上下文组装：
- 检索到的 chunks 如何拼接？顺序？去重？
- 相关性阈值：低相关片段不要塞给模型
- Context Window 限制：优先放最相关内容

二、前端优化 RAG 体验：

1. 引用溯源 UI：
- 回答中标注引用来源 [1][2]
- 点击引用跳转到原文
- 高亮原文中被引用的段落
- 显示相关性评分/置信度

2. 反馈和迭代：
- 「回答有帮助」→ 正向信号
- 「答非所问」→ 触发追问或改进检索策略
- 「信息过时」→ 标记文档需要更新

3. 检索过程透明化：
- 展示「正在搜索相关文档...」
- 显示找到的相关片段预览
- 用户可以手动选择/排除某些来源

4. 上传和管理：
- 文件上传进度 + 处理状态（解析/分块/向量化）
- 知识库管理界面（增删改查文档）
- 向量化状态监控

5. 性能优化：
- 客户端缓存常用查询结果
- 预加载可能相关的文档预览
- 流式输出 + 引用延迟加载

三、RAG 评估指标：
- 检索准确率（Recall@K）
- 回答忠实度（是否基于检索内容）
- 回答相关性（是否回答了用户问题）
- 延迟（检索时间 + 生成时间）`,
    oralAnswer: `RAG 工程化有三大关键挑战。

第一是检索质量。分块策略很关键，固定长度切分会语义断裂，语义分块按段落标题切更精确但复杂，chunk 太小丢上下文太大引入噪音。向量检索要混合检索，向量加关键词 BM25 加 Reranker 重排序，还有元数据过滤先缩小范围。上下文组装要注意 chunks 拼接顺序、去重、相关性阈值过滤和 Context Window 限制。

第二是前端体验优化。引用溯源 UI 在回答中标注来源，点击跳转原文高亮引用段落。反馈机制让用户标记有帮助或答非所问来优化检索策略。检索过程透明化展示搜索进度和找到的片段预览，用户可以手动选择排除来源。文件上传要展示处理状态包括解析分块向量化。性能上做客户端缓存、预加载和流式输出加引用延迟加载。

第三是评估指标，包括检索准确率 Recall@K、回答忠实度是否基于检索内容、回答相关性、以及检索加生成的总延迟。`,
  },
  {
    id: 1306,
    category: 'AI Native',
    difficulty: 'hard',
    question: 'Function Calling 和 Tool Use 的实现原理？如何设计一个可扩展的工具系统？',
    answer: `Function Calling / Tool Use 原理：

工作流程：
1. 开发者定义工具 Schema（名称 + 描述 + 参数 JSON Schema）
2. 用户消息 + 工具列表一起发送给模型
3. 模型判断是否需要调用工具，输出结构化调用请求
4. 客户端执行工具，将结果返回模型
5. 模型根据结果生成最终回复

关键区别：
- Function Calling（OpenAI）：模型返回 function_call 字段
- Tool Use（Anthropic）：模型返回 tool_use content block
- 本质相同：模型生成结构化的工具调用意图

可扩展工具系统设计：

1. 工具注册中心：
interface Tool {
  name: string;
  description: string;           // 给 LLM 看的描述
  parameters: JSONSchema;        // 参数定义
  execute: (params) => Promise<ToolResult>;
  // 元信息
  category: string;
  requiresAuth: boolean;
  rateLimit?: number;
  timeout?: number;
}

const registry = new ToolRegistry();
registry.register(searchTool);
registry.register(calculatorTool);

2. 动态工具发现：
- 根据用户上下文/权限动态选择可用工具
- 避免一次性传递过多工具给模型（影响准确性）
- 工具分组/分层：常用工具优先

3. 执行层设计：
- 沙箱执行：工具代码在隔离环境运行
- 超时控制：每个工具最大执行时间
- 重试机制：失败时自动重试或交给模型决策
- 结果格式化：将原始结果转为模型友好的文本

4. 安全控制：
- 权限系统：不同用户可用不同工具
- 参数校验：Zod/JSON Schema 严格验证
- 操作确认：写操作（删除/修改）需用户确认
- 审计日志：记录所有工具调用

5. 前端展示：
- 工具调用卡片（展示调用了什么、参数、结果）
- 执行状态动画
- 错误时提供手动重试按钮
- 结果的富文本渲染（表格/图表/代码）

6. 与 MCP 的关系：
- MCP Server 暴露的 Tool 可以直接映射为 Function Calling Schema
- MCP 提供标准化的工具发现和调用协议
- 前端 MCP Client 连接多个 MCP Server → 统一工具列表 → 传给模型`,
    oralAnswer: `Function Calling 的工作流程是：开发者定义工具 Schema 包括名称描述和参数 JSON Schema，用户消息加工具列表一起发给模型，模型判断是否需要调用工具并输出结构化调用请求，客户端执行工具把结果返回模型，模型再根据结果生成最终回复。OpenAI 叫 Function Calling，Anthropic 叫 Tool Use，本质相同都是模型生成结构化的工具调用意图。

可扩展工具系统设计有六个要点。工具注册中心用 interface 定义 Tool 包含 name、description、parameters、execute 函数以及 category、requiresAuth、rateLimit 等元信息。动态工具发现根据用户上下文和权限选择可用工具，避免一次传太多给模型影响准确性。执行层要沙箱执行、超时控制、重试机制和结果格式化。安全控制做权限系统、参数 Zod 校验、写操作用户确认和审计日志。前端展示做工具调用卡片、执行状态动画、重试按钮和富文本渲染。

跟 MCP 的关系是，MCP Server 暴露的 Tool 可以直接映射为 Function Calling Schema，MCP 提供标准化的工具发现和调用协议，前端 MCP Client 连接多个 Server 统一工具列表传给模型。`,
  },
  {
    id: 1307,
    category: 'AI Native',
    difficulty: 'medium',
    question: 'LLM 应用中的 Prompt Engineering 高级技巧？如何系统性优化 Prompt？',
    answer: `高级 Prompt Engineering 技巧：

一、结构化 Prompt 设计：

1. System Prompt 分层：
- Role（角色定义）：专业背景、能力边界
- Context（上下文）：相关信息、约束条件
- Instructions（指令）：具体任务、步骤要求
- Output Format（输出格式）：JSON Schema/Markdown/代码
- Examples（少样本示例）：输入输出示例对

2. 思维链（Chain of Thought）：
- 基础 CoT：「请一步步思考」
- 结构化 CoT：「首先分析...然后...最后...」
- Self-Consistency：多次生成取多数
- Tree of Thought：探索多条推理路径

3. 上下文管理：
- 相关信息前置（模型对开头内容注意力更高）
- 分隔符明确区分不同信息块
- 动态上下文：只注入当前任务相关的信息

二、系统性优化方法：

1. Prompt 版本管理：
- 每个 Prompt 有版本号
- 变更记录（what/why/结果）
- 回滚能力

2. 评估体系：
- 建立测试集（输入 + 预期输出/评判标准）
- 自动化评估：LLM-as-Judge / 规则匹配
- 人工评估：标注准确率/满意度

3. 迭代流程：
观察失败 case → 分析原因 → 修改 Prompt → 回归测试 → 发布

4. A/B 测试：
- 线上小流量对比不同 Prompt 版本
- 指标：准确率/用户满意度/Token 消耗

三、前端实践：

1. Prompt 模板引擎：
- 变量插值：{userName}、{currentData}
- 条件段落：if hasContext → 注入上下文
- 循环：遍历历史消息

2. 动态 Prompt 组装：
- 根据用户行为/上下文动态添加指令
- 根据模型返回质量动态调整温度和提示

3. Prompt 安全：
- 注入防护：过滤特殊指令字符
- 越狱检测：监控异常输出模式
- 输入长度限制 + 清洗`,
    oralAnswer: `高级 Prompt Engineering 主要分三部分。

结构化 Prompt 设计方面，System Prompt 要分层：Role 定义角色背景和能力边界，Context 提供相关信息和约束，Instructions 给具体任务步骤，Output Format 定义输出格式比如 JSON Schema，Examples 给输入输出示例对。思维链技巧包括基础 CoT「请一步步思考」、结构化 CoT 给明确步骤、Self-Consistency 多次生成取多数、Tree of Thought 探索多条推理路径。上下文管理要相关信息前置因为模型对开头注意力更高，用分隔符区分信息块。

系统性优化方法有四步：Prompt 版本管理给每个 Prompt 版本号和变更记录；评估体系建立测试集用 LLM-as-Judge 自动评估加人工标注；迭代流程是观察失败 case、分析原因、修改 Prompt、回归测试、发布；A/B 测试线上小流量对比不同版本看准确率和 Token 消耗。

前端实践主要是 Prompt 模板引擎做变量插值和条件段落，动态组装根据上下文添加指令，安全方面做注入防护、越狱检测和输入清洗。`,
  },
  {
    id: 1308,
    category: 'AI Native',
    difficulty: 'hard',
    question: '端侧 AI（On-Device AI）在移动端的技术方案和前端 AI 功能开发实践？',
    answer: `端侧 AI 技术方案：

一、为什么要端侧推理：
- 隐私：数据不出设备
- 延迟：无网络往返，<100ms 推理
- 成本：无服务器调用费用
- 离线：无网环境可用

二、移动端推理框架：

1. ExecuTorch（Meta，RN 首选）：
- PyTorch 模型直接导出到移动端
- 支持 iOS（CoreML/Metal）和 Android（NNAPI/QNN）
- 与 RN 集成：react-native-executorch

2. Core ML（iOS）：
- Apple 原生推理框架
- 支持 Neural Engine 加速
- 模型格式：.mlpackage / .mlmodel

3. TFLite / MediaPipe（Google）：
- 跨平台移动端推理
- react-native-fast-tflite 桥接

4. ONNX Runtime Mobile：
- 统一模型格式
- 跨平台统一 API

三、模型优化（移动端部署必需）：

1. 量化（Quantization）：
- INT8 量化：精度损失小，速度提升 2-4x
- INT4 量化：适合大语言模型，体积减 75%
- 动态量化 vs 静态量化

2. 蒸馏（Distillation）：
- 大模型 → 小模型知识迁移
- 保留核心能力，大幅减小体积

3. 剪枝（Pruning）：
- 移除不重要的权重/神经元
- 结构化剪枝更适合移动端加速

四、前端 AI 功能开发实践：

1. 文本类：
- 端侧文本分类/情感分析
- 输入联想/智能纠错
- 本地语义搜索

2. 图像类：
- 实时物体检测（相机流）
- OCR 文字识别
- 图片分类/标签

3. 语音类：
- 语音唤醒（小模型常驻）
- 本地语音转文字
- 声纹识别

4. 混合策略（推荐）：
- 简单任务端侧处理（分类/检测/补全）
- 复杂任务云端处理（生成/推理/创作）
- 网络可用时云端 → 无网时端侧降级

RN 集成示例：
- react-native-executorch 加载模型
- Camera + 实时推理（每帧检测）
- 输入框 + 端侧文本补全
- 离线翻译/摘要`,
    oralAnswer: `端侧 AI 有四个核心优势：隐私数据不出设备、延迟小于 100ms 无网络往返、无服务器调用成本、离线可用。

移动端推理框架方面，ExecuTorch 是 Meta 的方案也是 RN 首选，PyTorch 模型直接导出到移动端，支持 iOS CoreML/Metal 和 Android NNAPI，有 react-native-executorch 集成。Core ML 是 Apple 原生框架支持 Neural Engine 加速。TFLite 和 MediaPipe 是 Google 的跨平台方案。ONNX Runtime Mobile 提供统一模型格式和跨平台 API。

模型优化是移动端部署必需的，包括量化把 INT8 或 INT4 量化体积大幅缩小速度提升几倍，蒸馏从大模型迁移知识到小模型，剪枝移除不重要的权重。

前端 AI 功能开发实践分几类：文本类做端侧分类情感分析、输入联想纠错、本地语义搜索；图像类做实时物体检测 OCR 图片分类；语音类做语音唤醒、本地语音转文字、声纹识别。推荐混合策略，简单任务端侧处理，复杂任务云端，网络可用时云端无网时端侧降级。`,
  },
  {
    id: 1309,
    category: 'AI Native',
    difficulty: 'medium',
    question: 'AI 应用中的流式输出（Streaming）有哪些工程化挑战？如何优化体验？',
    answer: `流式输出工程化挑战：

一、传输层挑战：

1. 协议选择：
- SSE（Server-Sent Events）：单向、HTTP/1.1 兼容、自动重连
- WebSocket：双向、低开销、但需要心跳维护
- Fetch + ReadableStream：灵活、支持 POST 请求体
- RN 场景：EventSource polyfill 或 fetch stream

2. 断线续传：
- 流式过程中网络中断如何恢复？
- 方案：服务端记录 offset，客户端带 last-event-id 重连
- 或：客户端定期保存已接收内容，重新请求时跳过已有部分

3. 背压处理：
- 服务端生成速度 > 前端处理速度
- ReadableStream 天然支持背压
- 缓冲区设计：accumulate → batch render

二、渲染层挑战：

1. 增量渲染性能：
- 每个 token 触发 setState → 大量 re-render
- 优化：批量更新（accumulate 100ms 的 token 一次渲染）
- requestAnimationFrame 节流
- useRef 存储内容 + 定时同步到 state

2. Markdown 流式解析：
- 不完整 Markdown 如何渲染？
- 未闭合代码块/表格/列表的处理
- 增量解析：只解析新增部分
- 方案：remark-parse streaming mode / 自定义 parser

3. 代码块处理：
- 语言检测等代码块完整后再高亮
- 或：流式高亮（语法高亮允许增量）
- 复制按钮在代码块完成后显示

三、体验优化：

1. 感知性能：
- 打字机效果（即使 token 到达是突发的，也匀速展示）
- 光标闪烁/动画表示「正在思考」
- 首 token 时间优化（<500ms 体感流畅）

2. 交互优化：
- 随时中断生成（Stop 按钮 + AbortController）
- 生成过程中仍可滚动/复制
- 自动滚动 + 用户手动滚动后停止自动滚动

3. 错误处理：
- 生成中途出错：保留已生成内容 + 重试按钮
- 超时：前端设置最大等待时间
- Token 超限：提示并提供摘要/重新开始选项

4. 移动端特有优化（RN）：
- 长文本 FlatList 虚拟化渲染
- 减少主线程压力：UI 更新批量化
- 内存控制：超长对话定期清理旧消息`,
    oralAnswer: `流式输出工程化有三层挑战。

传输层方面，协议选择有 SSE 单向自动重连、WebSocket 双向低开销需心跳、Fetch ReadableStream 灵活支持 POST。断线续传方案是服务端记录 offset 客户端带 last-event-id 重连，或客户端定期保存已接收内容重新请求跳过已有部分。背压处理用 ReadableStream 天然支持，设计缓冲区 accumulate 再 batch render。

渲染层方面，每个 token 触发 setState 会大量重渲染，优化是批量更新累积 100ms 的 token 一次渲染，用 requestAnimationFrame 节流或 useRef 存内容定时同步。Markdown 流式解析要处理不完整的代码块表格列表，用增量解析只解析新增部分。代码块等完整后再高亮或流式高亮。

体验优化方面，感知性能用打字机效果匀速展示即使 token 突发到达，光标闪烁表示思考中，首 token 时间控制在 500ms 内。交互上支持随时中断用 AbortController，自动滚动但用户手动滚动后停止。错误处理保留已生成内容加重试按钮。RN 移动端特别要注意长文本 FlatList 虚拟化、UI 更新批量化和超长对话内存控制。`,
  },
  {
    id: 1310,
    category: 'AI Native',
    difficulty: 'hard',
    question: 'AI 前端的未来方向有哪些？什么是 Generative UI？前端工程师如何转型 AI 方向？',
    answer: `AI 前端未来方向：

一、Generative UI（生成式 UI）：

概念：AI 根据用户意图动态生成界面组件，而非预先设计固定页面。

实现方式：
1. Server Components + AI：
- AI 返回 React Server Component 流
- 直接渲染组件而非文本
- Vercel AI SDK 的 createStreamableUI

2. 结构化输出 + 组件映射：
- AI 返回 JSON Schema 描述 UI
- 前端根据 Schema 动态渲染组件库中的组件
- 类似 Low-Code 的渲染引擎

3. 代码生成 + 沙箱执行：
- AI 直接生成 React 组件代码
- 在沙箱中编译执行
- 示例：v0.dev 的原理

二、AI Agent IDE：
- 前端开发的 AI 助手不再是补全，而是自主完成任务
- 理解需求 → 设计架构 → 编写代码 → 自测 → 提交
- 前端工程师角色转变：从 coder → agent 调试者/架构师

三、多模态交互：
- 语音 + 视觉 + 文本统一交互
- 「看一下这个页面，帮我改一下标题颜色」
- 截图/录屏 → AI 理解 → 生成修改

四、端云协同智能：
- 端侧小模型处理实时任务（响应快、隐私）
- 云端大模型处理复杂推理（能力强）
- 智能路由：判断任务复杂度选择端/云

五、前端工程师 AI 转型路径：

1. 入门阶段（1-2 月）：
- 掌握 OpenAI/Claude API 调用
- 学会流式输出和 Prompt Engineering
- 用 Vercel AI SDK 做一个对话应用

2. 进阶阶段（2-3 月）：
- 理解 RAG 原理并实现完整系统
- 学习 Function Calling / Tool Use
- 掌握 LangChain.js / LangGraph

3. 深入阶段（3-6 月）：
- 设计复杂 Agent Workflow
- 理解 MCP 协议并实现 MCP Server
- 端侧 AI 集成（ExecuTorch/CoreML）
- AI 应用的评估和优化

4. 竞争力构建：
- AI + 前端的交叉能力稀缺
- 深入某个垂直领域（如 AI IDE / AI Design Tool）
- 开源项目贡献 + 技术文章输出
- 关注：AI SDK 生态 + 模型能力边界 + 产品感`,
    oralAnswer: `AI 前端未来有五个方向。

第一是 Generative UI，AI 根据用户意图动态生成界面组件而非预先固定页面。实现方式有三种：Server Components 加 AI 直接渲染组件流，Vercel AI SDK 的 createStreamableUI；结构化输出加组件映射，AI 返回 JSON Schema 前端动态渲染组件库；代码生成加沙箱执行，AI 直接生成 React 组件代码在沙箱编译执行，v0.dev 就是这个原理。

第二是 AI Agent IDE，前端开发的 AI 助手不再只是补全而是自主完成任务，从理解需求到设计架构到编写代码到自测提交，前端工程师角色转变为 Agent 调试者和架构师。第三是多模态交互，语音视觉文本统一，比如截图录屏让 AI 理解后生成修改。第四是端云协同智能，端侧小模型处理实时任务响应快保隐私，云端大模型处理复杂推理，智能路由判断任务复杂度选择端或云。

转型路径方面，入门 1-2 个月掌握 API 调用流式输出和 Prompt Engineering，做一个对话应用。进阶 2-3 个月学 RAG、Function Calling、LangChain.js。深入 3-6 个月设计 Agent Workflow、实现 MCP Server、端侧 AI 集成。竞争力构建核心是 AI 加前端的交叉能力稀缺，深入某个垂直领域做开源和技术输出。`,
  },
];
