import React from 'react';
import { ReadOutlined, AimOutlined, BarChartOutlined, StarOutlined } from '@ant-design/icons';
import './BottomBar.css';

export type TabKey = 'library' | 'mock' | 'review' | 'favorites';

interface Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'library', label: '题库', icon: <ReadOutlined /> },
  { key: 'mock', label: '模拟面试', icon: <AimOutlined /> },
  { key: 'review', label: '复盘', icon: <BarChartOutlined /> },
  { key: 'favorites', label: '收藏', icon: <StarOutlined /> },
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
