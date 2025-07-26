// 内容脚本 - 处理页面交互和翻译显示
class ImmersiveTranslator {
  constructor() {
    this.isEnabled = true;
    this.targetLanguage = '中文';
    this.translationBox = null;
    this.init();
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.createTranslationBox();
  }

  // 加载用户设置
  loadSettings() {
    chrome.runtime.sendMessage({ action: "getSettings" }, (response) => {
      if (response && response.settings) {
        this.isEnabled = response.settings.enabled !== false;
        this.targetLanguage = response.settings.targetLanguage || '中文';
      }
    });
  }

  // 设置事件监听器
  setupEventListeners() {
    // 监听文本选择
    document.addEventListener('mouseup', (e) => {
      if (!this.isEnabled) return;

      const selectedText = window.getSelection().toString().trim();
      if (selectedText && selectedText.length > 0) {
        this.showTranslationButton(e.pageX, e.pageY, selectedText);
      } else {
        this.hideTranslationButton();
      }
    });

    // 监听键盘快捷键 (Ctrl+T)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 't' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
          this.translateText(selectedText);
        }
      }
    });

    // 点击其他地方隐藏翻译框
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.immersive-translator')) {
        this.hideTranslationBox();
        this.hideTranslationButton();
      }
    });
  }

  // 显示翻译按钮
  showTranslationButton(x, y, text) {
    this.hideTranslationButton();

    const button = document.createElement('div');
    button.className = 'immersive-translator translate-button';
    button.innerHTML = '🌐 翻译';
    button.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y - 40}px;
      background: #4285f4;
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      user-select: none;
    `;

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.translateText(text);
      this.hideTranslationButton();
    });

    document.body.appendChild(button);
    this.translationButton = button;
  }

  // 隐藏翻译按钮
  hideTranslationButton() {
    if (this.translationButton) {
      this.translationButton.remove();
      this.translationButton = null;
    }
  }

  // 翻译文本
  async translateText(text) {
    this.showTranslationBox(text, '翻译中...');

    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: "translate",
          text: text,
          targetLang: this.targetLanguage
        }, resolve);
      });

      if (response.success) {
        this.showTranslationBox(text, response.translation);
      } else {
        this.showTranslationBox(text, '翻译失败: ' + response.error);
      }
    } catch (error) {
      this.showTranslationBox(text, '翻译失败，请稍后重试');
    }
  }

  // 创建翻译框
  createTranslationBox() {
    if (this.translationBox) return;

    const box = document.createElement('div');
    box.className = 'immersive-translator translation-box';
    box.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      max-height: 400px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      z-index: 10001;
      display: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    box.innerHTML = `
      <div style="padding: 12px; border-bottom: 1px solid #eee; background: #f8f9fa; border-radius: 8px 8px 0 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; color: #333;">沉浸式翻译</span>
          <button class="close-btn" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666;">×</button>
        </div>
      </div>
      <div class="original-text" style="padding: 12px; border-bottom: 1px solid #eee; background: #fff8e1; font-size: 14px; color: #333;"></div>
      <div class="translated-text" style="padding: 12px; font-size: 14px; color: #333; line-height: 1.5;"></div>
      <div style="padding: 8px 12px; border-top: 1px solid #eee; background: #f8f9fa; border-radius: 0 0 8px 8px;">
        <button class="copy-btn" style="background: #4285f4; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">复制翻译</button>
      </div>
    `;

    // 添加事件监听器
    box.querySelector('.close-btn').addEventListener('click', () => {
      this.hideTranslationBox();
    });

    box.querySelector('.copy-btn').addEventListener('click', () => {
      const translatedText = box.querySelector('.translated-text').textContent;
      navigator.clipboard.writeText(translatedText).then(() => {
        const btn = box.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '已复制!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1000);
      });
    });

    document.body.appendChild(box);
    this.translationBox = box;
  }

  // 显示翻译框
  showTranslationBox(originalText, translatedText) {
    if (!this.translationBox) {
      this.createTranslationBox();
    }

    this.translationBox.querySelector('.original-text').textContent = originalText;
    this.translationBox.querySelector('.translated-text').textContent = translatedText;
    this.translationBox.style.display = 'block';
  }

  // 隐藏翻译框
  hideTranslationBox() {
    if (this.translationBox) {
      this.translationBox.style.display = 'none';
    }
  }
}

// 监听来自background script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate" && request.text) {
    if (window.immersiveTranslator) {
      window.immersiveTranslator.translateText(request.text);
    }
  }
});

// 初始化翻译器
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.immersiveTranslator = new ImmersiveTranslator();
  });
} else {
  window.immersiveTranslator = new ImmersiveTranslator();
}