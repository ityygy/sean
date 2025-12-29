// 主页面逻辑（登录/注册）
// 直接使用全局的storageManager对象

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 绑定事件
    bindEvents();
});

// 绑定事件
function bindEvents() {
    // 切换到注册表单
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    
    // 切换到登录表单
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    // 登录表单提交
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
    
    // 注册表单提交
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });
}

// 显示注册表单
function showRegisterForm() {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('register-box').style.display = 'block';
}

// 显示登录表单
function showLoginForm() {
    document.getElementById('register-box').style.display = 'none';
    document.getElementById('login-box').style.display = 'block';
}

// 显示消息
function showMessage(message, type) {
    // 移除已存在的消息
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新消息
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // 添加到登录或注册表单
    const currentBox = document.getElementById('login-box').style.display === 'block' 
        ? document.getElementById('login-box') 
        : document.getElementById('register-box');
    
    currentBox.insertBefore(messageDiv, currentBox.firstChild);
    
    // 3秒后自动移除消息
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 处理登录
function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        console.log('登录尝试:', username, password);
        
        // 验证登录
        const user = window.storageManager.validateLogin(username, password);
        
        console.log('登录结果:', user);
        
        if (user) {
            // 保存当前用户到sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            console.log('保存到sessionStorage:', user);
            
            // 根据用户角色跳转到不同页面
            if (user.role === 'admin') {
                console.log('跳转到admin.html');
                window.location.replace('admin.html');
            } else {
                console.log('跳转到game.html');
                window.location.replace('game.html');
            }
        } else {
            showMessage('用户名或密码错误', 'error');
        }
    } catch (error) {
        console.error('登录失败:', error);
        showMessage('登录失败，请重试', 'error');
    }
}

// 处理注册
function handleRegister() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const grade = parseInt(document.getElementById('register-grade').value);
    const classNum = document.getElementById('register-class').value ? parseInt(document.getElementById('register-class').value) : 0;
    const school = document.getElementById('register-school').value;
    
    try {
        // 检查用户名是否已存在
        const existingUser = window.storageManager.getUserByUsername(username);
        if (existingUser) {
            showMessage('用户名已存在', 'error');
            return;
        }
        
        // 创建新用户
        const newUser = {
            username: username,
            password: window.storageManager.encryptPassword(password),
            grade: grade,
            class: classNum,
            school: school,
            score: 0,
            completedQuestions: [],
            ownedItems: [],
            purchaseHistory: [],
            role: 'user'
        };
        
        // 保存用户
        window.storageManager.saveUser(newUser);
        
        // 显示成功消息并切换到登录表单
        showMessage('注册成功，请登录', 'success');
        setTimeout(() => {
            showLoginForm();
            // 清空表单
            document.getElementById('register-form').reset();
        }, 1500);
    } catch (error) {
        console.error('注册失败:', error);
        showMessage('注册失败，请重试', 'error');
    }
}