// components/KnowledgeGraph.tsx

import React, { useEffect, useRef, useState } from 'react';
import { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import dynamic from 'next/dynamic';

// Dynamically import the ForceGraph3D component to prevent SSR issues
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

// Extend the NodeObject and LinkObject interfaces to include custom properties
interface MyNodeObject extends NodeObject {
  id: string;
  name: string;
}

interface MyLinkObject extends LinkObject {
  source: string | MyNodeObject;
  target: string | MyNodeObject;
}

const KnowledgeGraph: React.FC = () => {
  const fgRef = useRef<ForceGraphMethods>();
  const [graphData, setGraphData] = useState<{ nodes: MyNodeObject[]; links: MyLinkObject[] }>({
    nodes: [],
    links: [],
  });

  // Hardcode the highlighted nodes
  const highlightNodes = new Set<string>(['node2', 'node3', 'node15', 'node5']);

useEffect(() => {
    // Hardcoded nodes
    const nodes: MyNodeObject[] = [
        { id: 'node1', name: 'Document 1' },
        { id: 'node2', name: 'Document 2' },
        { id: 'node3', name: 'Document 3' },
        { id: 'node4', name: 'Document 4' },
        { id: 'node5', name: 'Document 5' },
        { id: 'node6', name: 'Document 6' },
        { id: 'node7', name: 'Document 7' },
        { id: 'node8', name: 'Document 8' },
        { id: 'node9', name: 'Document 9' },
        { id: 'node10', name: 'Document 10' },
        { id: 'node11', name: 'Document 11' },
        { id: 'node12', name: 'Document 12' },
        { id: 'node13', name: 'Document 13' },
        { id: 'node14', name: 'Document 14' },
        { id: 'node15', name: 'Document 15' },
    ];

    // Hardcoded links
    const links: MyLinkObject[] = [
        { source: 'node1', target: 'node2' },
        { source: 'node2', target: 'node3' },
        { source: 'node3', target: 'node4' },
        { source: 'node4', target: 'node5' },
        { source: 'node5', target: 'node1' },
        { source: 'node2', target: 'node5' },
        { source: 'node3', target: 'node1' },
        { source: 'node6', target: 'node7' },
        { source: 'node7', target: 'node8' },
        { source: 'node8', target: 'node9' },
        { source: 'node9', target: 'node10' },
        { source: 'node10', target: 'node6' },
        { source: 'node11', target: 'node12' },
        { source: 'node12', target: 'node13' },
        { source: 'node13', target: 'node14' },
        { source: 'node14', target: 'node15' },
        { source: 'node15', target: 'node11' },
        { source: 'node15', target: 'node5' },
        { source: 'node5', target: 'node15' },
        { source: 'node1', target: 'node6' },
        { source: 'node2', target: 'node7' },
        { source: 'node3', target: 'node8' },
        { source: 'node13', target: 'node10' },
    ];

    setGraphData({ nodes, links });
}, []);

 
  // Derive highlighted links from highlighted nodes
  const highlightLinks = new Set<string>();
  graphData.links.forEach((link) => {
    const sourceId =
      typeof link.source === 'object' ? (link.source as MyNodeObject).id : link.source;
    const targetId =
      typeof link.target === 'object' ? (link.target as MyNodeObject).id : link.target;

    if (highlightNodes.has(sourceId) && highlightNodes.has(targetId)) {
      highlightLinks.add(`${sourceId}->${targetId}`);
    }
  });

  // Function to generate a unique identifier for each link
  const getLinkId = (link: MyLinkObject) => {
    const sourceId =
      typeof link.source === 'object' ? (link.source as MyNodeObject).id : link.source;
    const targetId =
      typeof link.target === 'object' ? (link.target as MyNodeObject).id : link.target;
    return `${sourceId}->${targetId}`;
  };

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={graphData}
      nodeAutoColorBy="id"
      linkWidth={(link) => (highlightLinks.has(getLinkId(link as MyLinkObject)) ? 4 : 1)}
      linkColor={(link) => (highlightLinks.has(getLinkId(link as MyLinkObject)) ? 'red' : '#999')}
      linkDirectionalParticles={(link) =>
        highlightLinks.has(getLinkId(link as MyLinkObject)) ? 4 : 0
      }
      linkDirectionalParticleWidth={2}
      linkDirectionalParticleColor={() => 'red'}
      linkDirectionalParticleSpeed={0.013}
      nodeThreeObject={(node) => {
        const nodeObj = node as MyNodeObject;
        const sprite = new SpriteText(nodeObj.name);
        sprite.color = highlightNodes.has(nodeObj.id) ? 'red' : 'gray';
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  );
};

export default KnowledgeGraph;
