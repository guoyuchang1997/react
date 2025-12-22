// src/pages/Layout/index.js
import React, { useEffect, useState, useMemo } from 'react';
import { Layout, Tabs, Avatar, Dropdown, theme } from 'antd'; // 引入 theme
import {
  UserOutlined,
  ThunderboltFilled,
  LogoutOutlined,
  BgColorsOutlined, // 外观图标
  SunOutlined,
  MoonOutlined,
  DesktopOutlined
} from '@ant-design/icons';
import { Route, Switch, useHistory, useLocation, Redirect } from "react-router-dom";
import './LayoutPage.css';
import { routeConfig } from '../../router/config';

// 引入 Store 用于状态管理
import { Store } from '../../store/home';

const { Content } = Layout;

const LayoutPage = () => {
  const history = useHistory();
  const location = useLocation();
  const { token } = theme.useToken(); // 获取当前主题 token 用于样式微调

  // 1. 获取当前的主题模式 (用于在菜单里显示哪个被选中了)
  // 第二个参数是默认值
  const [mode] = Store.Theme.use('mode', 'system');

  const [activeTab, setActiveTab] = useState(routeConfig[0].path);

  // Tabs 配置 (保持不变)
  const tabItems = useMemo(() => {
    return routeConfig
      .filter(item => !item.hidden)
      .map(item => ({
        label: <span>{item.label}</span>,
        key: item.path,
      }));
  }, []);

  // 路由监听 (保持不变)
  useEffect(() => {
    const pathname = location.pathname;
    const currentRoute = routeConfig.find(item => pathname.includes(item.path));
    if (currentRoute && !currentRoute.hidden) {
      setActiveTab(currentRoute.path);
    }
  }, [location.pathname]);

  const handleTabChange = (key) => {
    history.push(key);
  };

  // --- 新增：处理下拉菜单点击 ---
  const handleMenuClick = ({ key }) => {
    // 判断点击的是否是主题相关的 key
    if (['light', 'dark', 'system'].includes(key)) {
      Store.Theme.update('mode', key); // 更新全局 Zustand 状态
    }
    else if (key === 'logout') {
      // 处理退出登录逻辑
      console.log('User logout');
      history.push('/login');
    }
  };

  // --- 新增：下拉菜单配置 ---
  const userMenuItems = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '4px 0', cursor: 'default' }}>
          <div style={{ fontWeight: 'bold' }}>xxx</div>
          <div style={{ fontSize: '12px', color: '#888' }}>admin@example.com</div>
        </div>
      ),
      type: 'group', // 分组类型，不可点击
    },
    { type: 'divider' }, // 分割线
    {
      key: 'theme',
      icon: <BgColorsOutlined />,
      label: '外观设置',
      children: [ // 子菜单
        {
          key: 'light',
          icon: <SunOutlined />,
          label: '浅色模式',
        },
        {
          key: 'dark',
          icon: <MoonOutlined />,
          label: '深色模式',
        },
        {
          key: 'system',
          icon: <DesktopOutlined />,
          label: '跟随系统',
        },
      ],
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true, // 红色警告样式
    },
  ];

  return (
    <Layout className="layout-container">
      <header className="sticky-header">

        {/* 左侧占位或 Logo (可选) */}
        <div className="header-left" style={{ width: 100 }}>
          {/* 如果这里空着，可以放个空的 div 占位，或者把 Logo 放这里 */}
        </div>

        {/* 中间 Tabs */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            className="custom-tabs"
          />
        </div>

        {/* 右侧 Avatar 下拉菜单 */}
        <div style={{ width: 100, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleMenuClick,
              selectedKeys: [mode] // 关键：自动高亮当前选中的主题模式
            }}
            trigger={['click']} // 点击触发，而不是悬停
            placement="bottomRight"
            arrow
          >
            {/* 头像区域：模仿 Google 风格 */}
            <div className="avatar-wrapper">
              <Avatar
                size={32}
                style={{
                  backgroundColor: '#1677ff', // 你的主题色
                  fontSize: 14,
                  cursor: 'pointer',
                  verticalAlign: 'middle'
                }}
              >
                xx
              </Avatar>
            </div>
          </Dropdown>
        </div>
      </header>

      <Content>
        <div className="content-wrapper">
          <Switch>
            {routeConfig.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                component={route.component}
              />
            ))}
            <Route exact path="/home" render={() => <Redirect to={routeConfig[0].path} />} />
            <Redirect to={routeConfig[0].path} />
          </Switch>
        </div>
      </Content>
    </Layout>
  );
};

export default LayoutPage;