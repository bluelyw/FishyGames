// 国际化(i18n)管理系统
class I18nManager {
    constructor() {
        console.log('I18nManager 构造函数开始执行');
        
        // 默认语言
        this.defaultLanguage = 'zh-CN';
        
        // 当前语言
        this.currentLanguage = this.loadLanguagePreference() || this.detectBrowserLanguage() || this.defaultLanguage;
        
        // 支持的语言列表
        this.supportedLanguages = {
            'ar': 'العربية', // 阿拉伯语
            'bg': 'Български', // 保加利亚语
            'cs': 'Čeština', // 捷克语
            'da': 'Dansk', // 丹麦语
            'de': 'Deutsch', // 德语
            'el': 'Ελληνικά', // 希腊语
            'en': 'English', // 英语
            'es': 'Español', // 西班牙语
            'fi': 'Suomi', // 芬兰语
            'fr': 'Français', // 法语
            'he': 'עברית', // 希伯来语
            'hi': 'हिन्दी', // 印地语
            'hu': 'Magyar', // 匈牙利语
            'id': 'Bahasa Indonesia', // 印度尼西亚语
            'it': 'Italiano', // 意大利语
            'ja': '日本語', // 日语
            'ko': '한국어', // 韩语
            'nl': 'Nederlands', // 荷兰语
            'no': 'Norsk', // 挪威语
            'pl': 'Polski', // 波兰语
            'pt': 'Português', // 葡萄牙语
            'ro': 'Română', // 罗马尼亚语
            'ru': 'Русский', // 俄语
            'sk': 'Slovenčina', // 斯洛伐克语
            'sv': 'Svenska', // 瑞典语
            'test': 'Test Language', // 测试语言
            'th': 'ไทย', // 泰语
            'tr': 'Türkçe', // 土耳其语
            'uk': 'Українська', // 乌克兰语
            'vi': 'Tiếng Việt', // 越南语
            'zh-CN': '简体中文', // 简体中文
            'zh-TW': '繁體中文' // 繁体中文
        };
        
        // 翻译数据
        this.translations = {};
        
        // 初始化
        this.init();
        
        console.log('I18nManager 构造函数执行完毕');
    }
    
    // 初始化
    async init() {
        try {
            console.log('开始初始化i18n系统');
            console.log(`当前语言: ${this.currentLanguage}`);
            console.log(`默认语言: ${this.defaultLanguage}`);
            console.log(`支持的语言数量: ${Object.keys(this.supportedLanguages).length}`);
            
            // 确保当前语言是支持的语言之一
            if (!this.supportedLanguages[this.currentLanguage]) {
                console.warn(`当前语言 ${this.currentLanguage} 不受支持，回退到默认语言 ${this.defaultLanguage}`);
                this.currentLanguage = this.defaultLanguage;
            }
            
            // 加载当前语言的翻译
            await this.loadTranslation(this.currentLanguage);
            
            // 更新页面上的所有文本
            this.updatePageText();
            
            // 设置文档方向（用于RTL语言）
            this.setDocumentDirection(this.currentLanguage);
            
            console.log(`语言初始化完成: ${this.currentLanguage}`);
        } catch (error) {
            console.error('初始化语言失败:', error);
            
            // 如果当前语言加载失败，尝试加载默认语言
            if (this.currentLanguage !== this.defaultLanguage) {
                console.log(`尝试加载默认语言: ${this.defaultLanguage}`);
                this.currentLanguage = this.defaultLanguage;
                await this.loadTranslation(this.defaultLanguage);
                this.updatePageText();
                this.setDocumentDirection(this.defaultLanguage);
            }
        }
    }
    
    // 设置文档方向（用于RTL语言）
    setDocumentDirection(language) {
        // RTL语言列表
        const rtlLanguages = ['ar', 'he'];
        
        if (rtlLanguages.includes(language)) {
            document.documentElement.setAttribute('dir', 'rtl');
            console.log(`设置文档方向为RTL (${language})`);
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            console.log(`设置文档方向为LTR (${language})`);
        }
    }
    
    // 检测浏览器语言
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        
        // 检查是否支持完整的语言代码（如zh-CN）
        if (this.supportedLanguages[browserLang]) {
            return browserLang;
        }
        
