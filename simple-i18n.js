// 简单的语言切换系统
var SimpleI18n = {
    // 当前语言
    currentLanguage: 'zh-CN',
    
    // 翻译数据
    translations: {
        'zh-CN': {
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
            "score": "得分",
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
        },
        'en': {
            "game_title": "Big Fish Eats Small Fish",
            "score": "Score",
            "level": "Level",
            "game_description": "Move your mouse to control your fish, eat smaller fish to grow, but beware of those bigger than you!",
            "start_game": "Start Game",
            "view_leaderboard": "View Leaderboard",
            "game_over": "Game Over",
            "final_score": "Your final score is",
            "enter_name": "Enter your name",
            "save_score": "Save Score",
            "restart": "Restart",
            "leaderboard": "Leaderboard",
            "rank": "Rank",
            "player": "Player",
            "score": "Score",
            "date": "Date",
            "no_records": "No records",
            "back": "Back",
            "clear_leaderboard": "Clear Leaderboard",
            "sound_settings": "Sound Settings",
            "bgm_volume": "Background Music Volume",
            "sfx_volume": "Sound Effects Volume",
            "close": "Close",
            "language": "Language",
            "anonymous": "Anonymous Player",
            "confirm_clear": "Are you sure you want to clear all leaderboard records? This action cannot be undone.",
            "cleared": "Leaderboard has been cleared"
        },
        'fr': {
            "game_title": "Le Gros Poisson Mange le Petit Poisson",
            "score": "Score",
            "level": "Niveau",
            "game_description": "Déplacez votre souris pour contrôler votre poisson, mangez des poissons plus petits pour grandir, mais méfiez-vous de ceux qui sont plus grands que vous !",
            "start_game": "Commencer le Jeu",
            "view_leaderboard": "Voir le Classement",
            "game_over": "Partie Terminée",
            "final_score": "Votre score final est",
            "enter_name": "Entrez votre nom",
            "save_score": "Sauvegarder le Score",
            "restart": "Recommencer",
            "leaderboard": "Classement",
            "rank": "Rang",
            "player": "Joueur",
            "score": "Score",
            "date": "Date",
            "no_records": "Aucun enregistrement",
            "back": "Retour",
            "clear_leaderboard": "Effacer le Classement",
            "sound_settings": "Paramètres Sonores",
            "bgm_volume": "Volume de la Musique",
            "sfx_volume": "Volume des Effets Sonores",
            "close": "Fermer",
            "language": "Langue",
            "anonymous": "Joueur Anonyme",
            "confirm_clear": "Êtes-vous sûr de vouloir effacer tous les enregistrements du classement ? Cette action ne peut pas être annulée.",
            "cleared": "Le classement a été effacé"
        }
    },
    
    // 初始化
    init: function() {
        console.log('SimpleI18n 初始化');
        
        // 尝试从本地存储加载语言设置
        var savedLanguage = localStorage.getItem('fishGameLanguage');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
            console.log('从本地存储加载语言: ' + this.currentLanguage);
        }
        
        // 更新页面文本
        this.updatePageText();
        
        // 更新语言按钮状态
        this.updateLanguageButtons();
        
        console.log('SimpleI18n 初始化完成');
    },
    
    // 切换语言
    changeLanguage: function(lang) {
        console.log('切换语言到: ' + lang);
        
        // 检查语言是否支持
        if (!this.translations[lang]) {
            console.error('不支持的语言: ' + lang);
            alert('不支持的语言: ' + lang);
            return false;
        }
        
        // 更新当前语言
        this.currentLanguage = lang;
        
        // 保存到本地存储
        localStorage.setItem('fishGameLanguage', lang);
        
        // 更新页面文本
        this.updatePageText();
        
        // 更新语言按钮状态
        this.updateLanguageButtons();
        
        // 更新当前语言显示
        var currentLanguageDisplay = document.getElementById('currentLanguageDisplay');
        if (currentLanguageDisplay) {
            var languageNames = {
                'zh-CN': '简体中文',
                'en': 'English',
                'fr': 'Français'
            };
            var languageName = languageNames[lang] || lang;
            currentLanguageDisplay.textContent = '当前语言: ' + languageName + ' (' + lang + ')';
        }
        
        console.log('语言已切换到: ' + lang);
        return true;
    },
    
    // 获取翻译文本
    getText: function(key, defaultText = '') {
        var translation = this.translations[this.currentLanguage];
        if (translation && translation[key]) {
            return translation[key];
        }
        
        // 如果当前语言没有该翻译，尝试从默认语言获取
        var defaultTranslation = this.translations['zh-CN'];
        if (defaultTranslation && defaultTranslation[key]) {
            return defaultTranslation[key];
        }
        
        // 如果都没有找到，返回默认文本或键名
        return defaultText || key;
    },
    
    // 更新页面上的所有文本
    updatePageText: function() {
        console.log('更新页面文本');
        
        // 更新所有带有data-i18n属性的元素
        var elements = document.querySelectorAll('[data-i18n]');
        console.log('找到 ' + elements.length + ' 个需要翻译的元素');
        
        elements.forEach(function(element) {
            var key = element.getAttribute('data-i18n');
            var text = this.getText(key);
            
            if (element.tagName === 'INPUT' && element.getAttribute('type') === 'text') {
                // 对于文本输入框，更新placeholder属性
                element.placeholder = text;
            } else {
                // 对于其他元素，更新文本内容
                element.textContent = text;
            }
        }.bind(this));
        
        // 更新页面标题
        document.title = this.getText('game_title');
    },
    
    // 更新语言按钮状态
    updateLanguageButtons: function() {
        var buttons = document.querySelectorAll('.language-button');
        buttons.forEach(function(button) {
            if (button.getAttribute('data-lang') === this.currentLanguage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }.bind(this));
    }
};

// 导出到全局作用域
window.SimpleI18n = SimpleI18n;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，初始化SimpleI18n');
    SimpleI18n.init();
}); 