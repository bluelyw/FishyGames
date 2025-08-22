// 音频管理类 - 使用Web Audio API动态生成音效
class AudioManager {
    constructor() {
        // 音频状态
        this.isMuted = false;
        this.bgmVolume = 0.3;
        this.sfxVolume = 0.5;
        
        // 初始化Web Audio API
        this.audioContext = null;
        try {
            // 创建音频上下文
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            console.log('音频上下文创建成功');
        } catch (e) {
            console.error('Web Audio API不受支持:', e);
            this.audioAvailable = false;
            return;
        }
        
        this.audioAvailable = true;
        this.masterGainNode = this.audioContext.createGain();
        this.masterGainNode.connect(this.audioContext.destination);
        
        // 背景音乐振荡器和参数
        this.bgmPlaying = false;
        this.bgmOscillators = [];
        this.bgmGainNode = this.audioContext.createGain();
        this.bgmGainNode.connect(this.masterGainNode);
        this.bgmGainNode.gain.value = this.bgmVolume;
        
        // 从本地存储加载音频设置
        this.loadSettings();
    }
    
    // 加载音频设置
    loadSettings() {
        if (!this.audioAvailable) return;
        
        try {
            const settings = localStorage.getItem('fishGameAudioSettings');
            if (settings) {
                const { isMuted, bgmVolume, sfxVolume } = JSON.parse(settings);
                this.isMuted = isMuted;
                this.bgmVolume = bgmVolume;
                this.sfxVolume = sfxVolume;
                
                // 应用设置
                this.applySettings();
            }
        } catch (error) {
            console.error('加载音频设置失败:', error);
        }
    }
    
    // 保存音频设置
    saveSettings() {
        try {
            const settings = {
                isMuted: this.isMuted,
                bgmVolume: this.bgmVolume,
                sfxVolume: this.sfxVolume
            };
            localStorage.setItem('fishGameAudioSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存音频设置失败:', error);
        }
    }
    
    // 应用音频设置
    applySettings() {
        if (!this.audioAvailable) return;
        
        if (this.isMuted) {
            this.masterGainNode.gain.value = 0;
        } else {
            this.masterGainNode.gain.value = 1;
            this.bgmGainNode.gain.value = this.bgmVolume;
        }
    }
    
