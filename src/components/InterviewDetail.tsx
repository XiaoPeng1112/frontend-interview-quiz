import React, { useState, useMemo } from 'react';
import { questions } from '../data/questions';
import type { InterviewRecord } from '../services/gistSync';
import './InterviewDetail.css';

interface Props {
  record: InterviewRecord;
  onBack: () => void;
}

const InterviewDetail: React.FC<Props> = ({ record, onBack }) => {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [filterScore, setFilterScore] = useState<number | 'all'>('all');

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const getScoreInfo = (score: number) => {
    switch (score) {
      case 3: return { text: '掌握', icon: '✅', cls: 'mastered', color: '#4ade80' };
      case 2: return { text: '部分掌握', icon: '🟡', cls: 'partial', color: '#fbbf24' };
      case 1: return { text: '不会', icon: '❌', cls: 'failed', color: '#f87171' };
      default: return { text: '未评', icon: '⏭️', cls: 'skipped', color: '#94a3b8' };
    }
  };

  // 构建题目详情列表
  const questionDetails = useMemo(() => {
    return record.questionIds.map((qId, idx) => {
      const q = questions.find(item => item.id === qId);
      return {
        index: idx,
        questionId: qId,
        question: q,
        score: record.scores[idx],
        userAnswer: record.userAnswers?.[idx] || '',
      };
    });
  }, [record]);

  // 按分类统计薄弱点
  const weakAnalysis = useMemo(() => {
    const categoryStats: Record<string, { total: number; failed: number; partial: number; mastered: number }> = {};

    questionDetails.forEach(({ question, score }) => {
      if (!question) return;
      const cat = question.category;
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, failed: 0, partial: 0, mastered: 0 };
      }
      categoryStats[cat].total++;
      if (score === 1) categoryStats[cat].failed++;
      else if (score === 2) categoryStats[cat].partial++;
      else if (score === 3) categoryStats[cat].mastered++;
    });

    return Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        ...stats,
        scoreRate: stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0,
      }))
      .sort((a, b) => a.scoreRate - b.scoreRate); // 薄弱的排前面
  }, [questionDetails]);

  // 筛选题目
  const filteredDetails = useMemo(() => {
    if (filterScore === 'all') return questionDetails;
    return questionDetails.filter(d => d.score === filterScore);
  }, [questionDetails, filterScore]);

  // 排序：不会的在前
  const sortedDetails = useMemo(() => {
    return [...filteredDetails].sort((a, b) => {
      const priority = (s: number) => s === 1 ? 0 : s === 2 ? 1 : s === 0 ? 2 : 3;
      return priority(a.score) - priority(b.score);
    });
  }, [filteredDetails]);

  const toggleExpand = (qId: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(questionDetails.map(d => d.questionId)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const scoreRate = record.totalQuestions > 0
    ? Math.round((record.masteredCount / record.totalQuestions) * 100)
    : 0;

  return (
    <div className="interview-detail">
      {/* 顶部导航 */}
      <div className="detail-nav">
        <button className="detail-back-btn" onClick={onBack}>← 返回</button>
        <span className="detail-nav-title">面试复盘</span>
        <span className="detail-nav-date">
          {new Date(record.date).toLocaleDateString('zh-CN', {
            month: 'short', day: 'numeric'
          })}
        </span>
      </div>

      {/* 总览卡片 */}
      <div className="detail-overview">
        <div className="overview-score-ring">
          <svg viewBox="0 0 80 80" className="score-ring-svg">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--card-border)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke={scoreRate >= 70 ? '#4ade80' : scoreRate >= 40 ? '#fbbf24' : '#f87171'}
              strokeWidth="6"
              strokeDasharray={`${scoreRate * 2.136} 213.6`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <span className="score-ring-text">{scoreRate}%</span>
          <span className="score-ring-label">掌握率</span>
        </div>
        <div className="overview-stats">
          <div className="overview-stat-row">
            <span className="overview-stat-icon">📝</span>
            <span className="overview-stat-text">{record.totalQuestions} 道题</span>
          </div>
          <div className="overview-stat-row">
            <span className="overview-stat-icon">⏱</span>
            <span className="overview-stat-text">{formatTime(record.elapsed)}</span>
          </div>
          <div className="overview-stat-row">
            <span className="overview-stat-icon">📂</span>
            <span className="overview-stat-text">{record.category}</span>
          </div>
          <div className="overview-stat-row scores-row">
            <span className="mini-badge mastered">✅ {record.masteredCount}</span>
            <span className="mini-badge partial">🟡 {record.partialCount}</span>
            <span className="mini-badge failed">❌ {record.failedCount}</span>
          </div>
        </div>
      </div>

      {/* 薄弱分析 */}
      {weakAnalysis.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">📊 知识点分析</h3>
          <p className="section-hint">按掌握率排序，薄弱领域在前</p>
          <div className="weak-analysis-list">
            {weakAnalysis.map(item => (
              <div key={item.category} className="weak-analysis-item">
                <div className="weak-item-top">
                  <span className="weak-category-name">{item.category}</span>
                  <span className={`weak-score-rate ${item.scoreRate >= 70 ? 'good' : item.scoreRate >= 40 ? 'mid' : 'bad'}`}>
                    {item.scoreRate}%
                  </span>
                </div>
                <div className="weak-item-bar">
                  <span className="bar-mastered" style={{ width: `${(item.mastered / item.total) * 100}%` }} />
                  <span className="bar-partial" style={{ width: `${(item.partial / item.total) * 100}%` }} />
                  <span className="bar-failed" style={{ width: `${(item.failed / item.total) * 100}%` }} />
                </div>
                <div className="weak-item-detail">
                  {item.failed > 0 && <span className="weak-tag failed">❌{item.failed}题不会</span>}
                  {item.partial > 0 && <span className="weak-tag partial">🟡{item.partial}题部分</span>}
                  {item.mastered > 0 && <span className="weak-tag mastered">✅{item.mastered}题掌握</span>}
                </div>
              </div>
            ))}
          </div>

          {/* 成长建议 */}
          {weakAnalysis.some(w => w.scoreRate < 50) && (
            <div className="growth-tip">
              <span className="growth-tip-icon">💡</span>
              <span className="growth-tip-text">
                建议重点复习：{weakAnalysis.filter(w => w.scoreRate < 50).map(w => w.category).join('、')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 逐题复盘 */}
      <div className="detail-section">
        <div className="section-header">
          <h3 className="section-title">📋 逐题复盘</h3>
          <div className="section-actions">
            <button className="section-action-btn" onClick={expandAll}>展开全部</button>
            <button className="section-action-btn" onClick={collapseAll}>收起全部</button>
          </div>
        </div>

        {/* 筛选 */}
        <div className="detail-filters">
          <button
            className={`detail-filter ${filterScore === 'all' ? 'active' : ''}`}
            onClick={() => setFilterScore('all')}
          >
            全部 ({questionDetails.length})
          </button>
          <button
            className={`detail-filter failed ${filterScore === 1 ? 'active' : ''}`}
            onClick={() => setFilterScore(1)}
          >
            ❌ 不会 ({record.failedCount})
          </button>
          <button
            className={`detail-filter partial ${filterScore === 2 ? 'active' : ''}`}
            onClick={() => setFilterScore(2)}
          >
            🟡 部分 ({record.partialCount})
          </button>
          <button
            className={`detail-filter mastered ${filterScore === 3 ? 'active' : ''}`}
            onClick={() => setFilterScore(3)}
          >
            ✅ 掌握 ({record.masteredCount})
          </button>
        </div>

        {/* 题目列表 */}
        <div className="detail-questions">
          {sortedDetails.map(({ index, questionId, question, score, userAnswer }) => {
            const scoreInfo = getScoreInfo(score);
            const isExpanded = expandedIds.has(questionId);

            return (
              <div key={questionId} className={`detail-q-card ${scoreInfo.cls}`}>
                <div className="detail-q-header" onClick={() => toggleExpand(questionId)}>
                  <div className="detail-q-left">
                    <span className="detail-q-num">#{index + 1}</span>
                    <span className={`detail-q-badge ${scoreInfo.cls}`}>{scoreInfo.icon} {scoreInfo.text}</span>
                  </div>
                  <span className={`detail-q-expand ${isExpanded ? 'open' : ''}`}>▾</span>
                </div>

                <div className="detail-q-title" onClick={() => toggleExpand(questionId)}>
                  {question ? question.question : `题目 #${questionId}`}
                </div>

                {question && question.category && (
                  <span className="detail-q-category">{question.category} · {question.difficulty}</span>
                )}

                {/* 展开详情 */}
                {isExpanded && (
                  <div className="detail-q-answer">
                    {/* 我的回答 */}
                    {userAnswer ? (
                      <>
                        <div className="answer-label user-answer">✏️ 我的回答</div>
                        <div className="answer-content user-answer">{userAnswer}</div>
                      </>
                    ) : (
                      <div className="answer-empty-hint">未填写回答</div>
                    )}

                    {/* 参考答案 */}
                    {question && (
                      <>
                        <div className="answer-label">📖 参考答案</div>
                        <div className="answer-content">{question.answer}</div>
                        {question.oralAnswer && (
                          <>
                            <div className="answer-label oral">🗣️ 口语化回答</div>
                            <div className="answer-content oral">{question.oralAnswer}</div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {sortedDetails.length === 0 && (
          <div className="detail-empty">该筛选条件下没有题目</div>
        )}
      </div>

      {/* 底部操作 */}
      <div className="detail-bottom">
        <button className="detail-bottom-btn" onClick={onBack}>返回记录列表</button>
      </div>
    </div>
  );
};

export default InterviewDetail;
