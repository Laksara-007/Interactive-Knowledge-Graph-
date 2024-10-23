// components/KnowledgeGraph.tsx

import React, { useEffect, useRef, useState } from 'react';
import { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-3d';
import dynamic from 'next/dynamic';
import * as THREE from 'three'; // Import THREE

// Dynamically import the ForceGraph3D component to prevent SSR issues
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

// Extend the NodeObject and LinkObject interfaces to include custom properties
interface MyNodeObject extends NodeObject {
  myId: string;
  name: string;
  highlighted?: boolean;
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
      { myId: 'node1', name: 'Document 1' },
      { myId: 'node2', name: 'Document 2' },
      { myId: 'node3', name: 'Document 3' },
      { myId: 'node4', name: 'Document 4' },
      { myId: 'node5', name: 'Document 5' },
      { myId: 'node6', name: 'Document 6' },
      { myId: 'node7', name: 'Document 7' },
      { myId: 'node8', name: 'Document 8' },
      { myId: 'node9', name: 'Document 9' },
      { myId: 'node10', name: 'Document 10' },
      { myId: 'node11', name: 'Document 11' },
      { myId: 'node12', name: 'Document 12' },
      { myId: 'node13', name: 'Document 13' },
      { myId: 'node14', name: 'Document 14' },
      { myId: 'node15', name: 'Document 15' },
    ].map((node) => ({
      ...node,
      highlighted: highlightNodes.has(node.myId),
    }));

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
      typeof link.source === 'object' ? (link.source as MyNodeObject).myId : link.source;
    const targetId =
      typeof link.target === 'object' ? (link.target as MyNodeObject).myId : link.target;

    if (highlightNodes.has(sourceId) && highlightNodes.has(targetId)) {
      highlightLinks.add(`${sourceId}->${targetId}`);
    }
  });

  // Function to generate a unique identifier for each link
  const getLinkId = (link: MyLinkObject) => {
    const sourceId =
      typeof link.source === 'object' ? (link.source as MyNodeObject).myId : link.source;
    const targetId =
      typeof link.target === 'object' ? (link.target as MyNodeObject).myId : link.target;
    return `${sourceId}->${targetId}`;
  };

  // Function to create a card-like texture for each node
  const createNodeMaterial = (nodeId: string, nodeName: string, highlighted: boolean) => {
    const width = 256;
    const height = 128;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (context) {
      // Draw background with rounded corners
      const borderRadius = 20;

      // Set styles based on whether the node is highlighted
      context.fillStyle = highlighted
        ? '#ef233c' // Light blue background for highlighted nodes
        : '#edf2f4'; // Light gray background for other nodes
      context.strokeStyle = 'rgba(0, 0, 0, 1)'; // Black border
      context.lineWidth = 4;

      // Function to draw rounded rectangle
      function roundRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      // Draw the rounded rectangle (background and border)
      roundRect(context, 0, 0, width, height, borderRadius);
      context.fill();
      context.stroke();

      // Draw title (id)
      context.font = 'bold 24px Arial';
      context.fillStyle = 'black';
      context.textAlign = 'center';
      context.fillText(nodeId, width / 2, 40);

      // Draw body (name)
      context.font = '20px Arial';
      context.fillStyle = 'black';
      context.fillText(nodeName, width / 2, 80);
    }

    const texture = new THREE.CanvasTexture(canvas);

    // Create sprite material
    const material = new THREE.SpriteMaterial({ map: texture });

    return material;
  };

  // Node rendering function
  const nodeThreeObject = (node: NodeObject) => {
    const nodeObj = node as MyNodeObject;
    const nodeId = nodeObj.myId;
    const nodeName = nodeObj.name;
    const highlighted = nodeObj.highlighted || false;
    const material = createNodeMaterial(nodeId, nodeName, highlighted);

    // Create sprite
    const sprite = new THREE.Sprite(material);
    const scale = 15;
    sprite.scale.set(scale, scale * (128 / 256), 1); // Adjust scale based on texture aspect ratio

    return sprite;
  };

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={graphData}
      nodeId="myId" // Use custom node ID accessor
      linkWidth={(link) => (highlightLinks.has(getLinkId(link as MyLinkObject)) ? 4 : 1)}
      linkColor={(link) => (highlightLinks.has(getLinkId(link as MyLinkObject)) ? 'red' : '#999')}
      linkDirectionalParticles={(link) =>
        highlightLinks.has(getLinkId(link as MyLinkObject)) ? 4 : 0
      }
      linkDirectionalParticleWidth={2}
      linkDirectionalParticleColor={() => 'red'}
      linkDirectionalParticleSpeed={0.013}
      nodeThreeObject={nodeThreeObject}
    />
  );
};

export default KnowledgeGraph;
