import React, { useState, useCallback, useMemo } from 'react';
import { questions, categories } from '../data/questions';
import type { Question } from '../data/questions';
import './ReviewAnalysis.css';

const WORKER_BASE_URL = 'https://interview-quiz-oauth.2432573771.workers.dev';

// AI 分析返回的结构
interface AIAnalysis {
  extractedTopics: string[];
  questions: { question: string; evaluation: string; suggestion: string }[];
  weakPoints: string[];
  summary: string;
  recommendKeywords: string[];
}

interface AnalysisResult {
  id: string;
  date: string;
  source: 'audio' | 'document' | 'text';
  fileName?: string;
  rawContent: string;
  extractedTopics: string[];
  matchedQuestions: Question[];
  weakPoints: string[];
  summary: string;
  aiQuestions?: { question: string; evaluation: string; suggestion: string }[];
}

const STORAGE_KEY = 'interview-review-analyses';

function loadAnalyses(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveAnalyses(data: AnalysisResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 根据 AI 返回的关键词匹配题库题目
function matchQuestionsFromKeywords(keywords: string[], topics: string[]): Question[] {
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  const scored = questions
    .map(q => {
      let score = 0;
      const qText = (q.question + ' ' + q.answer + ' ' + q.category).toLowerCase();
      // 关键词匹配
      for (const kw of lowerKeywords) {
        if (qText.includes(kw)) score += 3;
      }
      // 分类匹配
      if (topics.includes(q.category)) score += 5;
      return { question: q, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(item => item.question);
  return scored;
}

const ReviewAnalysis: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>(loadAnalyses);
  const [inputMode, setInputMode] = useState<'idle' | 'text' | 'analyzing' | 'result' | 'error'>('idle');
  const [textInput, setTextInput] = useState('');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // AI 智能分析
  const analyzeContent = useCallback(async (content: string, source: 'audio' | 'document' | 'text', fileName?: string) => {
    setInputMode('analyzing');
    setErrorMsg('');

    try {
      const res = await fetch(`${WORKER_BASE_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          categories: categories.filter(c => c !== '全部'),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `请求失败 (${res.status})`);
      }

      const data = await res.json();

      if (!data.success || !data.analysis) {
        throw new Error('AI 返回数据格式异常');
      }

      const ai: AIAnalysis = data.analysis;

      // 如果 AI 解析失败（返回了 raw 文本）
      if ((ai as any).parseError) {
        throw new Error('AI 返回内容无法解析，请重试');
      }

      // 根据 AI 推荐关键词匹配题库
      const matchedQuestions = matchQuestionsFromKeywords(
        ai.recommendKeywords || [],
        ai.extractedTopics || []
      );

      const result: AnalysisResult = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: new Date().toISOString(),
        source,
        fileName,
        rawContent: content.slice(0, 2000),
        extractedTopics: ai.extractedTopics || [],
        matchedQuestions,
        weakPoints: ai.weakPoints || [],
        summary: ai.summary || '分析完成',
        aiQuestions: ai.questions || [],
      };

      setCurrentResult(result);
      setInputMode('result');

      // 保存到历史
      const updated = [result, ...analyses].slice(0, 20);
      setAnalyses(updated);
      saveAnalyses(updated);
    } catch (err: any) {
      console.error('AI analysis error:', err);
      setErrorMsg(err.message || '分析失败，请检查网络连接后重试');
      setInputMode('error');
    }
  }, [analyses]);

  const handleTextSubmit = useCallback(() => {
    if (!textInput.trim()) return;
    analyzeContent(textInput.trim(), 'text');
  }, [textInput, analyzeContent]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    if (file.type.startsWith('audio/')) {
      // 音频暂不支持直接转写
      setInputMode('text');
      setTextInput(`[音频文件: ${file.name}]\n\n请将录音内容转写为文字后粘贴在此处，然后点击"开始分析"。\n\n建议使用飞书妙记、讯飞听见等工具进行转写。`);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (text) {
          analyzeContent(text, 'document', file.name);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  }, [analyzeContent]);

  const handleDeleteAnalysis = useCallback((id: string) => {
    const updated = analyses.filter(a => a.id !== id);
    setAnalyses(updated);
    saveAnalyses(updated);
    if (currentResult?.id === id) {
      setCurrentResult(null);
      setInputMode('idle');
    }
  }, [analyses, currentResult]);

  const handleViewAnalysis = useCallback((analysis: AnalysisResult) => {
    setCurrentResult(analysis);
    setInputMode('result');
  }, []);

  const handleBack = useCallback(() => {
    setCurrentResult(null);
    setInputMode('idle');
    setTextInput('');
    setSelectedFile(null);
    setErrorMsg('');
  }, []);

  // 分类统计
  const topicStats = useMemo(() => {
    if (!currentResult) return [];
    const categoryCount: Record<string, number> = {};
    currentResult.matchedQuestions.forEach(q => {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
    });
    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }));
  }, [currentResult]);

  // 错误视图
  if (inputMode === 'error') {
    return (
      <div className="review-analysis">
        <div className="review-nav">
          <button className="review-back-btn" onClick={handleBack}>← 返回</button>
          <span className="review-nav-title">分析失败</span>
        </div>
        <div className="review-error">
          <div className="error-icon">⚠️</div>
          <h3>分析遇到问题</h3>
          <p className="error-msg">{errorMsg}</p>
          <p className="error-hint">可能原因：Cloudflare Workers AI 服务暂时不可用，或网络不稳定。</p>
          <div className="error-actions">
            <button className="review-submit-btn" onClick={() => {
              if (textInput.trim()) {
                analyzeContent(textInput.trim(), 'text');
              } else {
                setInputMode('text');
              }
            }}>
              重试
            </button>
            <button className="review-back-btn" onClick={handleBack}>返回首页</button>
          </div>
        </div>
      </div>
    );
  }

  // 分析结果视图
  if (inputMode === 'result' && currentResult) {
    return (
      <div className="review-analysis">
        <div className="review-nav">
          <button className="review-back-btn" onClick={handleBack}>← 返回</button>
          <span className="review-nav-title">AI 分析结果</span>
        </div>

        {/* 来源信息 */}
        <div className="review-source-info">
          <span className="source-icon">
            {currentResult.source === 'audio' ? '🎙️' : currentResult.source === 'document' ? '📄' : '✏️'}
          </span>
          <div className="source-detail">
            <span className="source-name">
              {currentResult.fileName || '文本输入'}
            </span>
            <span className="source-date">
              {new Date(currentResult.date).toLocaleDateString('zh-CN', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* AI 总结 */}
        <div className="review-summary-card">
          <div className="summary-icon">🤖</div>
          <p className="summary-text">{currentResult.summary}</p>
        </div>

        {/* 涉及领域 */}
        {currentResult.extractedTopics.length > 0 && (
          <div className="review-section">
            <h3 className="review-section-title">涉及知识领域</h3>
            <div className="review-topics">
              {currentResult.extractedTopics.map(topic => (
                <span key={topic} className="review-topic-tag">{topic}</span>
              ))}
            </div>
          </div>
        )}

        {/* AI 提取的面试题及评价 */}
        {currentResult.aiQuestions && currentResult.aiQuestions.length > 0 && (
          <div className="review-section">
            <h3 className="review-section-title">面试题目分析（AI 提取）</h3>
            <div className="ai-questions-list">
              {currentResult.aiQuestions.map((aq, idx) => (
                <div key={idx} className="ai-question-card">
                  <div className="ai-q-title">
                    <span className="ai-q-num">Q{idx + 1}</span>
                    {aq.question}
                  </div>
                  {aq.evaluation && (
                    <div className="ai-q-evaluation">
                      <span className="ai-q-label">表现评价：</span>
                      {aq.evaluation}
                    </div>
                  )}
                  {aq.suggestion && (
                    <div className="ai-q-suggestion">
                      <span className="ai-q-label">改进建议：</span>
                      {aq.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 知识点分布 */}
        {topicStats.length > 0 && (
          <div className="review-section">
            <h3 className="review-section-title">题库匹配分布</h3>
            <div className="review-topic-bars">
              {topicStats.map(({ category, count }) => (
                <div key={category} className="topic-bar-item">
                  <span className="topic-bar-label">{category}</span>
                  <div className="topic-bar-track">
                    <div
                      className="topic-bar-fill"
                      style={{ width: `${(count / currentResult.matchedQuestions.length) * 100}%` }}
                    />
                  </div>
                  <span className="topic-bar-count">{count}题</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 薄弱点建议 */}
        {currentResult.weakPoints.length > 0 && (
          <div className="review-section">
            <h3 className="review-section-title">AI 强化建议</h3>
            <div className="review-weak-list">
              {currentResult.weakPoints.map((point, idx) => (
                <div key={idx} className="review-weak-item">
                  <span className="weak-bullet">💡</span>
                  <span className="weak-text">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 推荐练习题目 */}
        {currentResult.matchedQuestions.length > 0 && (
          <div className="review-section">
            <h3 className="review-section-title">
              推荐练习（{currentResult.matchedQuestions.length}题）
            </h3>
            <p className="review-section-hint">根据 AI 分析结果从题库中匹配的相关题目</p>
            <div className="review-recommend-list">
              {currentResult.matchedQuestions.map(q => (
                <ReviewQuestionCard key={q.id} question={q} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 分析中
  if (inputMode === 'analyzing') {
    return (
      <div className="review-analysis">
        <div className="review-analyzing">
          <div className="analyzing-spinner" />
          <h3>AI 正在分析面试内容...</h3>
          <p>AI 正在识别知识点、评估表现、生成建议</p>
          <p className="analyzing-hint">通常需要 5-15 秒</p>
        </div>
      </div>
    );
  }

  // 文本输入模式
  if (inputMode === 'text') {
    return (
      <div className="review-analysis">
        <div className="review-nav">
          <button className="review-back-btn" onClick={handleBack}>← 返回</button>
          <span className="review-nav-title">输入面试记录</span>
        </div>

        <div className="review-text-input-area">
          <textarea
            className="review-textarea"
            placeholder={"在这里粘贴你的面试记录...\n\n例如：\n- 面试官问了闭包的原理，我回答了作用域链但不太确定垃圾回收的部分\n- 问了React Fiber架构，我只说了时间切片\n- 让手写一个Promise.all，我写出来了但边界情况没考虑\n- 问了HTTP缓存策略，强缓存和协商缓存的区别\n- 讨论了首屏性能优化方案"}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={12}
            autoFocus
          />
          <div className="review-text-actions">
            <span className="text-char-count">{textInput.length} 字</span>
            <button
              className="review-submit-btn"
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
            >
              🤖 AI 分析
            </button>
          </div>
        </div>

        <div className="review-tips">
          <h4>写什么内容效果更好？</h4>
          <p>尽量描述面试官的具体问题、你的回答要点、不确定的地方。AI 会帮你评估表现并给出改进建议。内容越详细，分析越精准。</p>
        </div>
      </div>
    );
  }

  // idle 模式 - 主页
  return (
    <div className="review-analysis">
      <div className="review-header">
        <div className="review-header-icon">🤖</div>
        <h2>AI 面试复盘</h2>
        <p className="review-desc">上传面试记录，AI 智能分析薄弱点并推荐针对性练习</p>
      </div>

      {/* 上传/输入区域 */}
      <div className="review-upload-section">
        <div className="upload-card" onClick={() => setInputMode('text')}>
          <span className="upload-card-icon">✏️</span>
          <span className="upload-card-title">文本记录</span>
          <span className="upload-card-desc">粘贴面试笔记或复盘记录</span>
        </div>

        <label className="upload-card">
          <input
            type="file"
            accept=".txt,.md,.doc,.docx,.pdf"
            className="upload-file-input"
            onChange={handleFileUpload}
          />
          <span className="upload-card-icon">📄</span>
          <span className="upload-card-title">上传文档</span>
          <span className="upload-card-desc">支持 txt、markdown 等</span>
        </label>

        <label className="upload-card">
          <input
            type="file"
            accept="audio/*"
            className="upload-file-input"
            onChange={handleFileUpload}
          />
          <span className="upload-card-icon">🎙️</span>
          <span className="upload-card-title">上传录音</span>
          <span className="upload-card-desc">建议先转写为文字</span>
        </label>
      </div>

      {/* AI 能力说明 */}
      <div className="review-guide">
        <h3 className="guide-title">AI 能帮你做什么</h3>
        <div className="guide-steps">
          <div className="guide-step">
            <span className="guide-step-num">🔍</span>
            <div className="guide-step-content">
              <span className="guide-step-title">提取面试题</span>
              <span className="guide-step-desc">从你的记录中智能识别面试官问了哪些问题</span>
            </div>
          </div>
          <div className="guide-step">
            <span className="guide-step-num">📝</span>
            <div className="guide-step-content">
              <span className="guide-step-title">评估表现</span>
              <span className="guide-step-desc">分析你的回答质量，指出薄弱环节</span>
            </div>
          </div>
          <div className="guide-step">
            <span className="guide-step-num">💡</span>
            <div className="guide-step-content">
              <span className="guide-step-title">改进建议</span>
              <span className="guide-step-desc">给出具体的学习建议和推荐练习题</span>
            </div>
          </div>
        </div>
      </div>

      {/* 使用提示 */}
      <div className="review-tips" style={{ marginTop: 16 }}>
        <h4>注意事项</h4>
        <p>AI 分析由 Cloudflare Workers AI 免费提供支持，无需梯子，国内可直接使用。分析结果仅供参考，建议结合自身情况进行学习规划。</p>
      </div>

      {/* 历史分析记录 */}
      {analyses.length > 0 && (
        <div className="review-history-section">
          <h3 className="review-section-title">分析记录（{analyses.length}）</h3>
          <div className="review-history-list">
            {analyses.map(analysis => (
              <div key={analysis.id} className="review-history-card">
                <div
                  className="review-history-main"
                  onClick={() => handleViewAnalysis(analysis)}
                >
                  <div className="history-card-left">
                    <span className="history-source-icon">
                      {analysis.source === 'audio' ? '🎙️' : analysis.source === 'document' ? '📄' : '✏️'}
                    </span>
                    <div className="history-card-info">
                      <span className="history-card-name">
                        {analysis.fileName || '文本记录'}
                      </span>
                      <span className="history-card-meta">
                        {new Date(analysis.date).toLocaleDateString('zh-CN', {
                          month: 'short', day: 'numeric'
                        })}
                        {' · '}
                        {analysis.extractedTopics.slice(0, 3).join('、') || '综合'}
                        {' · '}
                        {analysis.matchedQuestions.length}题匹配
                      </span>
                    </div>
                  </div>
                  <span className="history-card-arrow">→</span>
                </div>
                <button
                  className="history-delete-btn"
                  onClick={(e) => { e.stopPropagation(); handleDeleteAnalysis(analysis.id); }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 推荐题目卡片子组件
const ReviewQuestionCard: React.FC<{ question: Question }> = ({ question }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`review-q-card ${expanded ? 'expanded' : ''}`}>
      <div className="review-q-header" onClick={() => setExpanded(!expanded)}>
        <div className="review-q-info">
          <span className="review-q-category">{question.category}</span>
          <span className={`review-q-difficulty ${question.difficulty}`}>{question.difficulty}</span>
        </div>
        <span className={`review-q-expand ${expanded ? 'open' : ''}`}>▾</span>
      </div>
      <div className="review-q-title" onClick={() => setExpanded(!expanded)}>
        {question.question}
      </div>
      {expanded && (
        <div className="review-q-answer">
          <div className="review-q-answer-label">参考答案</div>
          <div className="review-q-answer-content">{question.answer}</div>
          {question.oralAnswer && (
            <>
              <div className="review-q-answer-label oral">口语化回答</div>
              <div className="review-q-answer-content oral">{question.oralAnswer}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewAnalysis;
