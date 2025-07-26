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

      // 延迟检查选中文本，确保选择完成
      setTimeout(() => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText.length > 0) {
          // 获取选中文本的位置
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            // 按钮显示在选中文本的右上角
            this.showTranslationButton(rect.right + window.scrollX, rect.top + window.scrollY, selectedText);
          }
        } else {
          this.hideTranslationButton();
        }
      }, 100);
    });

    // 监听键盘快捷键 (Alt+T)
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 't' && !e.ctrlKey && !e.shiftKey) {
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
    button.className = 'immersive-translator translate-button pulse-animation';
    button.innerHTML = '🌐 翻译';
    button.style.left = `${x}px`;
    button.style.top = `${y - 40}px`;

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      button.classList.add('loading');
      this.translateText(text);
      this.hideTranslationButton();
    });

    document.body.appendChild(button);
    this.translationButton = button;

    // 移除脉冲动画
    setTimeout(() => {
      if (button.classList) {
        button.classList.remove('pulse-animation');
      }
    }, 2000);
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
    this.showTranslationBox(text, '', true);

    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: "translate",
          text: text,
          targetLang: this.targetLanguage
        }, resolve);
      });

      if (response.success) {
        this.showTranslationBox(text, response.translation, false);
        this.showSuccessIndicator();
      } else {
        this.showTranslationBox(text, '翻译失败: ' + response.error, false);
      }
    } catch (error) {
      this.showTranslationBox(text, '翻译失败，请稍后重试', false);
    }
  }

  // 创建翻译框
  createTranslationBox() {
    if (this.translationBox) return;

    const box = document.createElement('div');
    box.className = 'immersive-translator translation-box';

    box.innerHTML = `
      <div class="header">
        <span class="header-title">沉浸式翻译</span>
        <button class="close-btn">×</button>
      </div>
      <div class="original-text"></div>
      <div class="translated-text"></div>
      <div class="action-buttons">
        <button class="copy-btn">复制翻译</button>
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
  showTranslationBox(originalText, translatedText, isLoading = false) {
    if (!this.translationBox) {
      this.createTranslationBox();
    }

    this.translationBox.querySelector('.original-text').textContent = originalText;
    
    if (isLoading) {
      this.translationBox.classList.add('loading');
      this.translationBox.querySelector('.translated-text').innerHTML = 
        '<div class="immersive-translator loading-spinner"></div>翻译中...';
    } else {
      this.translationBox.classList.remove('loading');
      this.translationBox.querySelector('.translated-text').textContent = translatedText;
    }
    
    this.translationBox.classList.add('show');
  }

  // 显示成功指示器
  showSuccessIndicator() {
    if (this.translationBox) {
      const indicator = document.createElement('div');
      indicator.className = 'immersive-translator success-indicator';
      indicator.innerHTML = '✓';
      
      this.translationBox.style.position = 'relative';
      this.translationBox.appendChild(indicator);
      
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.remove();
        }
      }, 2000);
    }
  }

  // 隐藏翻译框
  hideTranslationBox() {
    if (this.translationBox && this.translationBox.classList.contains('show')) {
      this.translationBox.classList.add('hide');
      this.translationBox.classList.remove('show');
      
      setTimeout(() => {
        if (this.translationBox) {
          this.translationBox.classList.remove('hide');
        }
      }, 200);
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