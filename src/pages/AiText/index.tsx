import React, { useState, useRef, useEffect } from 'react';
import {
  Tabs, Input, Button, Avatar, List, Typography, Image, message, Empty
} from 'antd';
import {
  ArrowUpOutlined, // GPT 同款发送图标
  UserOutlined,
  RobotOutlined,
  PictureOutlined,
  CommentOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import { generateAI } from '../../api/user';
import './index.css';

const { Text } = Typography;
const { TextArea } = Input;

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const AiStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(false);

  // 状态管理
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatListRef = useRef<HTMLDivElement>(null);

  // 其他 Tab 的状态 (文生图/图生图 略做保留，重点优化 Chat)
  const [t2iPrompt, setT2iPrompt] = useState('');
  const [t2iResult, setT2iResult] = useState<string[]>([]);
  const [i2iPrompt, setI2iPrompt] = useState('');
  const [refImgUrl, setRefImgUrl] = useState('');
  const [i2iResult, setI2iResult] = useState<string[]>([]);

  // 滚动到底部
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSubmit = async () => {
    let prompt = '';
    let refUrl = undefined;

    if (activeTab === 'chat') prompt = chatInput;
    else if (activeTab === 'text2img') prompt = t2iPrompt;
    else if (activeTab === 'img2img') { prompt = i2iPrompt; refUrl = refImgUrl; }

    if (!prompt.trim()) return;

    setLoading(true);

    if (activeTab === 'chat') {
      setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
      setChatInput('');
    }

    try {
      const res = await generateAI({
        task_type: activeTab,
        prompt: prompt,
        ref_image_url: refUrl,
      });

      if (activeTab === 'chat') {
        setMessages((prev) => [...prev, { role: 'ai', content: res as string }]);
      } else if (activeTab === 'text2img') {
        setT2iResult(res as string[]);
      } else if (activeTab === 'img2img') {
        setI2iResult(res as string[]);
      }
    } catch (error) {
      console.error(error);
      message.error('生成失败');
    } finally {
      setLoading(false);
    }
  };

  // 监听 Enter 键 (Shift+Enter 换行)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // --- 渲染聊天区域 ---
  const renderChat = () => (
    <div className="chat-content-area" ref={chatListRef}>
      {messages.length === 0 ? (
        <div className="gpt-welcome">
          <Avatar size={64} icon={<RobotOutlined />} style={{ background: '#fff', color: '#000', fontSize: 32, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
          <h2>有什么可以帮你的吗？</h2>
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={messages}
          split={false}
          renderItem={(msg) => (
            <div className={`gpt-message-row ${msg.role}`}>
              <div className="gpt-avatar">
                {msg.role === 'ai' ? <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#10a37f' }} /> : <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#999' }} />}
              </div>
              <div className="gpt-message-content">
                <div className="gpt-name">{msg.role === 'ai' ? 'ChatGPT' : 'You'}</div>
                <div className="gpt-text">{msg.content}</div>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );

  // --- 渲染文生图 (简化版，复用输入框逻辑) ---
  const renderText2Img = () => (
    <div className="chat-content-area" style={{ padding: 20 }}>
      {t2iResult.length > 0 ? (
        t2iResult.map((url, i) => <Image key={i} src={url} width={300} />)
      ) : (
        <Empty description="在下方输入描述，开始绘画" style={{ marginTop: 100 }} />
      )}
    </div>
  );

  // --- 渲染图生图 (简化版) ---
  const renderImg2Img = () => (
    <div className="chat-content-area" style={{ padding: 20 }}>
      <Input placeholder="请先在此输入参考图URL..." value={refImgUrl} onChange={e => setRefImgUrl(e.target.value)} style={{ marginBottom: 20 }} />
      {i2iResult.length > 0 && i2iResult.map((url, i) => <Image key={i} src={url} width={300} />)}
      {i2iResult.length === 0 && <Empty description="输入URL和修改指令" style={{ marginTop: 50 }} />}
    </div>
  );

  // 定义 Tab 切换项
  const items = [
    { label: <span><CommentOutlined />对话</span>, key: 'chat' },
    { label: <span><PictureOutlined />绘画</span>, key: 'text2img' },
    { label: <span><BgColorsOutlined />修图</span>, key: 'img2img' },
  ];

  return (
    <div className="gpt-layout">
      {/* 顶部简单的 Tabs */}
      <div className="gpt-header">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          centered
          className="gpt-tabs"
        />
      </div>

      {/* 中间内容区域 (自适应高度) */}
      <div className="gpt-workspace">
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'text2img' && renderText2Img()}
        {activeTab === 'img2img' && renderImg2Img()}
      </div>

      {/* 底部输入框区域 (固定在底部) */}
      <div className="gpt-footer">
        <div className="gpt-input-wrapper">
          <TextArea
            value={activeTab === 'chat' ? chatInput : (activeTab === 'text2img' ? t2iPrompt : i2iPrompt)}
            onChange={(e) => {
              if (activeTab === 'chat') setChatInput(e.target.value);
              else if (activeTab === 'text2img') setT2iPrompt(e.target.value);
              else setI2iPrompt(e.target.value);
            }}
            placeholder={activeTab === 'chat' ? "给 Python AI 发送消息" : "描述你的创意..."}
            autoSize={{ minRows: 1, maxRows: 6 }}
            onKeyDown={handleKeyDown}
            className="gpt-textarea"
          />
          <Button
            type="text"
            shape="circle"
            icon={<ArrowUpOutlined style={{ fontWeight: 'bold' }} />}
            onClick={handleSubmit}
            loading={loading}
            disabled={!(activeTab === 'chat' ? chatInput : (activeTab === 'text2img' ? t2iPrompt : i2iPrompt))}
            className={`gpt-send-btn ${(activeTab === 'chat' ? chatInput : (activeTab === 'text2img' ? t2iPrompt : i2iPrompt)) ? 'active' : ''}`}
          />
        </div>
        <div className="gpt-footer-tip">
          内容由 AI 生成，请仔细甄别。
        </div>
      </div>
    </div>
  );
};

export default AiStudio;