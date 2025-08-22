// 玩家鱼类
class PlayerFish {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = 5;
        this.growthRate = 0.1;
        this.maxSize = 100;
        this.targetX = x;
        this.targetY = y;
    }
    
    moveToward(targetX, targetY) {
        // 更新目标位置
        this.targetX = targetX;
        this.targetY = targetY;
        
        // 计算方向向量
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 标准化方向向量并更新位置
        if (distance > 0) {
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;
            
            // 更新位置
            this.x += normalizedDx * this.speed;
            this.y += normalizedDy * this.speed;
            
            console.log('鱼的位置更新:', {
                x: this.x,
                y: this.y,
                targetX: this.targetX,
                targetY: this.targetY,
                speed: this.speed
            });
        }
    }
    
    update() {
        // 空方法，用于保持与其他实体的一致性
    }
    
    checkBounds(canvasWidth, canvasHeight) {
        // 确保鱼不会游出画布
        this.x = Math.max(this.size, Math.min(canvasWidth - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvasHeight - this.size, this.y));
    }
    
    grow(amount) {
        if (this.size < this.maxSize) {
            this.size += amount || this.growthRate;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 计算鱼的朝向角度
        const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        ctx.rotate(angle);
        
        // 绘制鱼身
        ctx.beginPath();
        ctx.fillStyle = '#FF6B6B';
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制鱼尾
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.8, 0);
        ctx.lineTo(-this.size * 1.5, -this.size * 0.4);
        ctx.lineTo(-this.size * 1.5, this.size * 0.4);
        ctx.closePath();
        ctx.fillStyle = '#FF6B6B';
        ctx.fill();
        
        // 绘制鱼眼
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.arc(this.size * 0.3, -this.size * 0.1, this.size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// 敌人鱼类
class EnemyFish {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 计算鱼的朝向角度
        var angle = Math.atan2(this.speedY, this.speedX);
        ctx.rotate(angle);
        
        // 绘制鱼身
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制鱼尾
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.8, 0);
        ctx.lineTo(-this.size * 1.5, -this.size * 0.4);
        ctx.lineTo(-this.size * 1.5, this.size * 0.4);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // 绘制鱼眼
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.arc(this.size * 0.3, -this.size * 0.1, this.size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// 气泡类
class Bubble {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 1 + Math.random() * 2;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 1 + Math.random() * 2;
    }
    
    update() {
        this.y -= this.speed;
        this.wobble += this.wobbleSpeed * 0.02;
        this.x += Math.sin(this.wobble) * 0.5;
    }
    
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        ctx.restore();
    }
}

// 海藻类
class Seaweed {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.segments = 10;
        this.time = Math.random() * Math.PI * 2;
        this.speed = 1 + Math.random();
    }
    
    update() {
        this.time += 0.02 * this.speed;
    }
    
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        
        for (var i = 0; i <= this.segments; i++) {
            var segmentY = this.y - (this.height * i / this.segments);
            var wobbleX = Math.sin(this.time + i * 0.3) * 15;
            var x = this.x + wobbleX;
            
            if (i === 0) {
                ctx.moveTo(x, segmentY);
            } else {
                ctx.lineTo(x, segmentY);
            }
        }
        
        ctx.strokeStyle = '#0D5B3C';
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    }
}

