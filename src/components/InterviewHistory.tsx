import React, { useState } from 'react';
import { questions } from '../data/questions';
import type { InterviewRecord } from '../services/gistSync';
import './InterviewHistory.css';

interface Props {
  records: InterviewRecord[];
  onClear: () => void;
}

const InterviewHistory: React.FC<Props> = ({ records, onClear }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 3: return { text: '掌握', icon: '✅', cls: 'mastered' };
      case 2: return { text: '部分', icon: '🟡', cls: 'partial' };
      case 1: return { text: '不会', icon: '❌', cls: 'failed' };
      default: return { text: '未评', icon: '⏭️', cls: 'skipped' };
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  if (records.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty-icon">📝</div>
        <p>暂无面试记录</p>
        <p className="history-empty-hint">完成模拟面试后记录会自动保存</p>
      </div>
    );
  }

  return (
    <div className="interview-history">
      <div className="history-header">
        <h3>面试记录（{records.length}）</h3>
        {records.length > 0 && (
          <button className="history-clear-btn" onClick={onClear}>清空</button>
        )}
      </div>
      <div className="history-list">
        {records.map(record => {
          const scoreRate = record.totalQuestions > 0
            ? Math.round((record.masteredCount / record.totalQuestions) * 100)
            : 0;
          const isExpanded = expandedId === record.id;

          return (
            <div key={record.id} className={`history-card ${isExpanded ? 'expanded' : ''}`}>
              <div className="history-card-clickable" onClick={() => toggleExpand(record.id)}>
                <div className="history-card-top">
                  <span className="history-date">
                    {new Date(record.date).toLocaleDateString('zh-CN', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  <div className="history-card-top-right">
                    <span className="history-category">{record.category}</span>
                    <span className={`history-expand-icon ${isExpanded ? 'open' : ''}`}>▾</span>
                  </div>
                </div>
                <div className="history-card-stats">
                  <div className="history-stat">
                    <span className="history-stat-val">{record.totalQuestions}</span>
                    <span className="history-stat-label">题</span>
                  </div>
                  <div className="history-stat">
                    <span className="history-stat-val">{formatTime(record.elapsed)}</span>
                    <span className="history-stat-label">用时</span>
                  </div>
                  <div className="history-stat">
                    <span className="history-stat-val score-rate">{scoreRate}%</span>
                    <span className="history-stat-label">掌握率</span>
                  </div>
                </div>
                <div className="history-card-bar">
                  <span className="bar-mastered" style={{ width: `${(record.masteredCount / record.totalQuestions) * 100}%` }} />
                  <span className="bar-partial" style={{ width: `${(record.partialCount / record.totalQuestions) * 100}%` }} />
                  <span className="bar-failed" style={{ width: `${(record.failedCount / record.totalQuestions) * 100}%` }} />
                </div>
              </div>

              {/* 展开详情 */}
              {isExpanded && record.questionIds && (
                <div className="history-detail">
                  <div className="history-detail-title">答题详情</div>
                  <div className="history-detail-list">
                    {record.questionIds.map((qId, idx) => {
                      const q = questions.find(item => item.id === qId);
                      const scoreInfo = getScoreLabel(record.scores[idx]);
                      return (
                        <div key={qId} className={`history-detail-item ${scoreInfo.cls}`}>
                          <span className="detail-index">{idx + 1}</span>
                          <span className="detail-question">
                            {q ? q.question : `题目 #${qId}`}
                          </span>
                          <span className={`detail-score ${scoreInfo.cls}`}>
                            {scoreInfo.icon}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewHistory;
