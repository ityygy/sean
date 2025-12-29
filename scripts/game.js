// 游戏核心逻辑
// 直接使用全局的storageManager对象

// 游戏状态管理
window.GameManager = class GameManager {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'game-menu';
        this.currentPracticeType = null;
        this.currentGrade = 1;
        this.practiceQuestions = [];
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.earnedScore = 0;
        this.practiceScore = 0;
        this.wrongAttempts = 0; // 跟踪当前题目的答错次数
        
        this.init();
    }

    // 初始化游戏
    init() {
        // 检查用户是否登录
        this.checkLogin();
        
        // 绑定事件
        this.bindEvents();
        
        // 更新用户信息
        this.updateUserInfo();
    }

    // 检查用户是否登录
    checkLogin() {
        try {
            const userStr = sessionStorage.getItem('currentUser');
            console.log('当前sessionStorage用户:', userStr);
            
            if (!userStr) {
                // 未登录，跳转到登录页面
                console.log('未登录，跳转到index.html');
                window.location.replace('index.html');
                return;
            }
            this.currentUser = JSON.parse(userStr);
            console.log('解析后的用户信息:', this.currentUser);
        } catch (error) {
            console.error('检查登录失败:', error);
            // 发生错误，跳转到登录页面
            window.location.replace('index.html');
        }
    }

    // 绑定事件
    bindEvents() {
        // 菜单按钮事件
        document.getElementById('start-practice-btn').addEventListener('click', () => {
            this.showSection('practice-select');
        });



        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // 练习选择事件
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            this.showSection('game-menu');
        });

        document.getElementById('word-practice-btn').addEventListener('click', () => {
            this.startPractice('word');
        });

        document.getElementById('sentence-practice-btn').addEventListener('click', () => {
            this.startPractice('sentence');
        });

        // 单词练习事件
        document.getElementById('check-answer-btn').addEventListener('click', () => {
            this.checkWordAnswer();
        });

        document.getElementById('next-question-btn').addEventListener('click', () => {
            this.nextWordQuestion();
        });

        // 句子练习事件
        document.getElementById('check-sentence-btn').addEventListener('click', () => {
            this.checkSentenceAnswer();
        });

        document.getElementById('next-sentence-btn').addEventListener('click', () => {
            this.nextSentenceQuestion();
        });

        document.getElementById('back-from-word-btn').addEventListener('click', () => {
            this.showSection('practice-select');
        });

        document.getElementById('back-from-sentence-btn').addEventListener('click', () => {
            this.showSection('practice-select');
        });



        // 练习结果事件
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.showSection('practice-select');
        });

        document.getElementById('back-to-menu-from-result-btn').addEventListener('click', () => {
            this.showSection('game-menu');
        });

        // 输入框回车事件
        document.getElementById('english-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkWordAnswer();
            }
        });

        document.getElementById('sentence-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkSentenceAnswer();
            }
        });

        // 发音播放按钮事件
        document.getElementById('play-word-audio').addEventListener('click', () => {
            this.playWordAudio();
        });

        document.getElementById('play-sentence-audio').addEventListener('click', () => {
            this.playSentenceAudio();
        });

        // 积分商城事件
        document.getElementById('shop-btn').addEventListener('click', () => {
            this.showShop();
        });

        document.getElementById('back-from-shop-btn').addEventListener('click', () => {
            this.showSection('game-menu');
        });

        // 个人中心事件
        document.getElementById('profile-btn').addEventListener('click', () => {
            this.showProfile();
        });

        document.getElementById('back-from-profile-btn').addEventListener('click', () => {
            this.showSection('game-menu');
        });

        // 商城分类事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                const category = e.target.dataset.category;
                this.filterShopItems(category);
            }
        });

        // 排行榜事件
        document.getElementById('leaderboard-btn').addEventListener('click', () => {
            this.showLeaderboard();
        });

        document.getElementById('back-from-leaderboard-btn').addEventListener('click', () => {
            this.showSection('game-menu');
        });
    }

    // 显示指定区域
    showSection(sectionId) {
        // 隐藏所有区域
        document.querySelectorAll('.game-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // 显示指定区域
        document.getElementById(sectionId).classList.add('active');
        this.currentSection = sectionId;
    }

    // 更新用户信息
    updateUserInfo() {
        if (!this.currentUser) return;
        
        document.getElementById('user-name').textContent = this.currentUser.username;
        document.getElementById('user-score').textContent = this.currentUser.score;
    }

    // 退出登录
    logout() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    // 开始练习
    startPractice(type) {
        this.currentPracticeType = type;
        this.currentGrade = parseInt(document.getElementById('grade-select').value);
        
        // 获取题目
        this.loadPracticeQuestions();
        
        // 初始化练习状态
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.earnedScore = 0;
        this.practiceScore = 0;
        this.wrongAttempts = 0; // 重置答错次数
        
        // 显示练习界面
        this.showSection(type === 'word' ? 'word-practice' : 'sentence-practice');
        
        // 显示第一题
        this.showCurrentQuestion();
    }

    // 获取练习题目
    loadPracticeQuestions() {
        const allQuestions = window.storageManager.getQuestionsByTypeAndGrade(
            this.currentPracticeType, 
            this.currentGrade
        );
        
        // 随机选择20题，确保不重复
        this.practiceQuestions = this.getRandomQuestions(allQuestions, 20);
    }

    // 随机获取指定数量的题目
    getRandomQuestions(questions, count) {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    // 显示当前题目
    showCurrentQuestion() {
        if (this.currentQuestionIndex >= this.practiceQuestions.length) {
            // 练习完成
            this.showPracticeResult();
            return;
        }

        // 重置当前题目的答错次数
        this.wrongAttempts = 0;

        const question = this.practiceQuestions[this.currentQuestionIndex];
        
        // 计算进度百分比
        const progressPercent = ((this.currentQuestionIndex + 1) / this.practiceQuestions.length) * 100;
        
        if (this.currentPracticeType === 'word') {
            // 显示单词题目
            document.getElementById('chinese-word').textContent = question.chinese;
            document.getElementById('english-answer').value = '';
            document.getElementById('feedback').textContent = '';
            document.getElementById('feedback').className = 'feedback modern-feedback';
            document.getElementById('english-answer').focus();
            
            // 更新题目计数和进度条
            document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
            document.getElementById('practice-current-score').textContent = this.practiceScore;
            
            // 更新进度条
            const progressFill = document.getElementById('word-progress-fill');
            if (progressFill) {
                progressFill.style.width = `${progressPercent}%`;
            }
        } else {
            // 显示句子题目
            document.getElementById('chinese-sentence').textContent = question.chinese;
            document.getElementById('sentence-answer').value = '';
            document.getElementById('sentence-feedback').textContent = '';
            document.getElementById('sentence-feedback').className = 'feedback modern-feedback';
            document.getElementById('sentence-answer').focus();
            
            // 更新题目计数和进度条
            document.getElementById('sentence-current-question').textContent = this.currentQuestionIndex + 1;
            document.getElementById('sentence-current-score').textContent = this.practiceScore;
            
            // 更新进度条
            const progressFill = document.getElementById('sentence-progress-fill');
            if (progressFill) {
                progressFill.style.width = `${progressPercent}%`;
            }
        }
    }

    // 检查单词答案
    checkWordAnswer() {
        const answerInput = document.getElementById('english-answer');
        const userAnswer = answerInput.value.trim().toLowerCase();
        const question = this.practiceQuestions[this.currentQuestionIndex];
        const feedbackDiv = document.getElementById('feedback');
        
        if (!question) {
            feedbackDiv.textContent = '题目加载中...';
            feedbackDiv.className = 'feedback modern-feedback';
            return;
        }
        
        const correctAnswer = question.english.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            // 答对了
            feedbackDiv.textContent = '回答正确！';
            feedbackDiv.className = 'feedback correct modern-feedback';
            
            // 检查题目是否已经完成
            const isCompleted = window.storageManager.isQuestionCompleted(this.currentUser.username, question.id);
            
            if (!isCompleted) {
                // 未完成，奖励积分
                // 使用题目本身的分值作为奖励
                const scoreToAdd = question.score;
                
                // 直接奖励积分
                console.log('=== 积分奖励调试信息 ===');
                console.log('当前用户:', this.currentUser.username);
                console.log('当前题目:', question);
                console.log('题目分值:', scoreToAdd);
                
                // 执行积分奖励逻辑
                console.log('执行积分奖励逻辑');
                
                // 增加练习积分
                this.earnedScore += scoreToAdd;
                this.practiceScore += scoreToAdd;
                
                // 更新用户积分
                const updatedScore = window.storageManager.updateUserScore(this.currentUser.username, scoreToAdd);
                console.log('storageManager更新后的积分:', updatedScore);
                
                // 显示奖励动画
                this.showRewardAnimation(`+${scoreToAdd}`);
                
                // 更新用户信息
                this.currentUser.score = updatedScore; // 直接使用storageManager返回的最新积分
                this.updateUserInfo();
                
                // 更新练习积分显示
                document.getElementById('practice-current-score').textContent = this.practiceScore;
                
                // 记录完成的题目
                window.storageManager.recordCompletedQuestion(this.currentUser.username, question.id);
                console.log('记录完成的题目:', question.id);
                console.log('=== 积分奖励调试结束 ===');
            }
            
            this.correctCount++;
            this.wrongAttempts = 0; // 重置答错次数
        } else {
            // 答错了，不跳转，需要重新答题
            this.wrongAttempts++;
            
            if (this.wrongAttempts === 2) {
                // 答错两次，显示正确答案
                feedbackDiv.textContent = `回答错误！正确答案是：${question.english}`;
                feedbackDiv.className = 'feedback incorrect modern-feedback';
                // 不清空输入框，让用户看到正确答案
            } else {
                feedbackDiv.textContent = '回答错误，请重试！';
                feedbackDiv.className = 'feedback incorrect modern-feedback';
                // 清空输入框，方便重新输入
                answerInput.value = '';
            }
            
            // 聚焦输入框
            answerInput.focus();
        }
    }

    // 下一题（单词练习）
    nextWordQuestion() {
        this.currentQuestionIndex++;
        this.showCurrentQuestion();
    }

    // 检查句子答案
    checkSentenceAnswer() {
        const answerInput = document.getElementById('sentence-answer');
        const userAnswer = answerInput.value.trim().toLowerCase();
        const question = this.practiceQuestions[this.currentQuestionIndex];
        const feedbackDiv = document.getElementById('sentence-feedback');
        
        if (question) {
            const correctAnswer = question.english.toLowerCase();
            
            if (userAnswer === correctAnswer) {
                // 答对了
                feedbackDiv.textContent = '回答正确！';
                feedbackDiv.className = 'feedback correct modern-feedback';
                
                // 检查题目是否已经完成
                const isCompleted = window.storageManager.isQuestionCompleted(this.currentUser.username, question.id);
                
                if (!isCompleted) {
                    // 未完成，奖励积分
                    // 使用题目本身的分值作为奖励
                    const scoreToAdd = question.score;
                    
                    // 直接奖励积分
                    console.log('=== 句子练习积分奖励调试信息 ===');
                    console.log('当前用户:', this.currentUser.username);
                    console.log('当前题目:', question);
                    console.log('题目分值:', scoreToAdd);
                    
                    // 执行积分奖励逻辑
                    console.log('执行句子练习积分奖励逻辑');
                    
                    // 增加练习积分
                    this.earnedScore += scoreToAdd;
                    this.practiceScore += scoreToAdd;
                    
                    // 更新用户积分
                    const updatedScore = window.storageManager.updateUserScore(this.currentUser.username, scoreToAdd);
                    console.log('storageManager更新后的积分:', updatedScore);
                    
                    // 显示奖励动画
                    this.showRewardAnimation(`+${scoreToAdd}`);
                    
                    // 更新用户信息
                    this.currentUser.score = updatedScore; // 直接使用storageManager返回的最新积分
                    this.updateUserInfo();
                    
                    // 更新练习积分显示
                    document.getElementById('sentence-current-score').textContent = this.practiceScore;
                    
                    // 记录完成的题目
                    window.storageManager.recordCompletedQuestion(this.currentUser.username, question.id);
                    console.log('记录完成的题目:', question.id);
                    console.log('=== 句子练习积分奖励调试结束 ===');
                }
                
                this.correctCount++;
                this.wrongAttempts = 0; // 重置答错次数
            } else {
                // 答错了，不跳转，需要重新答题
                this.wrongAttempts++;
                
                if (this.wrongAttempts === 2) {
                    // 答错两次，显示正确答案
                    feedbackDiv.textContent = `回答错误！正确答案是：${question.english}`;
                    feedbackDiv.className = 'feedback incorrect modern-feedback';
                    // 不清空输入框，让用户看到正确答案
                } else {
                    feedbackDiv.textContent = '回答错误，请重试！';
                    feedbackDiv.className = 'feedback incorrect modern-feedback';
                    // 清空输入框，方便重新输入
                    answerInput.value = '';
                }
                
                // 聚焦输入框
                answerInput.focus();
            }
        } else {
            feedbackDiv.textContent = '题目加载中...';
            feedbackDiv.className = 'feedback modern-feedback';
        }
    }

    // 下一题（句子练习）
    nextSentenceQuestion() {
        this.currentQuestionIndex++;
        this.showCurrentQuestion();
    }

    // 显示奖励动画
    showRewardAnimation(text) {
        const rewardEl = document.getElementById('reward-animation');
        rewardEl.textContent = text;
        rewardEl.style.display = 'block';
        
        // 动画结束后隐藏
        setTimeout(() => {
            rewardEl.style.display = 'none';
        }, 1000);
    }

    // 显示练习结果
    showPracticeResult() {
        // 计算正确率
        const accuracy = Math.round((this.correctCount / this.practiceQuestions.length) * 100);
        
        // 更新结果显示
        document.getElementById('correct-count').textContent = this.correctCount;
        document.getElementById('earned-score').textContent = this.earnedScore;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        
        // 显示结果界面
        this.showSection('practice-result');
    }



    // 播放单词发音
    playWordAudio() {
        if (this.currentQuestionIndex < this.practiceQuestions.length) {
            const question = this.practiceQuestions[this.currentQuestionIndex];
            this.playAudio(question.english);
        }
    }

    // 播放句子发音
    playSentenceAudio() {
        if (this.currentQuestionIndex < this.practiceQuestions.length) {
            const question = this.practiceQuestions[this.currentQuestionIndex];
            this.playAudio(question.english);
        }
    }

    // 通用播放音频方法
    playAudio(text) {
        // 检查浏览器是否支持Web Speech API
        if ('speechSynthesis' in window) {
            // 停止当前正在播放的语音
            window.speechSynthesis.cancel();
            
            // 创建语音对象
            const utterance = new SpeechSynthesisUtterance(text);
            
            // 设置语音属性
            utterance.lang = 'en-US'; // 使用美式英语发音
            utterance.rate = 0.9; // 语速稍慢，便于听清
            utterance.pitch = 1.0; // 正常音调
            utterance.volume = 1.0; // 最大音量
            
            // 播放语音
            window.speechSynthesis.speak(utterance);
        } else {
            alert('您的浏览器不支持语音播放功能');
        }
    }

    // 积分商城功能
    
    // 显示商城
    showShop() {
        // 更新商城积分显示
        document.getElementById('shop-score').textContent = this.currentUser.score;
        
        // 显示商城界面
        this.showSection('shop-section');
        
        // 加载所有物品
        const items = window.storageManager.getStoreItems();
        this.renderShopItems(items);
    }

    // 渲染商城物品
    renderShopItems(items) {
        const shopGrid = document.getElementById('shop-items-grid');
        
        // 清空现有物品
        shopGrid.innerHTML = '';
        
        // 渲染物品
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'shop-item-card';
            
            // 检查用户是否已拥有该物品
            const isOwned = this.currentUser.ownedItems && this.currentUser.ownedItems.includes(item.id);
            
            // 检查用户积分是否足够
            const canAfford = this.currentUser.score >= item.price;
            
            itemCard.innerHTML = `
                <span class="item-image">${item.image}</span>
                <h3 class="item-name">${item.name}</h3>
                <span class="item-category">${item.category}</span>
                <p class="item-description">${item.description}</p>
                <div class="item-price">${item.price} 积分</div>
                <button class="buy-btn" onclick="gameManager.buyItem('${item.id}')" ${isOwned ? 'disabled' : ''} ${!canAfford ? 'disabled' : ''}>
                    ${isOwned ? '已拥有' : '购买'}
                </button>
            `;
            
            shopGrid.appendChild(itemCard);
        });
    }

    // 按分类筛选商城物品
    filterShopItems(category) {
        // 更新分类按钮状态
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // 获取筛选后的物品
        const items = window.storageManager.getStoreItemsByCategory(category);
        this.renderShopItems(items);
    }

    // 购买物品
    buyItem(itemId) {
        // 购买物品
        const success = window.storageManager.purchaseItem(this.currentUser.username, itemId);
        
        if (success) {
            // 更新用户信息
            this.currentUser = window.storageManager.getUserByUsername(this.currentUser.username);
            this.updateUserInfo();
            
            // 更新商城积分显示
            document.getElementById('shop-score').textContent = this.currentUser.score;
            
            // 重新渲染物品
            const activeCategory = document.querySelector('.category-btn.active').dataset.category;
            const items = window.storageManager.getStoreItemsByCategory(activeCategory);
            this.renderShopItems(items);
            
            // 显示购买成功提示
            alert('购买成功！');
        } else {
            alert('购买失败，积分不足或物品不存在！');
        }
    }

    // 个人中心功能
    
    // 显示个人中心
    showProfile() {
        // 更新个人信息
        document.getElementById('profile-username').textContent = this.currentUser.username;
        document.getElementById('profile-grade').textContent = this.currentUser.grade;
        document.getElementById('profile-class').textContent = this.currentUser.class;
        document.getElementById('profile-school').textContent = this.currentUser.school;
        document.getElementById('profile-score').textContent = this.currentUser.score;
        
        // 渲染拥有的物品
        this.renderOwnedItems();
        
        // 显示个人中心界面
        this.showSection('profile-section');
    }

    // 渲染用户拥有的物品
    renderOwnedItems() {
        const ownedItemsGrid = document.getElementById('owned-items-grid');
        
        // 获取用户拥有的物品
        const ownedItems = window.storageManager.getUserOwnedItems(this.currentUser.username);
        
        // 清空现有物品
        ownedItemsGrid.innerHTML = '';
        
        // 渲染物品
        if (ownedItems.length === 0) {
            ownedItemsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666; font-size: 1.1em;">您还没有购买任何物品，去商城看看吧！</p>';
            return;
        }
        
        ownedItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'owned-item-card';
            
            itemCard.innerHTML = `
                <span class="owned-item-image">${item.image}</span>
                <h4 class="owned-item-name">${item.name}</h4>
                <span class="owned-item-category">${item.category}</span>
            `;
            
            ownedItemsGrid.appendChild(itemCard);
        });
    }

    // 显示排行榜
    showLeaderboard() {
        // 显示排行榜界面
        this.showSection('leaderboard-section');
        
        // 加载排行榜数据
        this.loadLeaderboardData();
    }

    // 加载排行榜数据
    loadLeaderboardData() {
        // 获取所有用户数据
        const users = window.storageManager.getUsers();
        
        // 按积分降序排序
        const sortedUsers = users.sort((a, b) => b.score - a.score);
        
        // 渲染前三名
        this.renderTopThreeUsers(sortedUsers);
        
        // 渲染完整排行榜
        this.renderLeaderboardTable(sortedUsers);
    }

    // 渲染前三名用户
    renderTopThreeUsers(users) {
        // 前三名用户
        const firstUser = users[0] || null;
        const secondUser = users[1] || null;
        const thirdUser = users[2] || null;
        
        // 渲染第一名
        if (firstUser) {
            document.getElementById('game-first-username').textContent = firstUser.username;
            document.getElementById('game-first-score').textContent = firstUser.score;
            document.getElementById('game-first-grade-class').textContent = `${firstUser.grade}年级${firstUser.class}班`;
        } else {
            document.getElementById('game-first-username').textContent = '暂无用户';
            document.getElementById('game-first-score').textContent = '0';
            document.getElementById('game-first-grade-class').textContent = '--年级--班';
        }
        
        // 渲染第二名
        if (secondUser) {
            document.getElementById('game-second-username').textContent = secondUser.username;
            document.getElementById('game-second-score').textContent = secondUser.score;
            document.getElementById('game-second-grade-class').textContent = `${secondUser.grade}年级${secondUser.class}班`;
        } else {
            document.getElementById('game-second-username').textContent = '暂无用户';
            document.getElementById('game-second-score').textContent = '0';
            document.getElementById('game-second-grade-class').textContent = '--年级--班';
        }
        
        // 渲染第三名
        if (thirdUser) {
            document.getElementById('game-third-username').textContent = thirdUser.username;
            document.getElementById('game-third-score').textContent = thirdUser.score;
            document.getElementById('game-third-grade-class').textContent = `${thirdUser.grade}年级${thirdUser.class}班`;
        } else {
            document.getElementById('game-third-username').textContent = '暂无用户';
            document.getElementById('game-third-score').textContent = '0';
            document.getElementById('game-third-grade-class').textContent = '--年级--班';
        }
    }

    // 渲染完整排行榜表格
    renderLeaderboardTable(users) {
        const tableBody = document.getElementById('game-leaderboard-body');
        
        // 清空表格内容
        tableBody.innerHTML = '';
        
        // 渲染用户数据
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            
            // 根据排名添加不同的样式类
            let rankClass = '';
            if (index === 0) rankClass = 'first-rank';
            else if (index === 1) rankClass = 'second-rank';
            else if (index === 2) rankClass = 'third-rank';
            
            row.className = rankClass;
            
            // 渲染行内容
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.grade}</td>
                <td>${user.class}</td>
                <td>${user.school}</td>
                <td>${user.score}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
};

// 初始化游戏管理器
document.addEventListener('DOMContentLoaded', () => {
    console.log('初始化GameManager');
    window.gameManager = new window.GameManager();
});