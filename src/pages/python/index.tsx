// @ts-nocheck
import React, { useState } from 'react';
import { Card, InputNumber, Button, Space, Typography, Alert, Spin, Empty, Row, Col, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, ClearOutlined, FireOutlined } from '@ant-design/icons';
import { getDouTop } from '../../api/user';
import './index.css';

const { Title, Text } = Typography;

const MovieDoubanList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 查询数量：可输入
  const [limit, setLimit] = useState(10);

  const fetchMovies = async () => {
    const n = Number(limit);

    if (!Number.isFinite(n) || n <= 0) {
      setError('请输入大于 0 的数字');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const response = await getDouTop(n);
      setMovies(response);
    } catch (err) {
      console.error('❌ 请求挂了:', err);

      if (err.response) {
        setError(`服务器错误: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        setError('后端服务未响应，请检查端口 8000 是否开启');
      } else {
        setError('代码逻辑错误: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setMovies([]);
    setError(null);
  };

  return (
    <div style={{ padding: 16 }}>
      <Card
        bordered={false}
        style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 12 }}
        bodyStyle={{ padding: 20 }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Title level={3} style={{ margin: 0 }}>
              <FireOutlined /> 豆瓣 Top250 实时抓取
            </Title>
            <Text type="secondary">
              输入数量，点击查询。图片若不显示，通常是防盗链问题（你已加 referrerPolicy）。
            </Text>
          </Space>

          {/* 控制区 */}
          <Card size="small" style={{ borderRadius: 10 }}>
            <Space wrap size={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Space wrap size={12}>
                <Text strong>查询数量</Text>
                <InputNumber
                  min={1}
                  max={250}
                  value={limit}
                  onChange={(v) => setLimit(v)}
                  disabled={loading}
                  style={{ width: 140 }}
                />
                <Tag color="blue">1 ~ 250</Tag>
              </Space>

              <Space wrap size={10}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={fetchMovies}
                  loading={loading}
                >
                  查询
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchMovies}
                  disabled={loading}
                >
                  重新查询
                </Button>
                <Button
                  danger
                  icon={<ClearOutlined />}
                  onClick={clearAll}
                  disabled={loading}
                >
                  清空
                </Button>
              </Space>
            </Space>
          </Card>

          {/* 状态区 */}
          {error && <Alert type="error" showIcon message="请求失败" description={error} />}

          {/* 内容区 */}
          <Spin spinning={loading} tip="🔥 正在爬取豆瓣数据中...">
            {!loading && !error && movies.length === 0 && (
              <Empty
                description="请输入数量，然后点击“查询”开始抓取"
                style={{ padding: '24px 0' }}
              />
            )}

            {movies.length > 0 && (
              <Row gutter={[16, 16]}>
                {movies.map((movie, index) => (
                  <Col key={index} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      style={{ borderRadius: 12, overflow: 'hidden' }}
                      cover={
                        <div style={{ position: 'relative' }}>
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            style={{ width: '100%', height: 260, objectFit: 'cover' }}
                          />
                          <Tag
                            color="gold"
                            style={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            ⭐ {movie.score}
                          </Tag>
                        </div>
                      }
                    >
                      <Card.Meta
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 700, lineHeight: 1.2 }}>{movie.title}</span>
                          </div>
                        }
                        description={
                          movie.quote ? (
                            <Text type="secondary" style={{ fontStyle: 'italic' }}>
                              “{movie.quote}”
                            </Text>
                          ) : (
                            <Text type="secondary">暂无一句话点评</Text>
                          )
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Spin>
        </Space>
      </Card>
    </div>
  );
};

export default MovieDoubanList;
