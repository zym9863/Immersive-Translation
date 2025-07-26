# 沉浸式翻译插件

基于 Pollinations AI 的浏览器扩展，提供无缝的网页文本翻译体验。

## 功能特点

- 🌐 **选中即翻译**: 选中任意文本即可快速翻译
- 🎯 **多种触发方式**: 支持点击按钮、右键菜单、快捷键
- 🔧 **智能界面**: 沉浸式翻译框，不干扰原网页布局
- 🌍 **多语言支持**: 支持中文、英文、日文、韩文等多种语言
- ⚡ **无需API密钥**: 使用免费的 Pollinations AI 服务
- 💾 **设置保存**: 自动保存用户偏好设置

## 安装方法

1. 下载或克隆此项目到本地
2. 打开 Chrome 浏览器，进入扩展管理页面 (`chrome://extensions/`)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹
6. 插件安装完成！

## 使用方法

### 方式一：选中文本翻译
1. 在任意网页上选中要翻译的文本
2. 点击出现的蓝色翻译按钮
3. 翻译结果将显示在右上角的翻译框中

### 方式二：右键菜单
1. 选中要翻译的文本
2. 右键点击选择"翻译选中文本"
3. 查看翻译结果

### 方式三：快捷键
1. 选中要翻译的文本
2. 按下 `Ctrl + T`
3. 查看翻译结果

### 设置选项
- 点击浏览器工具栏中的插件图标
- 可以开启/关闭翻译功能
- 选择目标翻译语言
- 测试翻译功能

## 技术架构

### 文件结构
```
├── manifest.json      # 扩展清单文件
├── background.js      # 后台脚本，处理API调用
├── content.js         # 内容脚本，处理页面交互
├── content.css        # 样式文件
├── popup.html         # 弹出窗口界面
├── popup.js          # 弹出窗口逻辑
├── icon.png          # 插件图标
└── README.md         # 说明文档
```

### 核心技术
- **Manifest V3**: 使用最新的浏览器扩展标准
- **Pollinations AI**: 免费的AI翻译服务
- **Chrome Extension APIs**: 利用浏览器扩展API
- **现代CSS**: 响应式设计，适配各种屏幕

## API 集成

插件使用 Pollinations AI 的文本生成API：

```javascript
const response = await fetch('https://text.pollinations.ai/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: prompt }
    ],
    model: 'openai-large',
    private: true
  })
});
```

## 支持的语言

- 中文 (Chinese)
- English (英语)
- 日本語 (日语)
- 한국어 (韩语)
- Français (法语)
- Deutsch (德语)
- Español (西班牙语)
- Русский (俄语)

## 开发说明

### 本地开发
1. 修改代码后，在扩展管理页面点击刷新按钮
2. 重新加载使用插件的网页以应用更改

### 调试
- 使用 Chrome 开发者工具调试 content script
- 在扩展管理页面点击"背景页"调试 background script
- 右键点击插件图标选择"检查弹出内容"调试 popup

## 注意事项

- 插件需要网络连接才能正常工作
- 翻译质量依赖于 Pollinations AI 服务
- 某些网站可能因为CSP策略限制插件功能
- 建议在翻译长文本时分段进行

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
