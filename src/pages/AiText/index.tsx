// ts-nocheck
import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Input,
  Button,
  Select,
  Space,
  Typography,
  message,
  Spin,
  Tag
} from 'antd';
import { RobotOutlined, PictureOutlined, EditOutlined } from '@ant-design/icons';
// 引入 API 类型 (假设你的 API 定义如下，如果没有请忽略类型导入)
import { dispatchAI, AIParams, AIResult } from '../../api/ai';

const { TextArea } = Input;
const { Paragraph } = Typography;

// 常量定义
const TONE_OPTIONS = ['专业严谨', '幽默风趣', '小红书爆款', '温柔治愈', '简练有力'];
const RATIO_OPTIONS = ['1:1', '16:9', '9:16', '4:3'];

const MODEL_TYPES = {
  CHAT: 'chat',
  OPTIMIZE: 'text_optimization',
  IMAGE: 'image_generation',
};

const AiToolComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(MODEL_TYPES.CHAT);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  const [selectedTone, setSelectedTone] = useState(TONE_OPTIONS[0]);
  const [selectedRatio, setSelectedRatio] = useState(RATIO_OPTIONS[0]);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      message.warning('请输入内容');
      return;
    }

    setLoading(true);
    setAiResult(null);

    try {
      let params: any = {};
      if (activeTab === MODEL_TYPES.CHAT) {
        params = { prompt: inputText };
      } else if (activeTab === MODEL_TYPES.OPTIMIZE) {
        params = { text: inputText, tone: selectedTone };
      } else if (activeTab === MODEL_TYPES.IMAGE) {
        params = { prompt: inputText, ratio: selectedRatio };
      }

      const requestBody: AIParams = {
        model_type: activeTab as any,
        params,
      };

      // 2. 调用 API
      const res = await dispatchAI(requestBody);

      // 判断逻辑：先看 HTTP 状态，再看业务状态
      if (res.status === 200) {
        setAiResult(res.data);
        message.success('生成成功');
      } else {
        const errorMsg = '生成失败';
        message.error(errorMsg);
      }

    } catch (error) {
      console.error(error);
      message.error('请求发生错误，请检查后端服务');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!aiResult) return null;

    return (
      <Card
        title={
          <Space>
            <span>生成结果</span>
            <Tag color="blue">{aiResult.source_model}</Tag>
          </Space>
        }
        style={{ marginTop: 24, background: '#f6ffed', borderColor: '#b7eb8f' }}
      >
        {aiResult.type === 'image_url' ? (
          <div style={{ textAlign: 'center' }}>
            <img
              src={aiResult.result}
              alt="AI Generated"
              style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        ) : (
          <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>
            {aiResult.result}
          </Paragraph>
        )}
      </Card>
    );
  };

  // --- 🛠️ 修复点 3：处理 Icon 类型兼容性问题 ---
  // 使用 React.ReactNode 显式声明，或者升级 Icon 库
  const items = [
    {
      key: MODEL_TYPES.CHAT,
      label: (
        <Space>
          AI 对话
        </Space>
      ) as React.ReactNode,
    },
    {
      key: MODEL_TYPES.OPTIMIZE,
      label: (
        <Space>
          文案优化 (千问)
        </Space>
      ) as React.ReactNode,
    },
    {
      key: MODEL_TYPES.IMAGE,
      label: (
        <Space>
          AI 生图
        </Space>
      ) as React.ReactNode,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="AI 智能工作台" bordered={false}>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setAiResult(null);
          }}
          items={items}
          style={{ marginBottom: 20 }}
        />

        <Spin spinning={loading} tip="AI 正在思考中...">
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {activeTab === MODEL_TYPES.OPTIMIZE && (
              <Space>
                <span>优化风格：</span>
                <Select
                  value={selectedTone}
                  onChange={setSelectedTone}
                  style={{ width: 150 }}
                  options={TONE_OPTIONS.map(t => ({ label: t, value: t }))}
                />
              </Space>
            )}

            {activeTab === MODEL_TYPES.IMAGE && (
              <Space>
                <span>图片比例：</span>
                <Select
                  value={selectedRatio}
                  onChange={setSelectedRatio}
                  style={{ width: 120 }}
                  options={RATIO_OPTIONS.map(r => ({ label: r, value: r }))}
                />
              </Space>
            )}

            <TextArea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === MODEL_TYPES.OPTIMIZE ? "粘贴你需要润色的原始文案..." :
                  activeTab === MODEL_TYPES.IMAGE ? "描述你想生成的画面 (Prompt)..." :
                    "输入你想问的问题..."
              }
              showCount
              maxLength={2000}
              style={{ fontSize: 16 }}
            />

            <Space>
              <Button type="primary" size="large" onClick={handleGenerate} loading={loading}>
                开始生成
              </Button>
              <Button size="large" onClick={() => setInputText('')}>
                清空输入
              </Button>
            </Space>
          </Space>
        </Spin>

        {renderResult()}
      </Card>
    </div>
  );
};

export default AiToolComponent;