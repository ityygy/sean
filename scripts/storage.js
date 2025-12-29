// 数据存储管理模块
// 定义为全局类，确保浏览器能直接访问
window.StorageManager = class StorageManager {
    constructor() {
        this.init();
    }

    // 初始化存储
    init() {
        if (!localStorage.getItem('initialized')) {
            this.loadInitialData();
            localStorage.setItem('initialized', 'true');
        } else {
            // 检查是否需要补充初始商城物品
            const storeItems = this.getStoreItems();
            if (storeItems.length === 0) {
                // 加载初始商城物品
                this.loadInitialStoreItems();
            }
        }
    }

    // 加载初始商城物品
    loadInitialStoreItems() {
        // 初始商城物品
        const initialStoreItems = [
            { name: '小猫咪贴纸', description: '可爱的小猫咪贴纸，装饰你的学习空间', price: 50, category: '贴纸', image: '🐱' },
            { name: '彩虹铅笔', description: '彩色铅笔套装，让你的绘画更有趣', price: 100, category: '文具', image: '🌈✏️' },
            { name: '魔法橡皮擦', description: '可以擦除所有错误的魔法橡皮擦', price: 80, category: '文具', image: '🧙‍♀️🧽' },
            { name: '星星笔记本', description: '带有星星图案的精美笔记本', price: 120, category: '文具', image: '⭐📒' },
            { name: '小熊玩偶', description: '柔软可爱的小熊玩偶', price: 200, category: '玩具', image: '🧸' },
            { name: '太空飞船模型', description: '精美的太空飞船模型', price: 250, category: '玩具', image: '🚀' },
            { name: '彩虹雨伞', description: '彩色雨伞，让雨天更有趣', price: 180, category: '生活用品', image: '🌈☂️' },
            { name: '音乐盒', description: '播放美妙音乐的音乐盒', price: 300, category: '玩具', image: '🎵📦' }
        ];
        
        // 保存初始商城物品
        initialStoreItems.forEach(item => {
            this.saveStoreItem(item);
        });
    }

    // 加载初始数据
    loadInitialData() {
        // 直接定义初始数据，避免动态导入
        const adminUser = {
            username: 'admin',
            password: 'YWRtaW4xMjM=', // admin123 加密后
            grade: 0,
            class: 0,
            school: '管理员',
            score: 0,
            completedQuestions: [],
            ownedItems: [],
            purchaseHistory: [],
            role: 'admin'
        };
        
        const initialQuestions = [
            // 一年级单词
            { type: 'word', grade: 1, chinese: '苹果', english: 'apple', score: 5 },
            { type: 'word', grade: 1, chinese: '香蕉', english: 'banana', score: 5 },
            { type: 'word', grade: 1, chinese: '猫', english: 'cat', score: 5 },
            { type: 'word', grade: 1, chinese: '狗', english: 'dog', score: 5 },
            { type: 'word', grade: 1, chinese: '大象', english: 'elephant', score: 5 },
            { type: 'word', grade: 1, chinese: '鱼', english: 'fish', score: 5 },
            { type: 'word', grade: 1, chinese: '绿色', english: 'green', score: 5 },
            { type: 'word', grade: 1, chinese: '红色', english: 'red', score: 5 },
            { type: 'word', grade: 1, chinese: '蓝色', english: 'blue', score: 5 },
            { type: 'word', grade: 1, chinese: '黄色', english: 'yellow', score: 5 },
            // 二年级单词
            { type: 'word', grade: 2, chinese: '书包', english: 'bag', score: 6 },
            { type: 'word', grade: 2, chinese: '书', english: 'book', score: 6 },
            { type: 'word', grade: 2, chinese: '铅笔', english: 'pencil', score: 6 },
            { type: 'word', grade: 2, chinese: '钢笔', english: 'pen', score: 6 },
            { type: 'word', grade: 2, chinese: '尺子', english: 'ruler', score: 6 },
            // 一年级句子
            { type: 'sentence', grade: 1, chinese: '这是一个苹果。', english: 'This is an apple.', score: 10 },
            { type: 'sentence', grade: 1, chinese: '我有一只猫。', english: 'I have a cat.', score: 10 },
            { type: 'sentence', grade: 1, chinese: '它是红色的。', english: 'It is red.', score: 10 },
            // 二年级句子
            { type: 'sentence', grade: 2, chinese: '我喜欢香蕉。', english: 'I like bananas.', score: 12 },
            { type: 'sentence', grade: 2, chinese: '这是我的书包。', english: 'This is my bag.', score: 12 },
            { type: 'sentence', grade: 2, chinese: '我有一支铅笔。', english: 'I have a pencil.', score: 12 }
        ];
        
        // 初始商城物品
        const initialStoreItems = [
            { name: '小猫咪贴纸', description: '可爱的小猫咪贴纸，装饰你的学习空间', price: 50, category: '贴纸', image: '🐱' },
            { name: '彩虹铅笔', description: '彩色铅笔套装，让你的绘画更有趣', price: 100, category: '文具', image: '🌈✏️' },
            { name: '魔法橡皮擦', description: '可以擦除所有错误的魔法橡皮擦', price: 80, category: '文具', image: '🧙‍♀️🧽' },
            { name: '星星笔记本', description: '带有星星图案的精美笔记本', price: 120, category: '文具', image: '⭐📒' },
            { name: '小熊玩偶', description: '柔软可爱的小熊玩偶', price: 200, category: '玩具', image: '🧸' },
            { name: '太空飞船模型', description: '精美的太空飞船模型', price: 250, category: '玩具', image: '🚀' },
            { name: '彩虹雨伞', description: '彩色雨伞，让雨天更有趣', price: 180, category: '生活用品', image: '🌈☂️' },
            { name: '音乐盒', description: '播放美妙音乐的音乐盒', price: 300, category: '玩具', image: '🎵📦' }
        ];
        
        // 保存管理员用户
        this.saveUser(adminUser);
        
        // 保存初始题库
        initialQuestions.forEach(question => {
            this.saveQuestion(question);
        });
        
        // 保存初始商城物品
        initialStoreItems.forEach(item => {
            this.saveStoreItem(item);
        });
    }

    // 密码加密（简单的Base64编码）
    encryptPassword(password) {
        return btoa(password);
    }

    // 密码解密
    decryptPassword(encryptedPassword) {
        return atob(encryptedPassword);
    }

    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 用户相关方法
    
    // 保存用户
    saveUser(user) {
        // 确保用户对象包含所有必要的数组属性
        if (!user.completedQuestions) {
            user.completedQuestions = [];
        }
        if (!user.ownedItems) {
            user.ownedItems = [];
        }
        if (!user.purchaseHistory) {
            user.purchaseHistory = [];
        }
        
        const users = this.getUsers();
        const existingIndex = users.findIndex(u => u.username === user.username);
        
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        return user;
    }

    // 获取所有用户
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    // 根据用户名获取用户
    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }

    // 删除用户
    deleteUser(username) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.username !== username);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        return filteredUsers.length < users.length;
    }

    // 验证用户登录
    validateLogin(username, password) {
        const user = this.getUserByUsername(username);
        if (!user) return null;
        
        const decryptedPassword = this.decryptPassword(user.password);
        if (decryptedPassword === password) {
            return user;
        }
        return null;
    }

    // 题目相关方法
    
    // 保存题目
    saveQuestion(question) {
        const questions = this.getQuestions();
        const existingIndex = questions.findIndex(q => q.id === question.id);
        
        if (existingIndex >= 0) {
            questions[existingIndex] = question;
        } else {
            question.id = this.generateId();
            questions.push(question);
        }
        
        localStorage.setItem('questions', JSON.stringify(questions));
        return question;
    }

    // 获取所有题目
    getQuestions() {
        return JSON.parse(localStorage.getItem('questions') || '[]');
    }

    // 根据类型和年级获取题目
    getQuestionsByTypeAndGrade(type, grade) {
        const questions = this.getQuestions();
        return questions.filter(q => q.type === type && q.grade === grade);
    }

    // 根据ID获取题目
    getQuestionById(id) {
        const questions = this.getQuestions();
        return questions.find(q => q.id === id);
    }

    // 删除题目
    deleteQuestion(id) {
        const questions = this.getQuestions();
        const filteredQuestions = questions.filter(q => q.id !== id);
        localStorage.setItem('questions', JSON.stringify(filteredQuestions));
        return filteredQuestions.length < questions.length;
    }

    // 批量导入题目
    batchImportQuestions(questions) {
        const existingQuestions = this.getQuestions();
        const newQuestions = questions.map(q => ({
            ...q,
            id: this.generateId()
        }));
        
        const allQuestions = [...existingQuestions, ...newQuestions];
        localStorage.setItem('questions', JSON.stringify(allQuestions));
        return newQuestions;
    }

    // 商城物品相关方法
    
    // 保存商城物品
    saveStoreItem(item) {
        const items = this.getStoreItems();
        const existingIndex = items.findIndex(i => i.id === item.id);
        
        if (existingIndex >= 0) {
            items[existingIndex] = item;
        } else {
            item.id = this.generateId();
            items.push(item);
        }
        
        localStorage.setItem('storeItems', JSON.stringify(items));
        return item;
    }

    // 获取所有商城物品
    getStoreItems() {
        return JSON.parse(localStorage.getItem('storeItems') || '[]');
    }

    // 根据ID获取商城物品
    getStoreItemById(id) {
        const items = this.getStoreItems();
        return items.find(item => item.id === id);
    }

    // 删除商城物品
    deleteStoreItem(id) {
        const items = this.getStoreItems();
        const filteredItems = items.filter(item => item.id !== id);
        localStorage.setItem('storeItems', JSON.stringify(filteredItems));
        return filteredItems.length < items.length;
    }

    // 根据分类获取商城物品
    getStoreItemsByCategory(category) {
        const items = this.getStoreItems();
        return category ? items.filter(item => item.category === category) : items;
    }

    // 用户购买物品
    purchaseItem(username, itemId) {
        const user = this.getUserByUsername(username);
        const item = this.getStoreItemById(itemId);
        
        if (!user || !item) {
            return false;
        }
        
        if (user.score < item.price) {
            return false;
        }
        
        // 扣除积分
        user.score -= item.price;
        
        // 添加物品到用户拥有的物品列表
        if (!user.ownedItems) {
            user.ownedItems = [];
        }
        
        if (!user.ownedItems.includes(itemId)) {
            user.ownedItems.push(itemId);
        }
        
        // 添加购买历史记录
        if (!user.purchaseHistory) {
            user.purchaseHistory = [];
        }
        
        // 记录购买历史
        const purchaseRecord = {
            transactionId: this.generateId(),
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            purchaseTime: new Date().toISOString(),
            username: username
        };
        
        user.purchaseHistory.push(purchaseRecord);
        
        this.saveUser(user);
        return true;
    }

    // 获取用户拥有的物品
    getUserOwnedItems(username) {
        const user = this.getUserByUsername(username);
        if (!user || !user.ownedItems) {
            return [];
        }
        
        const items = this.getStoreItems();
        return items.filter(item => user.ownedItems.includes(item.id));
    }
    
    // 获取用户购买历史
    getUserPurchaseHistory(username) {
        const user = this.getUserByUsername(username);
        if (!user || !user.purchaseHistory) {
            return [];
        }
        
        // 返回购买历史，按时间倒序排列
        return [...user.purchaseHistory].sort((a, b) => {
            return new Date(b.purchaseTime) - new Date(a.purchaseTime);
        });
    }

    // 获取所有用户的购买记录
    getAllPurchaseHistory() {
        const users = this.getUsers();
        let allRecords = [];
        
        // 收集所有用户的购买记录
        users.forEach(user => {
            if (user.purchaseHistory && user.purchaseHistory.length > 0) {
                allRecords = [...allRecords, ...user.purchaseHistory];
            }
        });
        
        // 按时间倒序排列
        return allRecords.sort((a, b) => {
            return new Date(b.purchaseTime) - new Date(a.purchaseTime);
        });
    }

    // 用户答题记录相关方法
    
    // 检查题目是否已完成
    isQuestionCompleted(userId, questionId) {
        const user = this.getUserByUsername(userId);
        if (!user.completedQuestions) {
            user.completedQuestions = [];
            this.saveUser(user);
        }
        return user.completedQuestions.includes(questionId);
    }

    // 记录完成的题目
    recordCompletedQuestion(userId, questionId) {
        const user = this.getUserByUsername(userId);
        if (!user.completedQuestions.includes(questionId)) {
            user.completedQuestions.push(questionId);
            this.saveUser(user);
        }
    }

    // 更新用户积分
    updateUserScore(username, scoreToAdd) {
        const user = this.getUserByUsername(username);
        user.score += scoreToAdd;
        this.saveUser(user);
        return user.score;
    }
};

// 创建全局存储管理器实例
window.storageManager = new window.StorageManager();