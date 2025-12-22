const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // 1. 匹配所有以 /api 开头的请求
  // Express 会自动“剥离”这个前缀，所以中间件里拿到的是 '/v1/ai/dispatch'
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8001',
      changeOrigin: true,
      pathRewrite: {
        // 含义：匹配路径开头的 '/'，替换为 '/api/'
        '^/': '/api/',
      },

      // 3. (可选) 加上日志，方便确认拼接是否成功
      onProxyReq: (proxyReq, req, res) => {
        // 注意：这里的 req.url 是被 Express 砍掉后的（如 /v1/...）
        // proxyReq.path 是最终发给后端的（如 /api/v1/...）
        console.log(`[Proxy] ${req.method} ${req.url} => 拼接后: ${proxyReq.path}`);
      },
    })
  );

  // 💡 未来如果有其他服务，可以继续加，互不干扰：
  // app.use('/auth', createProxyMiddleware({ target: 'http://OtherService:9000', pathRewrite: {'^/': '/auth/'} }));
};