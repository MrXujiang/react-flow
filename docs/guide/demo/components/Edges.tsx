import {
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
    getBezierPath,
    useReactFlow,
  } from '@xyflow/react';

  import { Tag } from 'antd';
  
 function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  
    return (
      <>
        <BaseEdge id={id} path={edgePath} />
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
            onClick={() => {
            //   setEdges((es) => es.filter((e) => e.id !== id));
            }}
          >
            <Tag color="volcano">持续升级</Tag>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }

  export {
    CustomEdge,
  }