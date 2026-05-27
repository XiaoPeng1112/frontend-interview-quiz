import React, { useState } from 'react';
import type { InterviewRecord } from '../services/gistSync';
import InterviewDetail from './InterviewDetail';
import './InterviewHistory.css';

interface Props {
  records: InterviewRecord[];
  onClear: () => void;
}

const InterviewHistory: React.FC<Props> = ({ records, onClear }) => {
  const [selectedRecord, setSelectedRecord] = useState<InterviewRecord | null>(null);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // 详情页
  if (selectedRecord) {
    return (
      <InterviewDetail
        record={selectedRecord}
        onBack={() => setSelectedRecord(null)}
      />
    );
  }

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

          return (
            <div
              key={record.id}
              className="history-card clickable"
              onClick={() => setSelectedRecord(record)}
            >
              <div className="history-card-top">
                <span className="history-date">
                  {new Date(record.date).toLocaleDateString('zh-CN', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
                <div className="history-card-top-right">
                  <span className="history-category">{record.category}</span>
                  <span className="history-enter-icon">→</span>
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
          );
        })}
      </div>
    </div>
  );
};

export default InterviewHistory;
