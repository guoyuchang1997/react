// src/router/config.js
import React from 'react';
import {
  AppstoreOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  RocketOutlined
} from '@ant-design/icons';
import AiText from '../pages/AiText';
import Table from '../pages/Table';
import Python from '../pages/python';
import Image from '../pages/image';

/**
 * 路由配置数组
 * @param {string} path - 路由路径 (同时作为 Tab 的 key)
 * @param {string} label - Tab 显示的文字
 * @param {ReactNode} icon - (可选) 图标
 * @param {Component} component - 页面组件
 * @param {boolean} hidden - (可选) 如果为 true，则不显示在 Tab 上，但路由依然生效 (例如详情页)
 */
export const routeConfig = [
  {
    path: '/home/aitext',
    label: 'AI 工作台',
    icon: <VideoCameraOutlined />,
    component: AiText,
  },
  {
    path: '/home/resource',
    label: '图片管理',
    icon: <AppstoreOutlined />,
    component: Image,
  },
  {
    path: '/home/python',
    label: 'Python',
    icon: <RocketOutlined />,
    component: Python,
  },
  // {
  //   path: '/home/aitext',
  //   label: '暂定',
  //   icon: <FileTextOutlined />,
  //   component: AiTextPage,
  // },
  // 示例：一个不显示在 Tab 栏的隐藏路由 (比如详情页)
  // {
  //     path: '/home/manga/detail',
  //     label: '漫剧详情',
  //     component: () => <div>详情页</div>,
  //     hidden: true
  // }
];