import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Input, Card, Tag, message, Spin, Empty, Tooltip } from 'antd';
import { PlusOutlined, PictureOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { generateAI, getTaskStatus } from '../../api/user';
import './index.css';

const { Meta } = Card;
const { TextArea } = Input;

interface GalleryItem {
  id: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILURE' | 'PROCESS';
  url?: string;
  prompt: string;
  create_time: string;
}

const AiGallery: React.FC = () => {
  // --- 状态管理 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // 1. 使用 useRef 存储定时器，防止组件刷新导致变量重置
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 核心：获取列表数据 (改造版) ---
  // 增加 isPolling 参数：如果是轮询触发的，不显示全屏 loading
  const fetchGalleryList = async (isPolling = false) => {
    // 每次调用前，先清除可能存在的旧定时器，防止多重定时器并发
    if (pollingTimerRef.current) {
      clearTimeout(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }

    // 只有非轮询状态（手动点击或初始化）才显示 Loading 转圈
    if (!isPolling) {
      setListLoading(true);
    }

    try {
      const data = await getTaskStatus(); // 假设后端直接返回数组，如果不是请调整 data.data

      if (data) {
        setGallery(data);

        // --- 核心优化逻辑 START ---
        // 检查当前列表中是否有 "生成中" 或 "排队中" 的任务
        const hasRunningTask = data.some((item: GalleryItem) =>
          item.status === 'PENDING' || item.status === 'PROCESS'
        );

        if (hasRunningTask) {
          console.log('检测到有未完成任务，10秒后自动刷新...');
          // 递归调用：设置定时器，10秒后以轮询模式再次请求
          pollingTimerRef.current = setTimeout(() => {
            fetchGalleryList(true);
          }, 10000);
        }
        // --- 核心优化逻辑 END ---
      }
    } catch (error) {
      console.error(error);
      if (!isPolling) message.error('获取列表失败');
    } finally {
      setListLoading(false);
    }
  };

  // --- 生命周期 ---
  useEffect(() => {
    // 1. 组件挂载时，进行第一次加载
    fetchGalleryList();

    // 2. 组件卸载时，一定要清除定时器，防止内存泄漏
    return () => {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }
    };
  }, []);

  // --- 交互：提交新任务 ---
  const handleGenerate = async () => {
    if (!prompt.trim()) return message.warning('请输入提示词');

    setCreateLoading(true);
    try {
      const task_id = await generateAI({
        task_type: 'text2img',
        prompt: prompt,
      });

      if (task_id) {
        message.success('任务提交成功，后台生成中...');
        setIsModalOpen(false);
        setPrompt('');

        // 提交成功后，立即刷新一次列表
        // 这次刷新会发现新任务是 PENDING，从而自动触发上面的轮询逻辑
        fetchGalleryList();
      }
    } catch (error) {
      message.error('网络请求失败');
    } finally {
      setCreateLoading(false);
    }
  };

  // --- 手动刷新 ---
  const handleManualRefresh = () => {
    // 手动点击时，isPolling 为 false，会显示 loading 动画
    fetchGalleryList(false);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <div className="header-left">
          <h2>🎨 AI 创意画廊</h2>
          <span className="subtitle">异步生成任务列表</span>
        </div>
        <div className="header-actions">
          <Tooltip title="刷新列表状态">
            <Button
              icon={<SyncOutlined spin={listLoading} />}
              onClick={handleManualRefresh} // 绑定手动刷新
              style={{ marginRight: 10 }}
            >
              刷新
            </Button>
          </Tooltip>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            新建创作
          </Button>
        </div>
      </div>

      <div className="gallery-content">
        {listLoading && gallery.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" tip="加载数据中..." />
          </div>
        ) : (
          <div className="gallery-grid">
            {gallery.length === 0 && !listLoading && (
              <div className="empty-state">
                <Empty description="暂无作品，点击右上角新建" />
              </div>
            )}

            {gallery.map((item) => (
              <Card
                key={item.id}
                hoverable
                className="img-card"
                cover={
                  <div className="img-wrapper">
                    {(item.status === 'PENDING' || item.status === 'PROCESS') && (
                      <div className="loading-placeholder">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        <p style={{ marginTop: 10 }}>AI 正在绘制中...</p>
                        <p style={{ fontSize: 12, color: '#999' }}>自动刷新中...</p> {/* 提示语微调 */}
                      </div>
                    )}
                    {item.status === 'FAILURE' && (
                      <div className="error-placeholder">
                        <PictureOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
                        <p>生成失败</p>
                      </div>
                    )}
                    {item.status === 'SUCCESS' && item.url && (
                      <ImagePreview url={item.url} title={item.prompt} />
                    )}
                  </div>
                }
              >
                <Meta
                  title={
                    <div className="card-title">
                      <StatusTag status={item.status} />
                      <span className="time-label">{formatTime(item.create_time)}</span>
                    </div>
                  }
                  description={<div className="prompt-text" title={item.prompt}>{item.prompt}</div>}
                />
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="✨ 创建新作品"
        open={isModalOpen}
        onOk={handleGenerate}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createLoading}
        okText="立即生成"
        cancelText="取消"
      >
        <TextArea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你的创意..."
          maxLength={200}
          showCount
        />
      </Modal>
    </div>
  );
};

// 辅助组件保持不变...
const StatusTag = ({ status }: { status: string }) => {
  let color = 'default';
  let text = '未知';
  switch (status) {
    case 'SUCCESS': color = 'success'; text = '完成'; break;
    case 'PENDING': color = 'processing'; text = '排队中'; break;
    case 'PROCESS': color = 'processing'; text = '生成中'; break;
    case 'FAILURE': color = 'error'; text = '失败'; break;
  }
  return <Tag color={color}>{text}</Tag>;
};

const ImagePreview = ({ url, title }: { url: string, title: string }) => (
  <img
    alt={title}
    src={url}
    referrerPolicy="no-referrer"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
);

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export default AiGallery;