import React from 'react';
import { changelog } from '../data/changelog';
import { LeftOutlined } from '@ant-design/icons';
import './Changelog.css';

interface Props {
  onBack: () => void;
}

const typeLabel: Record<string, { text: string; className: string }> = {
  feature: { text: '新功能', className: 'tag-feature' },
  optimize: { text: '优化', className: 'tag-optimize' },
  fix: { text: '修复', className: 'tag-fix' },
};

const Changelog: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="changelog-page">
      <div className="changelog-header">
        <button className="changelog-back" onClick={onBack}>
          <LeftOutlined /> 返回
        </button>
        <h2>更新日志</h2>
        <p className="changelog-desc">每次迭代的详细记录</p>
      </div>

      <div className="changelog-list">
        {changelog.map((entry) => (
          <div key={entry.version} className="changelog-entry">
            <div className="changelog-entry-header">
              <span className="changelog-version">v{entry.version}</span>
              <span className="changelog-date">{entry.date}</span>
            </div>
            <h3 className="changelog-title">{entry.title}</h3>
            <div className="changelog-changes">
              {entry.changes.map((change, idx) => {
                const tag = typeLabel[change.type];
                return (
                  <div key={idx} className="changelog-change-item">
                    <div className="changelog-change-header">
                      <span className={`changelog-type-tag ${tag.className}`}>
                        {tag.text}
                      </span>
                      <span className="changelog-change-desc">{change.description}</span>
                    </div>
                    {change.detail && (
                      <p className="changelog-change-detail">{change.detail}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Changelog;