        // 检查是否支持语言的基础部分（如zh）
        const baseLang = browserLang.split('-')[0];
        if (this.supportedLanguages[baseLang]) {
            return baseLang;
        }
        
        return null;
    }
    
    // 加载语言偏好设置
    loadLanguagePreference() {
        try {
            return localStorage.getItem('fishGameLanguage');
        } catch (error) {
            console.error('加载语言偏好设置失败:', error);
            return null;
        }
    }
    
    // 保存语言偏好设置
    saveLanguagePreference(language) {
        try {
            localStorage.setItem('fishGameLanguage', language);
        } catch (error) {
            console.error('保存语言偏好设置失败:', error);
        }
    }
    
    // 加载翻译数据
    async loadTranslation(language) {
        console.log(`尝试加载语言: ${language}`);
        
        // 如果已经加载过该语言，则直接返回
        if (this.translations[language]) {
            console.log(`语言 ${language} 已经加载过，直接使用缓存`);
            return;
        }
        
        try {
            // 尝试加载语言文件
            console.log(`正在加载语言文件: lang/${language}.json`);
            const response = await fetch(`lang/${language}.json`);
            
            if (!response.ok) {
                throw new Error(`无法加载语言文件: ${language}, 状态码: ${response.status}`);
            }
            
            const data = await response.json();
            this.translations[language] = data;
            console.log(`语言 ${language} 加载成功，包含 ${Object.keys(data).length} 个翻译项`);
            
            // 打印前几个翻译项作为示例
            const sampleKeys = Object.keys(data).slice(0, 3);
            sampleKeys.forEach(key => {
                console.log(`示例翻译: ${key} = ${data[key]}`);
            });
        } catch (error) {
            console.error(`加载语言文件失败: ${language}`, error);
            
            // 如果不是默认语言，则尝试加载默认语言
            if (language !== this.defaultLanguage) {
                console.log(`尝试回退到默认语言: ${this.defaultLanguage}`);
                await this.loadTranslation(this.defaultLanguage);
            } else {
                // 如果默认语言也加载失败，则使用内置的中文翻译
                console.log('使用内置的默认翻译');
                this.translations[this.defaultLanguage] = this.getDefaultTranslation();
            }
        }
    }
    
    // 获取默认翻译（中文）
    getDefaultTranslation() {
        return {
            "game_title": "大鱼吃小鱼",
            "score": "得分",
            "level": "等级",
            "game_description": "移动鼠标控制你的小鱼，吃掉比你小的鱼来成长，但要小心那些比你大的鱼！",
            "start_game": "开始游戏",
            "view_leaderboard": "查看排行榜",
            "game_over": "游戏结束",
            "final_score": "你的最终分数是",
            "enter_name": "输入你的名字",
            "save_score": "保存分数",
            "restart": "重新开始",
            "leaderboard": "排行榜",
            "rank": "排名",
            "player": "玩家",
            "date": "日期",
            "no_records": "暂无记录",
            "back": "返回",
            "clear_leaderboard": "清除排行榜",
            "sound_settings": "音量设置",
            "bgm_volume": "背景音乐音量",
            "sfx_volume": "音效音量",
            "close": "关闭",
            "language": "语言",
            "anonymous": "匿名玩家",
            "confirm_clear": "确定要清除所有排行榜记录吗？此操作不可撤销。",
            "cleared": "排行榜已清空"
        };
    }
    
    // 切换语言
    async changeLanguage(language) {
        console.log(`i18n.changeLanguage 被调用，语言: ${language}`);
        
        if (!this.supportedLanguages[language]) {
            console.error(`不支持的语言: ${language}`);
            return false;
        }
        
        try {
            // 加载新语言的翻译
            await this.loadTranslation(language);
            
            // 更新当前语言
            this.currentLanguage = language;
            
            // 保存语言偏好设置
            this.saveLanguagePreference(language);
            console.log(`语言偏好已保存: ${language}`);
            
            // 更新页面文本
            this.updatePageText();
            
            // 设置文档方向
            this.setDocumentDirection(language);
            
            console.log(`语言已切换为: ${language}`);
            return true;
        } catch (error) {
            console.error(`切换语言失败: ${language}`, error);
            return false;
        }
    }
    
    // 获取翻译文本
    getText(key, defaultText = '') {
        if (!key) {
            console.warn('getText: key 为空');
            return defaultText;
        }
        
        // 尝试从当前语言获取翻译
        const translation = this.translations[this.currentLanguage];
        
        if (translation && translation[key] !== undefined) {
            return translation[key];
        }
        
        // 如果当前语言没有该翻译，尝试从默认语言获取
        const defaultTranslation = this.translations[this.defaultLanguage];
        
        if (defaultTranslation && defaultTranslation[key] !== undefined) {
            console.warn(`未找到 ${this.currentLanguage} 语言的 "${key}" 翻译，使用默认语言 ${this.defaultLanguage}`);
            return defaultTranslation[key];
        }
        
        // 如果都没有找到，返回默认文本或键名
        console.warn(`未找到 "${key}" 的翻译，使用默认文本`);
        return defaultText || key;
    }
    
    // 更新页面上的所有文本
    updatePageText() {
        console.log('正在更新页面文本，当前语言:', this.currentLanguage);
        
        try {
            // 更新所有带有data-i18n属性的元素
            const elements = document.querySelectorAll('[data-i18n]');
            console.log(`找到 ${elements.length} 个需要翻译的元素`);
            
            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const text = this.getText(key);
                
                if (text) {
                    if (element.tagName === 'INPUT' && element.getAttribute('type') === 'text') {
                        // 对于文本输入框，更新placeholder属性
                        element.placeholder = text;
                    } else {
                        // 对于其他元素，更新文本内容
                        element.textContent = text;
                    }
                    console.log(`已更新元素 [${element.tagName}] 的文本，key: ${key}, text: ${text}`);
                } else {
                    console.warn(`未找到key为 ${key} 的翻译`);
                }
            });
            
            // 更新页面标题
            document.title = this.getText('game_title');
            console.log('已更新页面标题:', document.title);
            
            // 触发自定义事件，通知游戏语言已更改
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: this.currentLanguage }
            }));
            
            console.log('页面文本更新完成');
            return true;
        } catch (error) {
            console.error('更新页面文本时发生错误:', error);
            return false;
        }
    }
    
    // 获取支持的语言列表
    getSupportedLanguages() {
        console.log('获取支持的语言列表:', this.supportedLanguages);
        
        // 确保至少包含几个基本语言
        const minimalLanguages = {
            'zh-CN': '简体中文',
            'en': 'English',
            'fr': 'Français',
            'test': 'Test Language'
        };
        
        // 如果supportedLanguages为空或未定义，返回最小语言集
        if (!this.supportedLanguages || Object.keys(this.supportedLanguages).length === 0) {
            console.warn('支持的语言列表为空，使用最小语言集');
            return minimalLanguages;
        }
        
        return this.supportedLanguages;
    }
    
    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// 创建全局i18n管理器实例
console.log('创建全局i18n管理器实例');
window.i18n = new I18nManager();

// 添加一个全局函数用于调试
window.checkI18n = function() {
    console.log('检查i18n管理器:', window.i18n);
    if (window.i18n) {
        console.log('当前语言:', window.i18n.getCurrentLanguage());
        console.log('支持的语言:', window.i18n.getSupportedLanguages());
        return '✅ i18n管理器可用';
    } else {
        console.error('❌ i18n管理器不可用');
        return '❌ i18n管理器不可用';
    }
};

// 添加一个全局函数用于直接切换语言
window.switchLanguage = function(lang) {
    console.log(`直接切换语言到: ${lang}`);
    if (window.i18n && typeof window.i18n.changeLanguage === 'function') {
        window.i18n.changeLanguage(lang)
            .then(success => {
                if (success) {
                    console.log(`语言已切换到: ${lang}`);
                    return true;
                } else {
                    console.error(`切换语言失败: ${lang}`);
                    return false;
                }
            })
            .catch(error => {
                console.error(`切换语言时发生错误:`, error);
                return false;
            });
    } else {
        console.error('i18n管理器不可用或changeLanguage方法不存在');
        return false;
    }
}; 