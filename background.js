// 背景脚本 - 处理右键菜单和API调用
chrome.runtime.onInstalled.addListener(() => {
  // 创建右键菜单
  chrome.contextMenus.create({
    id: "translate-text",
    title: "翻译选中文本",
    contexts: ["selection"]
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate-text" && info.selectionText) {
    // 向content script发送翻译请求
    chrome.tabs.sendMessage(tab.id, {
      action: "translate",
      text: info.selectionText
    });
  }
});

// Pollinations API翻译函数
async function translateText(text, targetLang = "中文") {
  try {
    const prompt = `请将以下文本翻译成${targetLang}，只返回翻译结果，不要添加任何解释：\n\n${text}`;

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: prompt }
        ],
        model: 'openai',
        private: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const translatedText = await response.text();
    return translatedText.trim();
  } catch (error) {
    console.error('翻译错误:', error);
    return '翻译失败，请稍后重试';
  }
}

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    translateText(request.text, request.targetLang)
      .then(result => {
        sendResponse({ success: true, translation: result });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // 保持消息通道开放
  }
});

// 存储用户设置
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveSettings") {
    chrome.storage.sync.set(request.settings, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === "getSettings") {
    chrome.storage.sync.get(null, (settings) => {
      sendResponse({ settings });
    });
    return true;
  }
});