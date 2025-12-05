// src/api/ai.ts
import request from '../utils/request';

// 定义参数类型
export interface AIParams {
  model_type: 'chat' | 'text_optimization' | 'image_generation';
  params: {
    prompt?: string; // 聊天和生图用
    text?: string;   // 优化文案用
    tone?: string;   // 优化风格
    ratio?: string;  // 图片比例
    [key: string]: any;
  };
}

// 定义返回结构 (根据 Python 后端返回的结构)
export interface AIResult {
  type: 'text' | 'image_url';
  result: string;
  source_model: string;
}

// ✅ 统一调度接口
export const dispatchAI = (data: AIParams) => {
  return request('/api/v1/ai/dispatch', { 
    method: 'POST',
    data,
  });
};