    // 播放背景音乐
    playBGM() {
        if (!this.audioAvailable || this.bgmPlaying) return;
        
        try {
            // 停止之前的背景音乐
            this.stopBGM();
            
            // 创建背景音乐 - 使用多个振荡器创建和弦
            const baseFrequency = 220; // A3音符
            const notes = [0, 4, 7, 12]; // 大三和弦加八度
            
            notes.forEach(semitones => {
                // 计算频率: f = baseFrequency * 2^(semitones/12)
                const frequency = baseFrequency * Math.pow(2, semitones / 12);
                
                // 创建振荡器
                const oscillator = this.audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.value = frequency;
                
                // 创建增益节点用于控制音量包络
                const gainNode = this.audioContext.createGain();
                gainNode.gain.value = 0;
                
                // 连接节点
                oscillator.connect(gainNode);
                gainNode.connect(this.bgmGainNode);
                
                // 启动振荡器
                oscillator.start();
                
                // 淡入
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 1);
                
                // 保存振荡器和增益节点以便后续停止
                this.bgmOscillators.push({ oscillator, gainNode });
            });
            
            // 创建LFO用于调制背景音乐
            const lfo = this.audioContext.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.1; // 非常慢的调制
            
            const lfoGain = this.audioContext.createGain();
            lfoGain.gain.value = 5; // 调制深度
            
            lfo.connect(lfoGain);
            
            // 将LFO连接到第一个振荡器的频率
            if (this.bgmOscillators.length > 0) {
                lfoGain.connect(this.bgmOscillators[0].oscillator.frequency);
            }
            
            lfo.start();
            this.bgmOscillators.push({ oscillator: lfo, gainNode: lfoGain });
            
            this.bgmPlaying = true;
            console.log('背景音乐开始播放');
            
            // 设置定时器，每隔几秒改变音乐模式
            this.bgmInterval = setInterval(() => this.changeBGMPattern(), 8000);
            
        } catch (error) {
            console.error('播放背景音乐失败:', error);
        }
    }
    
    // 改变背景音乐模式
    changeBGMPattern() {
        if (!this.audioAvailable || !this.bgmPlaying || this.bgmOscillators.length < 4) return;
        
        try {
            // 随机选择一个音符改变
            const index = Math.floor(Math.random() * (this.bgmOscillators.length - 1)); // 排除LFO
            const oscillator = this.bgmOscillators[index].oscillator;
            
            // 随机选择一个新的频率
            const baseFrequency = 220;
            const possibleNotes = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16]; // 大调音阶的音符
            const semitones = possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
            const newFrequency = baseFrequency * Math.pow(2, semitones / 12);
            
            // 平滑过渡到新频率
            oscillator.frequency.setValueAtTime(oscillator.frequency.value, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(newFrequency, this.audioContext.currentTime + 2);
            
        } catch (error) {
            console.error('改变背景音乐模式失败:', error);
        }
    }
    
    // 停止背景音乐
    stopBGM() {
        if (!this.audioAvailable) return;
        
        try {
            // 停止所有振荡器
            if (this.bgmOscillators.length > 0) {
                // 淡出所有振荡器
                this.bgmOscillators.forEach(({ oscillator, gainNode }) => {
                    gainNode.gain.setValueAtTime(gainNode.gain.value, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
                    
                    // 0.5秒后停止振荡器
                    setTimeout(() => {
                        try {
                            oscillator.stop();
                            oscillator.disconnect();
                            gainNode.disconnect();
                        } catch (e) {
                            // 忽略已停止的振荡器错误
                        }
                    }, 500);
                });
                
                this.bgmOscillators = [];
            }
            
            // 清除定时器
            if (this.bgmInterval) {
                clearInterval(this.bgmInterval);
                this.bgmInterval = null;
            }
            
            this.bgmPlaying = false;
            console.log('背景音乐已停止');
            
        } catch (error) {
            console.error('停止背景音乐失败:', error);
        }
    }
    
    // 播放音效
    playSound(soundName) {
        if (!this.audioAvailable || this.isMuted) return;
        
        try {
            switch (soundName) {
                case 'eat':
                    this.playEatSound();
                    break;
                case 'gameOver':
                    this.playGameOverSound();
                    break;
                case 'levelUp':
                    this.playLevelUpSound();
                    break;
                case 'click':
                    this.playClickSound();
                    break;
                default:
                    console.error(`未知音效: ${soundName}`);
            }
        } catch (error) {
            console.error(`播放音效 ${soundName} 失败:`, error);
        }
    }
    
    // 吃鱼音效
    playEatSound() {
        // 创建音频缓冲区
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // 生成"吃"的声音 - 短促的下降音调
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const frequency = 800 - 600 * (t / duration);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-8 * t);
        }
        
        // 创建音源并播放
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        
        // 创建增益节点控制音量
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.sfxVolume;
        
        // 连接节点
        source.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        // 播放
        source.start();
    }
    
    // 游戏结束音效
    playGameOverSound() {
        // 创建多个振荡器产生悲伤的和弦
        const baseFrequency = 220; // A3
        const notes = [0, 3, 7]; // 小三和弦
        const duration = 2;
        
        notes.forEach((semitones, index) => {
            // 计算频率
            const frequency = baseFrequency * Math.pow(2, semitones / 12);
            
            // 创建振荡器
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            
            // 创建增益节点
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0;
            
            // 连接节点
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGainNode);
            
            // 设置音量包络
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, now + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, now + duration);
            
            // 设置频率下降
            oscillator.frequency.setValueAtTime(frequency, now);
            oscillator.frequency.linearRampToValueAtTime(frequency * 0.5, now + duration);
            
            // 启动振荡器
            oscillator.start();
            oscillator.stop(now + duration);
        });
    }
    
    // 升级音效
    playLevelUpSound() {
        // 创建上升的音阶
        const baseFrequency = 440; // A4
        const notes = [0, 4, 7, 12]; // 大三和弦加八度
        const duration = 0.15; // 每个音符的持续时间
        
        notes.forEach((semitones, index) => {
            // 计算频率
            const frequency = baseFrequency * Math.pow(2, semitones / 12);
            
            // 创建振荡器
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            
            // 创建增益节点
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0;
            
            // 连接节点
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGainNode);
            
            // 设置音量包络
            const now = this.audioContext.currentTime;
            const startTime = now + index * duration;
            const stopTime = startTime + duration * 1.2;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, startTime + duration * 0.1);
            gainNode.gain.linearRampToValueAtTime(0, stopTime);
            
            // 启动振荡器
            oscillator.start(startTime);
            oscillator.stop(stopTime);
        });
    }
    
    // 点击音效
    playClickSound() {
        // 创建音频缓冲区
        const duration = 0.1;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // 生成点击声音 - 短促的高音调
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-30 * t);
        }
        
        // 创建音源并播放
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        
        // 创建增益节点控制音量
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.sfxVolume * 0.5;
        
        // 连接节点
        source.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        // 播放
        source.start();
    }
    
    // 切换静音状态
    toggleMute() {
        if (!this.audioAvailable) return false;
        
        this.isMuted = !this.isMuted;
        this.applySettings();
        this.saveSettings();
        return this.isMuted;
    }
    
    // 设置背景音乐音量
    setBGMVolume(volume) {
        if (!this.audioAvailable) return;
        
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (!this.isMuted) {
            this.bgmGainNode.gain.value = this.bgmVolume;
        }
        this.saveSettings();
    }
    
    // 设置音效音量
    setSFXVolume(volume) {
        if (!this.audioAvailable) return;
        
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }
    
    // 恢复音频上下文（用于处理浏览器自动暂停音频的问题）
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('音频上下文已恢复');
            }).catch(error => {
                console.error('恢复音频上下文失败:', error);
            });
        }
    }
}

// 导出音频管理器实例
window.AudioManager = AudioManager; 