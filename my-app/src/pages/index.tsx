// pages/index.tsx

import React from 'react';
import KnowledgeGraph from './components/KnowledgeGraph';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Knowledge Graph</h1>
      <KnowledgeGraph />
    </div>
  );
};

export default HomePage;
