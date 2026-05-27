import React from 'react';
import './BottomBar.css';

export type TabKey = 'library' | 'mock' | 'favorites';

interface Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'library', label: '题库', icon: '📚' },
  { key: 'mock', label: '模拟面试', icon: '🎯' },
  { key: 'favorites', label: '收藏', icon: '⭐' },
];

const BottomBar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`bottom-bar-item ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          <span className="bottom-bar-icon">{tab.icon}</span>
          <span className="bottom-bar-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomBar;
