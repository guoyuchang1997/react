const path = require('path');

module.exports = {
resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // 支持自动解析这些扩展名
    alias: {
      '@': path.resolve(__dirname, 'src'), // 将 @ 映射到 src 目录
    }
  }
};