// 游戏主逻辑
class Game {
    constructor() {
        // RTL语言列表
        this.rtlLanguages = ['ar', 'he'];
        
        // 游戏状态
        this.gameRunning = false;
        this.score = 0;
        this.level = 1;
        this.mousePosition = null;
        
        // 游戏元素
        this.playerFish = null;
        this.enemies = [];
        this.bubbles = [];
        this.seaweeds = [];
        
        // 计时器
        this.lastTime = 0;
        this.enemyTimer = 0;
        this.bubbleTimer = 0;
        
        // 等待DOM完全加载后再初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeGame());
        } else {
            this.initializeGame();
        }
    }
    
    initializeGame() {
        // 获取游戏元素
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('找不到游戏画布元素!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // 获取UI元素
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.finalScoreElement = document.getElementById('finalScore');
        this.gameStartScreen = document.getElementById('gameStart');
        this.gameOverScreen = document.getElementById('gameOver');
        this.leaderboardScreen = document.getElementById('leaderboard');
        this.soundSettingsScreen = document.getElementById('soundSettings');
        this.languageSettingsScreen = document.getElementById('languageSettings');
        
        // 获取按钮元素
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.showLeaderboardButton = document.getElementById('showLeaderboardButton');
        this.viewLeaderboardButton = document.getElementById('viewLeaderboardButton');
        this.backButton = document.getElementById('backButton');
        this.saveScoreButton = document.getElementById('saveScoreButton');
        this.clearLeaderboardButton = document.getElementById('clearLeaderboardButton');
        this.playerNameInput = document.getElementById('playerName');
        this.leaderboardBody = document.getElementById('leaderboardBody');
        
        // 音频控制元素
        this.muteButton = document.getElementById('muteButton');
        this.soundSettingsButton = document.getElementById('soundSettingsButton');
        this.closeSoundSettingsButton = document.getElementById('closeSoundSettings');
        this.bgmVolumeSlider = document.getElementById('bgmVolume');
        this.sfxVolumeSlider = document.getElementById('sfxVolume');
        this.bgmVolumeValue = document.getElementById('bgmVolumeValue');
        this.sfxVolumeValue = document.getElementById('sfxVolumeValue');
        
        // 语言控制元素
        this.languageButton = document.getElementById('languageButton');
        this.closeLanguageSettingsButton = document.getElementById('closeLanguageSettings');
        
        // 初始化音频管理器
        this.audioManager = new AudioManager();
        
        // 检查关键元素是否存在
        if (!this.leaderboardScreen || !this.leaderboardBody) {
            console.error('找不到排行榜相关元素!', {
                leaderboardScreen: this.leaderboardScreen,
                leaderboardBody: this.leaderboardBody
            });
        }
        
        // 调整画布大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 鼠标移动事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            // 计算鼠标在画布上的实际位置
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;
            
            // 更新鼠标位置
            this.mousePosition = {
                x: mouseX,
                y: mouseY
            };
            
            console.log('鼠标位置更新:', {
                clientX: e.clientX,
                clientY: e.clientY,
                rectLeft: rect.left,
                rectTop: rect.top,
                scaleX: scaleX,
                scaleY: scaleY,
                mouseX: mouseX,
                mouseY: mouseY
            });
        });
        
        // 绑定按钮事件
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                console.log('开始按钮被点击');
                this.audioManager.playSound('click');
                this.startGame();
            });
        }
        
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => {
                console.log('重新开始按钮被点击');
                this.audioManager.playSound('click');
                this.startGame();
            });
        }
        
        if (this.showLeaderboardButton) {
            this.showLeaderboardButton.addEventListener('click', () => {
                console.log('显示排行榜按钮被点击');
                this.audioManager.playSound('click');
                this.showLeaderboard();
            });
        }
        
        if (this.backButton) {
            this.backButton.addEventListener('click', () => {
                console.log('返回按钮被点击');
                this.audioManager.playSound('click');
                this.hideLeaderboard();
            });
        }
        
        if (this.saveScoreButton) {
            this.saveScoreButton.addEventListener('click', () => {
                console.log('保存分数按钮被点击');
                this.audioManager.playSound('click');
                this.saveScore();
            });
        }
        
        if (this.clearLeaderboardButton) {
            this.clearLeaderboardButton.addEventListener('click', () => {
                console.log('清除排行榜按钮被点击');
                this.audioManager.playSound('click');
                this.clearLeaderboard();
            });
        }
        
        // 音频控制事件监听
        if (this.muteButton) {
            this.muteButton.addEventListener('click', () => {
                console.log('静音按钮被点击');
                this.toggleMute();
            });
        }
        
        if (this.soundSettingsButton) {
            this.soundSettingsButton.addEventListener('click', () => {
                console.log('音量设置按钮被点击');
                this.audioManager.playSound('click');
                this.showSoundSettings();
            });
        }
        
        if (this.closeSoundSettingsButton) {
            this.closeSoundSettingsButton.addEventListener('click', () => {
                console.log('关闭音量设置按钮被点击');
                this.audioManager.playSound('click');
                this.hideSoundSettings();
            });
        }
        
        // 语言控制事件监听
        if (this.languageButton) {
            this.languageButton.addEventListener('click', () => {
                console.log('语言按钮被点击');
                this.audioManager.playSound('click');
                this.showLanguageSettings();
            });
        }
        
        if (this.closeLanguageSettingsButton) {
            this.closeLanguageSettingsButton.addEventListener('click', () => {
                console.log('关闭语言设置按钮被点击');
                this.audioManager.playSound('click');
                this.hideLanguageSettings();
            });
        }
        
        // 音量控制事件监听
        if (this.bgmVolumeSlider) {
            this.bgmVolumeSlider.value = this.audioManager.bgmVolume * 100;
            this.bgmVolumeValue.textContent = Math.round(this.audioManager.bgmVolume * 100) + '%';
            
            this.bgmVolumeSlider.addEventListener('input', (e) => {
                var volume = e.target.value / 100;
                this.audioManager.setBGMVolume(volume);
                this.bgmVolumeValue.textContent = e.target.value + '%';
            });
        }
        
        if (this.sfxVolumeSlider) {
            this.sfxVolumeSlider.value = this.audioManager.sfxVolume * 100;
            this.sfxVolumeValue.textContent = Math.round(this.audioManager.sfxVolume * 100) + '%';
            
            this.sfxVolumeSlider.addEventListener('input', (e) => {
                var volume = e.target.value / 100;
                this.audioManager.setSFXVolume(volume);
                this.sfxVolumeValue.textContent = e.target.value + '%';
                
                if (parseInt(e.target.value) % 10 === 0) {
                    this.audioManager.playSound('click');
                }
            });
        }
        
        // 加载排行榜数据
        this.leaderboard = this.loadLeaderboard();
        
        // 开始渲染开始界面
        this.renderStartScreen();
    }
    
    // 语言变化事件处理
    onLanguageChanged(languageCode) {
        // 更新游戏中的动态文本
        SimpleI18n.updatePageText();
        
        // 更新RTL布局
        if (this.rtlLanguages.includes(languageCode)) {
            document.body.dir = 'rtl';
        } else {
            document.body.dir = 'ltr';
        }
    }
    
    resizeCanvas() {
        // 调整画布大小
        var container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }
    
    startGame() {
        console.log('开始游戏');
        // 初始化游戏状态
        this.gameRunning = true;
        this.score = 0;
        this.level = 1;
        this.scoreElement.textContent = '0';
        this.levelElement.textContent = '1';
        
        // 初始化玩家鱼
        this.playerFish = new PlayerFish(this.canvas.width / 2, this.canvas.height / 2, 20);
        
        // 初始化游戏元素
        this.enemies = [];
        this.bubbles = [];
        this.seaweeds = [];
        
        // 初始化海藻
        for (let i = 0; i < 5; i++) {
            this.seaweeds.push(new Seaweed(
                Math.random() * this.canvas.width,
                this.canvas.height,
                10 + Math.random() * 10,
                100 + Math.random() * 100
            ));
        }
        
        // 初始化计时器和游戏ID
        this.currentPlayerId = null;
        this.enemyTimer = 0;
        this.bubbleTimer = 0;
        this.lastTime = performance.now();
        
        // 初始化鼠标位置
        this.mousePosition = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        
        // 隐藏所有界面
        if (this.gameStartScreen) this.gameStartScreen.classList.add('hidden');
        if (this.gameOverScreen) this.gameOverScreen.classList.add('hidden');
        if (this.leaderboardScreen) this.leaderboardScreen.classList.add('hidden');
        if (this.soundSettingsScreen) this.soundSettingsScreen.classList.add('hidden');
        if (this.languageSettingsScreen) this.languageSettingsScreen.style.display = 'none';
        
        // 恢复音频上下文
        if (this.audioManager.audioContext && this.audioManager.audioContext.state === 'suspended') {
            this.audioManager.resumeAudioContext();
        }
        
        // 播放背景音乐
        if (!this.audioManager.isMuted) {
            this.audioManager.playBGM();
        }
        
        // 启动游戏循环
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    endGame() {
        this.gameRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.classList.remove('hidden');
        this.playerNameInput.value = ''; // 清空名字输入框
        
        // 停止背景音乐
        this.audioManager.stopBGM();
        
        // 播放游戏结束音效
        this.audioManager.playSound('gameOver');
    }
    
    renderStartScreen() {
        // 渲染游戏开始界面的背景动画
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 渲染背景
        this.renderBackground();
        
        // 渲染一条装饰性的大鱼在背景中游动
        var time = Date.now() / 1000;
        var x = this.canvas.width * 0.5 + Math.sin(time * 0.5) * this.canvas.width * 0.3;
        var y = this.canvas.height * 0.5 + Math.cos(time * 0.3) * this.canvas.height * 0.2;
        
        var decorativeFish = new PlayerFish(x, y, 30);
        decorativeFish.targetX = x + Math.cos(time * 0.5) * this.canvas.width * 0.3;
        decorativeFish.targetY = y - Math.sin(time * 0.3) * this.canvas.height * 0.2;
        decorativeFish.render(this.ctx);
        
        // 继续动画循环
        if (!this.gameRunning) {
            requestAnimationFrame(() => this.renderStartScreen());
        }
    }
    
    // 排行榜相关方法
    loadLeaderboard() {
        try {
            var savedLeaderboard = localStorage.getItem('fishGameLeaderboard');
            return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
        } catch (error) {
            console.error('加载排行榜数据失败:', error);
            return [];
        }
    }
    
    saveLeaderboard() {
        try {
            localStorage.setItem('fishGameLeaderboard', JSON.stringify(this.leaderboard));
        } catch (error) {
            console.error('保存排行榜数据失败:', error);
            alert('无法保存排行榜数据，可能是浏览器不支持或禁用了本地存储功能。');
        }
    }
    
    showLeaderboard() {
        console.log('显示排行榜被调用');
        
        if (!this.leaderboardScreen) {
            console.error('排行榜元素不存在!');
            return;
        }
        
        // 隐藏其他界面
        if (this.gameStartScreen) this.gameStartScreen.classList.add('hidden');
        if (this.gameOverScreen) this.gameOverScreen.classList.add('hidden');
        
        // 显示排行榜
        this.leaderboardScreen.classList.remove('hidden');
        console.log('排行榜元素:', this.leaderboardScreen);
        
        // 更新排行榜数据
        this.updateLeaderboardDisplay();
    }
    
    hideLeaderboard() {
        console.log('隐藏排行榜被调用');
        
        if (!this.leaderboardScreen) {
            console.error('排行榜元素不存在!');
            return;
        }
        
        this.leaderboardScreen.classList.add('hidden');
        
        // 如果游戏结束了，显示游戏结束界面
        if (!this.gameRunning && this.score > 0) {
            if (this.gameOverScreen) this.gameOverScreen.classList.remove('hidden');
        } else {
            // 否则显示开始界面
            if (this.gameStartScreen) this.gameStartScreen.classList.remove('hidden');
        }
    }
    
    saveScore() {
        console.log('保存分数被调用');
        
        if (!this.playerNameInput) {
            console.error('玩家名称输入框不存在!');
            return;
        }
        
        var playerName = this.playerNameInput.value.trim() || SimpleI18n.getText('anonymous', '匿名玩家');
        var currentDate = new Date();
        var formattedDate = currentDate.getFullYear() + '-' + 
            (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + 
            currentDate.getDate().toString().padStart(2, '0') + ' ' + 
            currentDate.getHours().toString().padStart(2, '0') + ':' + 
            currentDate.getMinutes().toString().padStart(2, '0');
        
        // 创建唯一ID
        var playerId = Date.now().toString();
        this.currentPlayerId = playerId;
        
        // 添加新分数
        this.leaderboard.push({
            id: playerId,
            name: playerName,
            score: this.score,
            date: formattedDate
        });
        
        // 按分数排序
        this.leaderboard.sort((a, b) => b.score - a.score);
        
        // 只保留前20名
        if (this.leaderboard.length > 20) {
            this.leaderboard = this.leaderboard.slice(0, 20);
        }
        
        // 保存到本地存储
        this.saveLeaderboard();
        console.log('排行榜数据已保存:', this.leaderboard);
        
        // 显示排行榜
        this.showLeaderboard();
    }
    
    updateLeaderboardDisplay() {
        console.log('更新排行榜显示被调用');
        
        if (!this.leaderboardBody) {
            console.error('排行榜表格体不存在!');
            return;
        }
        
        // 清空排行榜
        this.leaderboardBody.innerHTML = '';
        console.log('排行榜数据:', this.leaderboard);
        console.log('排行榜表格体:', this.leaderboardBody);
        
        // 添加排行榜数据
        this.leaderboard.forEach((entry, index) => {
            var row = document.createElement('tr');
            
            // 如果是当前玩家的分数，高亮显示
            if (entry.id === this.currentPlayerId) {
                row.classList.add('current-player');
            }
            
            row.innerHTML = 
                '<td>' + (index + 1) + '</td>' +
                '<td>' + entry.name + '</td>' +
                '<td>' + entry.score + '</td>' +
                '<td>' + entry.date + '</td>';
            
            this.leaderboardBody.appendChild(row);
        });
        
        // 如果没有数据，显示提示
        if (this.leaderboard.length === 0) {
            var emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="4">' + SimpleI18n.getText('no_records', '暂无记录') + '</td>';
            this.leaderboardBody.appendChild(emptyRow);
        }
    }
    
    addBubble() {
        // 添加一个新气泡
        this.bubbles.push(new Bubble(
            Math.random() * this.canvas.width,
            this.canvas.height + Math.random() * 20,
            2 + Math.random() * 8
        ));
    }
    
    spawnEnemy() {
        // 生成一个新的敌人鱼
        var size;
        var playerSize = this.playerFish.size;
        var rand = Math.random();
        
        // 根据玩家大小决定敌人大小的随机范围
        if (rand < 0.6) {
            // 60%的几率生成比玩家小的鱼
            size = playerSize * (0.3 + Math.random() * 0.6);
        } else if (rand < 0.9) {
            // 30%的几率生成比玩家稍大的鱼
            size = playerSize * (1.1 + Math.random() * 0.5);
        } else {
            // 10%的几率生成比玩家大很多的鱼
            size = playerSize * (1.6 + Math.random() * 1.2);
        }
        
        // 决定敌人的生成位置
        var x, y;
        if (Math.random() < 0.5) {
            // 从左右两侧生成
            x = Math.random() < 0.5 ? -size * 2 : this.canvas.width + size * 2;
            y = Math.random() * this.canvas.height;
        } else {
            // 从上下两侧生成
            x = Math.random() * this.canvas.width;
            y = Math.random() < 0.5 ? -size * 2 : this.canvas.height + size * 2;
        }
        
        // 决定敌人的颜色
        var colorFactor = size / playerSize;
        var color;
        
        if (colorFactor < 1) {
            // 小鱼为绿色到蓝色
            color = 'hsl(' + (180 + 60 * (1 - colorFactor)) + ', 80%, 60%)';
        } else {
            // 大鱼为红色到紫色
            color = 'hsl(' + (360 - 60 * Math.min(colorFactor - 1, 1)) + ', 80%, 60%)';
        }
        
        // 创建敌人
        var enemy = new EnemyFish(x, y, size, color);
        
        // 设置敌人的移动目标和速度
        var angle = Math.atan2(
            this.canvas.height / 2 - y,
            this.canvas.width / 2 - x
        );
        
        // 速度与大小成反比
        var speedFactor = Math.max(0.5, 2 - colorFactor * 0.5);
        enemy.speedX = Math.cos(angle) * speedFactor;
        enemy.speedY = Math.sin(angle) * speedFactor;
        
        this.enemies.push(enemy);
    }
    
    updateLevel() {
        // 更新等级和难度
        var newLevel = Math.floor(this.score / 500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.levelElement.textContent = this.level;
            
            // 增加敌人生成速率
            this.enemySpawnRate = 1.5 + (this.level - 1) * 0.3;
            
            // 播放升级音效
            this.audioManager.playSound('levelUp');
        }
    }
    
    renderBackground() {
        // 渲染背景：水、气泡和海藻
        
        // 渲染水的渐变背景
        var gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#104978');
        gradient.addColorStop(1, '#052442');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 渲染海藻
        this.seaweeds.forEach((seaweed) => {
            seaweed.render(this.ctx);
        });
        
        // 渲染气泡
        this.bubbles.forEach(bubble => {
            bubble.render(this.ctx);
        });
    }
    
    gameLoop(time) {
        if (!this.gameRunning) return;
        
        // 计算时间增量
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 渲染背景
        this.renderBackground();
        
        // 更新海藻
        this.seaweeds.forEach(seaweed => {
            seaweed.update();
        });
        
        // 更新气泡
        this.bubbleTimer += deltaTime;
        if (this.bubbleTimer > 1000) {
            this.bubbleTimer = 0;
            if (this.bubbles.length < 20) {
                this.bubbles.push(new Bubble(
                    Math.random() * this.canvas.width,
                    this.canvas.height + 10,
                    2 + Math.random() * 4
                ));
            }
        }
        
        // 更新和过滤气泡
        this.bubbles = this.bubbles.filter(bubble => {
            bubble.update();
            return bubble.y > -bubble.radius;
        });
        
        // 生成敌人
        this.enemyTimer += deltaTime;
        if (this.enemyTimer > 2000) {
            this.enemyTimer = 0;
            if (this.enemies.length < 10) {
                const size = 10 + Math.random() * 30;
                const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
                let x, y, speedX, speedY;
                
                // 从屏幕边缘随机位置生成
                if (Math.random() < 0.5) {
                    // 左右边缘
                    x = Math.random() < 0.5 ? -size : this.canvas.width + size;
                    y = Math.random() * this.canvas.height;
                    speedX = (x < 0 ? 1 : -1) * (1 + Math.random() * 2);
                    speedY = (Math.random() - 0.5) * 2;
                } else {
                    // 上下边缘
                    x = Math.random() * this.canvas.width;
                    y = Math.random() < 0.5 ? -size : this.canvas.height + size;
                    speedX = (Math.random() - 0.5) * 2;
                    speedY = (y < 0 ? 1 : -1) * (1 + Math.random() * 2);
                }
                
                const enemy = new EnemyFish(x, y, size, color);
                enemy.speedX = speedX;
                enemy.speedY = speedY;
                this.enemies.push(enemy);
            }
        }
        
        // 更新玩家鱼
        if (this.mousePosition && this.playerFish) {
            console.log('更新玩家鱼位置:', {
                currentX: this.playerFish.x,
                currentY: this.playerFish.y,
                targetX: this.mousePosition.x,
                targetY: this.mousePosition.y
            });
            
            // 更新鱼的位置
            this.playerFish.moveToward(this.mousePosition.x, this.mousePosition.y);
            
            // 确保鱼不会游出画布
            this.playerFish.checkBounds(this.canvas.width, this.canvas.height);
            
            // 渲染鱼
            this.playerFish.render(this.ctx);
        }
        
        // 更新和渲染敌人
        this.enemies = this.enemies.filter(enemy => {
            enemy.update();
            
            // 检查与玩家的碰撞
            const dx = enemy.x - this.playerFish.x;
            const dy = enemy.y - this.playerFish.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (this.playerFish.size + enemy.size) * 0.8) {
                if (this.playerFish.size > enemy.size * 1.2) {
                    // 玩家吃掉敌人
                    this.score += Math.floor(enemy.size);
                    this.scoreElement.textContent = this.score;
                    this.playerFish.grow(enemy.size * 0.1);
                    this.audioManager.playSound('eat');
                    return false;
                } else if (enemy.size > this.playerFish.size * 1.2) {
                    // 玩家被吃
                    this.endGame();
                    return false;
                }
            }
            
            // 移除离开屏幕的敌人
            return !(enemy.x < -enemy.size * 2 || 
                    enemy.x > this.canvas.width + enemy.size * 2 ||
                    enemy.y < -enemy.size * 2 || 
                    enemy.y > this.canvas.height + enemy.size * 2);
        });
        
        // 渲染所有敌人
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // 继续游戏循环
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    checkCollision(fish1, fish2) {
        // 简单的圆形碰撞检测
        var dx = fish1.x - fish2.x;
        var dy = fish1.y - fish2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (fish1.size + fish2.size) * 0.6;
    }
    
    clearLeaderboard() {
        // 显示确认对话框
        if (confirm(SimpleI18n.getText('confirm_clear', '确定要清除所有排行榜记录吗？此操作不可撤销。'))) {
            console.log('清除排行榜');
            // 清空排行榜数据
            this.leaderboard = [];
            this.currentPlayerId = null;
            
            // 保存到本地存储
            this.saveLeaderboard();
            
            // 更新排行榜显示
            this.updateLeaderboardDisplay();
            
            // 显示提示
            alert(SimpleI18n.getText('cleared', '排行榜已清空'));
        }
    }
    
    // 初始化快速语言选择器
    initQuickLanguageSelector() {
        var languageButtons = document.querySelectorAll('.language-button');
        var currentLanguage = SimpleI18n.currentLanguage;
        
        console.log('初始化快速语言选择器，当前语言:', currentLanguage);
        
        languageButtons.forEach((button) => {
            var lang = button.dataset.lang;
            
            // 设置当前语言按钮为活动状态
            if (lang === currentLanguage) {
                button.classList.add('active');
            }
            
            // 添加点击事件
            button.addEventListener('click', () => {
                if (this.audioManager) {
                    this.audioManager.playSound('click');
                }
                
                // 更新按钮状态
                languageButtons.forEach((btn) => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // 切换语言
                SimpleI18n.changeLanguage(lang);
            });
        });
    }
    
    updateLanguageSettings() {
        var languageList = document.getElementById('languageList');
        if (!languageList) return;
        
        languageList.innerHTML = '';
        var languages = [
            { code: 'zh-CN', name: '简体中文' },
            { code: 'en', name: 'English' },
            { code: 'fr', name: 'Français' }
        ];
        
        languages.forEach((lang) => {
            var button = document.createElement('button');
            button.className = 'language-button';
            button.textContent = lang.name;
            button.onclick = () => {
                SimpleI18n.changeLanguage(lang.code);
                this.hideLanguageSettings();
            };
            languageList.appendChild(button);
        });
    }
    
    // 显示语言设置界面
    showLanguageSettings() {
        if (this.languageSettingsScreen) {
            this.languageSettingsScreen.style.display = 'block';
            this.updateLanguageSettings();
        }
    }
    
    // 隐藏语言设置界面
    hideLanguageSettings() {
        if (this.languageSettingsScreen) {
            this.languageSettingsScreen.style.display = 'none';
        }
    }
    
    // 切换静音状态
    toggleMute() {
        var isMuted = this.audioManager.toggleMute();
        this.updateMuteButtonState();
        
        // 播放/停止背景音乐
        if (this.gameRunning) {
            if (isMuted) {
                // 已静音，停止背景音乐
                this.audioManager.stopBGM();
            } else {
                // 取消静音，播放背景音乐
                this.audioManager.playBGM();
            }
        }
    }
    
    // 更新静音按钮状态
    updateMuteButtonState() {
        if (this.muteButton) {
            this.muteButton.textContent = this.audioManager.isMuted ? '🔇' : '🔊';
            this.muteButton.title = this.audioManager.isMuted ? '取消静音' : '静音';
        }
    }
    
    // 显示音量设置界面
    showSoundSettings() {
        // 隐藏其他界面
        if (this.gameStartScreen) this.gameStartScreen.classList.add('hidden');
        if (this.gameOverScreen) this.gameOverScreen.classList.add('hidden');
        if (this.leaderboardScreen) this.leaderboardScreen.classList.add('hidden');
        
        // 显示音量设置界面
        if (this.soundSettingsScreen) this.soundSettingsScreen.classList.remove('hidden');
    }
    
    // 隐藏音量设置界面
    hideSoundSettings() {
        if (this.soundSettingsScreen) this.soundSettingsScreen.classList.add('hidden');
        
        // 如果游戏结束了，显示游戏结束界面
        if (!this.gameRunning && this.score > 0) {
            if (this.gameOverScreen) this.gameOverScreen.classList.remove('hidden');
        } else {
            // 否则显示开始界面
            if (this.gameStartScreen) this.gameStartScreen.classList.remove('hidden');
        }
    }
}

// 当DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化游戏');
    window.game = new Game();
}); 