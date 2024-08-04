import { useCallback, useState } from 'react';
import {
  Handle, Position
} from '@xyflow/react';
import { Button, Card } from 'antd';
import { GroupOutlined, GlobalOutlined, HddOutlined } from '@ant-design/icons';
import './index.less';

const handleStyle = { left: 10 };

function TextUpdaterNode({ data, isConnectable }) {
  const [val, setVal] = useState(data.value);
  const onChange = useCallback((evt) => {
    setVal(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text">文本:</label>
        <Button>123</Button>
        <input id="text" name="text" onChange={onChange} className="nodrag" value={val} />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

function LogoNode({ data, isConnectable }) {
    const { src, text } = data;
    return (
      <div className="flow-logo">
        <Handle
            type="source"
            position={Position.Bottom}
            id="a"
            // style={handleStyle}
            isConnectable={isConnectable}
        />
        <Handle
            type="source"
            position={Position.Bottom}
            id="b"
            isConnectable={isConnectable}
        />
        <div>
          <img src={src} />
          <div className="flow-logo-text">{ text }</div>
        </div>
      </div>
    );
  }

const iconMap = {
    l1: <GroupOutlined />,
    l2: <HddOutlined />,
    l3: <GlobalOutlined />
}

  function BaseNode({ data, isConnectable }) {
    const { iconType, text, id, type, noHandle, link } = data;
    return (
      <div className="flow-base-node">
        {
            noHandle ? null :
            <>
                <Handle
                    type="target"
                    position={Position.Top}
                    id={id}
                    // style={handleStyle}
                    isConnectable={isConnectable}
                />
                <Handle
                    type="source"
                    position={Position.Top}
                    id={`${id}-tp`}
                    // style={handleStyle}
                    isConnectable={isConnectable}
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id={`${id}-btm`}
                    isConnectable={isConnectable}
                />
            </>
        }
         
        <Button type={type ? type : 'default'} onClick={() => {
            link && window.open(link);
        }}>
          { iconMap[iconType] }
          <div className="flow-logo-text">{ text }</div>
        </Button>
      </div>
    );
  }

  function ImgNode({ data, isConnectable }) {
    const { src, id } = data;
    return (
      <div className="flow-base-node">
         <Handle
            type="target"
            position={Position.Top}
            id={id}
            // style={handleStyle}
            isConnectable={isConnectable}
        />
        <Handle
            type="source"
            position={Position.Top}
            id={id}
            // style={handleStyle}
            isConnectable={isConnectable}
        />
        <Card title="技术架构图" extra={<a href="https://dooring.vip/doc" target='_blank'>文档</a>} style={{ width: 500 }}>
            <img src={src} alt="" style={{width: '100%'}} />
        </Card>
      </div>
    );
  }


export {
    TextUpdaterNode,
    LogoNode,
    BaseNode,
    ImgNode
}