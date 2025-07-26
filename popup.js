// 弹出窗口脚本
document.addEventListener('DOMContentLoaded', function() {
  const enableToggle = document.getElementById('enableToggle');
  const targetLanguageSelect = document.getElementById('targetLanguage');
  const statusDiv = document.getElementById('status');

  // 加载保存的设置
  loadSettings();

  // 设置事件监听器
  enableToggle.addEventListener('click', function() {
    const isEnabled = !enableToggle.classList.contains('active');
    enableToggle.classList.toggle('active', isEnabled);
    saveSettings();
    showStatus(isEnabled ? '翻译已启用' : '翻译已禁用', 'success');
  });

  targetLanguageSelect.addEventListener('change', function() {
    saveSettings();
    showStatus('设置已保存', 'success');
  });

  // 加载设置
  function loadSettings() {
    chrome.runtime.sendMessage({ action: "getSettings" }, function(response) {
      if (response && response.settings) {
        const settings = response.settings;

        // 设置启用状态
        const isEnabled = settings.enabled !== false;
        enableToggle.classList.toggle('active', isEnabled);

        // 设置目标语言
        if (settings.targetLanguage) {
          targetLanguageSelect.value = settings.targetLanguage;
        }
      }
    });
  }

  // 保存设置
  function saveSettings() {
    const settings = {
      enabled: enableToggle.classList.contains('active'),
      targetLanguage: targetLanguageSelect.value
    };

    chrome.runtime.sendMessage({
      action: "saveSettings",
      settings: settings
    }, function(response) {
      if (!response || !response.success) {
        showStatus('设置保存失败', 'error');
      }
    });
  }

  // 显示状态消息
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';

    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 2000);
  }

  // 测试翻译功能
  function testTranslation() {
    const testText = "Hello, world!";
    chrome.runtime.sendMessage({
      action: "translate",
      text: testText,
      targetLang: targetLanguageSelect.value
    }, function(response) {
      if (response && response.success) {
        showStatus('翻译测试成功', 'success');
      } else {
        showStatus('翻译测试失败', 'error');
      }
    });
  }

  // 添加测试按钮（可选）
  const testButton = document.createElement('button');
  testButton.textContent = '测试翻译';
  testButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 8px;
    font-size: 14px;
  `;
  testButton.addEventListener('click', testTranslation);

  // 将测试按钮添加到第一个section中
  const firstSection = document.querySelector('.section');
  if (firstSection) {
    firstSection.appendChild(testButton);
  }
});