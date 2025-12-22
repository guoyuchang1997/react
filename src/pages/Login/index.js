import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, theme } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import './index.css';
const Login = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { token } = theme.useToken();

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('欢迎回来');
      history.push('/home');
    }, 1000);
  };

  return (
    <div className="login-container">
      {/* 1. 动态背景层：由三个光斑组成 */}
      <div className="ambient-light light-1"></div>
      <div className="ambient-light light-2"></div>
      <div className="ambient-light light-3"></div>

      {/* 2. 玻璃磨砂卡片 */}
      <div className="glass-card">
        {/* 左侧：品牌区 (手机端隐藏) */}
        <div className="card-left">
          <div className="brand-content">
            <h1 className="brand-title">AI</h1>
            <p className="brand-slogan">
              探索人工智能的无限可能。<br />
              构建未来，始于足下。
            </p>
          </div>
          <div className="copyright">© 2025 Lingxi AI. All Rights Reserved.</div>
        </div>

        {/* 右侧：表单区 */}
        <div className="card-right">
          <div className="form-header">
            <h2>登录账号</h2>
            <p>请输入您的管理员凭证以继续</p>
          </div>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#aaa' }} />}
                placeholder="用户名 / 邮箱"
                className="custom-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#aaa' }} />}
                placeholder="密码"
                className="custom-input"
              />
            </Form.Item>

            <div className="form-actions">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a className="forgot-link">忘记密码？</a>
            </div>

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="submit-btn"
                block
              >
                立即登录 <ArrowRightOutlined />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;