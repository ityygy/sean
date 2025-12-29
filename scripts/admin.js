// 管理员后台逻辑
// 直接使用全局的storageManager对象

// 管理员后台管理器
class AdminManager {
    constructor() {
        this.currentSection = 'user-management';
        this.currentQuestionType = 'word';
        this.init();
    }

    // 初始化管理员后台
    init() {
        // 检查管理员登录
        this.checkAdminLogin();
        
        // 绑定事件
        this.bindEvents();
        
        // 加载初始数据
        this.loadUserData();
        this.loadQuestionData();
        this.loadStoreItemData();
        this.loadLeaderboardData();
        this.loadRedemptionRecordsData();
    }

    // 检查管理员登录
    checkAdminLogin() {
        const userStr = sessionStorage.getItem('currentUser');
        if (!userStr) {
            // 未登录，跳转到登录页面
            window.location.replace('index.html');
            return;
        }
        
        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
            // 不是管理员，跳转到游戏页面
            window.location.replace('game.html');
            return;
        }
    }

    // 绑定事件
    bindEvents() {
        // 导航菜单事件
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // 退出登录
        document.getElementById('admin-logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // 返回首页
        document.getElementById('admin-back-btn').addEventListener('click', () => {
            window.location.replace('index.html');
        });

        // 用户管理事件
        document.getElementById('search-user-btn').addEventListener('click', () => {
            this.searchUsers();
        });

        // 题目类型切换
        document.getElementById('word-questions-tab').addEventListener('click', () => {
            this.switchQuestionType('word');
        });

        document.getElementById('sentence-questions-tab').addEventListener('click', () => {
            this.switchQuestionType('sentence');
        });

        // 添加题目表单提交
        document.getElementById('add-question-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addQuestion();
        });

        // 批量导入题目
        document.getElementById('batch-import-btn').addEventListener('click', () => {
            this.batchImportQuestions();
        });

        // 修改用户表单提交
        document.getElementById('edit-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUserChanges();
        });

        // 修改题目表单提交
        document.getElementById('edit-question-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveQuestionChanges();
        });

        // 关闭弹窗事件
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // 点击弹窗外部关闭弹窗
        window.addEventListener('click', (e) => {
            const modal = document.querySelector('.modal.show');
            if (modal && e.target === modal) {
                this.closeModal();
            }
        });

        // 批量操作事件
        // 全选/取消全选
        const selectAllCheckbox = document.getElementById('select-all-questions');
        selectAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            document.querySelectorAll('.question-checkbox').forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            this.updateSelectedCount();
        });

        // 单个复选框变化事件
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('question-checkbox')) {
                this.updateSelectedCount();
                // 检查是否所有复选框都被选中
                const allCheckboxes = document.querySelectorAll('.question-checkbox');
                const allChecked = Array.from(allCheckboxes).every(checkbox => checkbox.checked);
                selectAllCheckbox.checked = allChecked;
            }
        });

        // 批量删除按钮
        document.getElementById('batch-delete-btn').addEventListener('click', () => {
            this.batchDeleteQuestions();
        });

        // 批量修改按钮
        document.getElementById('batch-edit-btn').addEventListener('click', () => {
            this.batchEditQuestions();
        });

        // 商城管理事件
        // 添加商城物品表单提交
        document.getElementById('add-store-item-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStoreItem();
        });

        // 修改商城物品表单提交
        document.getElementById('edit-store-item-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveStoreItemChanges();
        });
    }

    // 显示指定区域
    showSection(sectionId) {
        // 更新导航菜单状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // 更新内容区域
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;

        // 根据区域加载对应数据
        if (sectionId === 'store-management') {
            this.loadStoreItemData();
        } else if (sectionId === 'leaderboard') {
            this.loadLeaderboardData();
        } else if (sectionId === 'redemption-records') {
            this.loadRedemptionRecordsData();
        }
    }

    // 退出登录
    logout() {
        sessionStorage.removeItem('currentUser');
        window.location.replace('index.html');
    }

    // 加载用户数据
    loadUserData() {
        const users = window.storageManager.getUsers();
        console.log('加载的用户数据:', users);
        
        // 如果没有用户数据，添加一条提示信息
        if (users.length === 0 || (users.length === 1 && users[0].role === 'admin')) {
            const tbody = document.getElementById('user-table').querySelector('tbody');
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">暂无用户数据</td></tr>';
            console.log('没有用户数据');
        } else {
            this.renderUserTable(users);
        }
    }

    // 渲染用户表格
    renderUserTable(users) {
        const tbody = document.getElementById('user-table').querySelector('tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            if (user.role === 'admin') return; // 跳过管理员

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.grade}</td>
                <td>${user.class}</td>
                <td>${user.school}</td>
                <td>${user.score}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-small" onclick="adminManager.editUser('${user.username}')">修改</button>
                        <button class="btn btn-danger btn-small" onclick="adminManager.deleteUser('${user.username}')">删除</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // 搜索用户
    searchUsers() {
        const searchTerm = document.getElementById('user-search').value.toLowerCase();
        const users = window.storageManager.getUsers();
        const filteredUsers = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm)
        );
        this.renderUserTable(filteredUsers);
    }

    // 修改用户
    editUser(username) {
        const user = window.storageManager.getUserByUsername(username);
        if (!user) return;

        // 填充表单数据
        document.getElementById('edit-username').value = user.username;
        document.getElementById('edit-grade').value = user.grade;
        document.getElementById('edit-class').value = user.class;
        document.getElementById('edit-school').value = user.school;
        document.getElementById('edit-score').value = user.score;
        // 密码字段留空，让管理员输入新密码
        document.getElementById('edit-password').value = '';

        // 显示弹窗
        this.showModal('edit-user-modal');
    }

    // 保存用户修改
    saveUserChanges() {
        const username = document.getElementById('edit-username').value;
        const grade = parseInt(document.getElementById('edit-grade').value);
        const classNum = parseInt(document.getElementById('edit-class').value);
        const school = document.getElementById('edit-school').value;
        const score = parseInt(document.getElementById('edit-score').value);
        const password = document.getElementById('edit-password').value;

        const user = window.storageManager.getUserByUsername(username);
        if (!user) return;

        // 更新用户信息
        user.grade = grade;
        user.class = classNum;
        user.school = school;
        user.score = score;
        
        // 如果输入了新密码，则更新密码
        if (password.trim()) {
            user.password = window.storageManager.encryptPassword(password);
        }

        window.storageManager.saveUser(user);

        // 刷新用户列表
        this.loadUserData();

        // 关闭弹窗
        this.closeModal();
    }

    // 删除用户
    deleteUser(username) {
        if (confirm(`确定要删除用户 ${username} 吗？`)) {
            window.storageManager.deleteUser(username);
            this.loadUserData();
        }
    }

    // 切换题目类型
    switchQuestionType(type) {
        this.currentQuestionType = type;

        // 更新标签页状态
        document.querySelectorAll('.question-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${type}-questions-tab`).classList.add('active');

        // 重新加载题目数据
        this.loadQuestionData();
    }

    // 加载题目数据
    loadQuestionData() {
        const allQuestions = window.storageManager.getQuestions();
        const filteredQuestions = allQuestions.filter(q => q.type === this.currentQuestionType);
        this.renderQuestionTable(filteredQuestions);
    }

    // 渲染题目表格
    renderQuestionTable(questions) {
        const tbody = document.getElementById('question-table').querySelector('tbody');
        tbody.innerHTML = '';

        questions.forEach(question => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="question-checkbox" data-id="${question.id}"></td>
                <td>${question.id.substring(0, 8)}...</td>
                <td>${question.type === 'word' ? '单词' : '句子'}</td>
                <td>${question.grade}</td>
                <td>${question.chinese}</td>
                <td>${question.english}</td>
                <td>${question.score}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-small" onclick="adminManager.editQuestion('${question.id}')">修改</button>
                        <button class="btn btn-danger btn-small" onclick="adminManager.deleteQuestion('${question.id}')">删除</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // 添加题目
    addQuestion() {
        const type = document.getElementById('question-type').value;
        const grade = parseInt(document.getElementById('question-grade').value);
        const chinese = document.getElementById('question-chinese').value;
        const english = document.getElementById('question-english').value;
        const score = parseInt(document.getElementById('question-score').value);

        // 创建新题目
        const newQuestion = {
            type: type,
            grade: grade,
            chinese: chinese,
            english: english,
            score: score
        };

        // 保存题目
        window.storageManager.saveQuestion(newQuestion);

        // 重置表单
        document.getElementById('add-question-form').reset();

        // 刷新题目列表
        this.loadQuestionData();
    }

    // 批量导入题目
    batchImportQuestions() {
        const text = document.getElementById('batch-import-text').value;
        if (!text.trim()) {
            alert('请输入要导入的题目内容');
            return;
        }

        const lines = text.trim().split('\n');
        const questions = [];
        
        lines.forEach((line, index) => {
            const parts = line.split('|').map(p => p.trim());
            if (parts.length !== 3) {
                alert(`第 ${index + 1} 行格式错误，请检查：${line}`);
                return;
            }

            const [chinese, english, scoreStr] = parts;
            const score = parseInt(scoreStr);
            
            if (isNaN(score)) {
                alert(`第 ${index + 1} 行积分格式错误：${scoreStr}`);
                return;
            }

            questions.push({
                type: this.currentQuestionType,
                grade: 1, // 默认一年级，后续可以手动修改
                chinese: chinese,
                english: english,
                score: score
            });
        });

        // 批量保存题目
        if (questions.length > 0) {
            window.storageManager.batchImportQuestions(questions);
            document.getElementById('batch-import-text').value = '';
            this.loadQuestionData();
            alert(`成功导入 ${questions.length} 道题目`);
        }
    }

    // 修改题目
    editQuestion(questionId) {
        const question = window.storageManager.getQuestionById(questionId);
        if (!question) return;

        // 填充表单数据
        document.getElementById('edit-question-id').value = question.id;
        document.getElementById('edit-question-type').value = question.type;
        document.getElementById('edit-question-grade').value = question.grade;
        document.getElementById('edit-question-chinese').value = question.chinese;
        document.getElementById('edit-question-english').value = question.english;
        document.getElementById('edit-question-score').value = question.score;

        // 显示弹窗
        this.showModal('edit-question-modal');
    }

    // 保存题目修改
    saveQuestionChanges() {
        const id = document.getElementById('edit-question-id').value;
        const type = document.getElementById('edit-question-type').value;
        const grade = parseInt(document.getElementById('edit-question-grade').value);
        const chinese = document.getElementById('edit-question-chinese').value;
        const english = document.getElementById('edit-question-english').value;
        const score = parseInt(document.getElementById('edit-question-score').value);

        const question = window.storageManager.getQuestionById(id);
        if (!question) return;

        // 更新题目信息
        question.type = type;
        question.grade = grade;
        question.chinese = chinese;
        question.english = english;
        question.score = score;

        window.storageManager.saveQuestion(question);

        // 刷新题目列表
        this.loadQuestionData();

        // 关闭弹窗
        this.closeModal();
    }

    // 删除题目
    deleteQuestion(questionId) {
        if (confirm('确定要删除这道题目吗？')) {
            window.storageManager.deleteQuestion(questionId);
            this.loadQuestionData();
        }
    }

    // 更新已选择题目数量
    updateSelectedCount() {
        const checkedCount = document.querySelectorAll('.question-checkbox:checked').length;
        document.getElementById('selected-count').textContent = `${checkedCount} 道题目已选择`;
    }

    // 获取已选择的题目ID
    getSelectedQuestionIds() {
        const checkedCheckboxes = document.querySelectorAll('.question-checkbox:checked');
        return Array.from(checkedCheckboxes).map(checkbox => checkbox.dataset.id);
    }

    // 批量删除题目
    batchDeleteQuestions() {
        const selectedIds = this.getSelectedQuestionIds();
        if (selectedIds.length === 0) {
            alert('请先选择要删除的题目');
            return;
        }

        if (confirm(`确定要删除选中的 ${selectedIds.length} 道题目吗？`)) {
            selectedIds.forEach(id => {
                window.storageManager.deleteQuestion(id);
            });
            this.loadQuestionData();
            // 重置全选复选框
            document.getElementById('select-all-questions').checked = false;
        }
    }

    // 批量修改题目
    batchEditQuestions() {
        const selectedIds = this.getSelectedQuestionIds();
        if (selectedIds.length === 0) {
            alert('请先选择要修改的题目');
            return;
        }

        // 创建批量修改弹窗
        const modal = this.createBatchEditModal(selectedIds);
        document.body.appendChild(modal);
        modal.classList.add('show');
    }

    // 创建批量修改弹窗
    createBatchEditModal(selectedIds) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>批量修改题目</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <form id="batch-edit-form">
                    <div class="batch-edit-info">
                        <p>已选择 ${selectedIds.length} 道题目进行批量修改</p>
                        <p>注意：留空的字段将保持原有值不变</p>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="batch-edit-grade">年级</label>
                            <select id="batch-edit-grade">
                                <option value="">保持不变</option>
                                <option value="1">一年级</option>
                                <option value="2">二年级</option>
                                <option value="3">三年级</option>
                                <option value="4">四年级</option>
                                <option value="5">五年级</option>
                                <option value="6">六年级</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="batch-edit-score">积分</label>
                            <input type="number" id="batch-edit-score" min="1" placeholder="保持不变">
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">保存修改</button>
                        <button type="button" class="btn btn-secondary close-modal">取消</button>
                    </div>
                </form>
            </div>
        `;

        // 绑定表单提交事件
        modal.querySelector('#batch-edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBatchQuestionChanges(selectedIds, modal);
        });

        // 绑定关闭事件
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.remove();
            });
        });

        // 点击弹窗外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        return modal;
    }

    // 保存批量修改
    saveBatchQuestionChanges(selectedIds, modal) {
        const grade = document.getElementById('batch-edit-grade').value;
        const scoreStr = document.getElementById('batch-edit-score').value;
        const score = scoreStr ? parseInt(scoreStr) : null;

        // 更新选中的题目
        selectedIds.forEach(id => {
            const question = window.storageManager.getQuestionById(id);
            if (question) {
                if (grade) {
                    question.grade = parseInt(grade);
                }
                if (score !== null) {
                    question.score = score;
                }
                window.storageManager.saveQuestion(question);
            }
        });

        // 刷新题目列表
        this.loadQuestionData();

        // 关闭弹窗
        modal.remove();

        // 重置全选复选框
        document.getElementById('select-all-questions').checked = false;
    }

    // 显示弹窗
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
    }

    // 关闭弹窗
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    // 商城物品管理方法
    
    // 加载商城物品数据
    loadStoreItemData() {
        const items = window.storageManager.getStoreItems();
        this.renderStoreItemTable(items);
    }

    // 渲染商城物品表格
    renderStoreItemTable(items) {
        const tbody = document.getElementById('store-item-table').querySelector('tbody');
        tbody.innerHTML = '';

        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id.substring(0, 8)}...</td>
                <td style="font-size: 24px;">${item.image}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.price}</td>
                <td>${item.description}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-small" onclick="adminManager.editStoreItem('${item.id}')">修改</button>
                        <button class="btn btn-danger btn-small" onclick="adminManager.deleteStoreItem('${item.id}')">删除</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // 添加商城物品
    addStoreItem() {
        const name = document.getElementById('item-name').value;
        const category = document.getElementById('item-category').value;
        const price = parseInt(document.getElementById('item-price').value);
        const image = document.getElementById('item-image').value;
        const description = document.getElementById('item-description').value;

        // 创建新物品
        const newItem = {
            name: name,
            category: category,
            price: price,
            image: image,
            description: description
        };

        // 保存物品
        window.storageManager.saveStoreItem(newItem);

        // 重置表单
        document.getElementById('add-store-item-form').reset();

        // 刷新物品列表
        this.loadStoreItemData();
    }

    // 编辑商城物品
    editStoreItem(itemId) {
        const item = window.storageManager.getStoreItemById(itemId);
        if (!item) return;

        // 填充表单数据
        document.getElementById('edit-store-item-id').value = item.id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-category').value = item.category;
        document.getElementById('edit-item-price').value = item.price;
        document.getElementById('edit-item-image').value = item.image;
        document.getElementById('edit-item-description').value = item.description;

        // 显示弹窗
        this.showModal('edit-store-item-modal');
    }

    // 保存商城物品修改
    saveStoreItemChanges() {
        const id = document.getElementById('edit-store-item-id').value;
        const name = document.getElementById('edit-item-name').value;
        const category = document.getElementById('edit-item-category').value;
        const price = parseInt(document.getElementById('edit-item-price').value);
        const image = document.getElementById('edit-item-image').value;
        const description = document.getElementById('edit-item-description').value;

        const item = window.storageManager.getStoreItemById(id);
        if (!item) return;

        // 更新物品信息
        item.name = name;
        item.category = category;
        item.price = price;
        item.image = image;
        item.description = description;

        window.storageManager.saveStoreItem(item);

        // 刷新物品列表
        this.loadStoreItemData();

        // 关闭弹窗
        this.closeModal();
    }

    // 删除商城物品
    deleteStoreItem(itemId) {
        if (confirm('确定要删除这个物品吗？')) {
            window.storageManager.deleteStoreItem(itemId);
            this.loadStoreItemData();
        }
    }
    
    // 加载排行榜数据
    loadLeaderboardData() {
        const users = window.storageManager.getUsers();
        // 过滤掉管理员用户，并按积分降序排序
        const sortedUsers = users.filter(user => user.role !== 'admin')
                               .sort((a, b) => b.score - a.score);
        
        this.renderTopThree(sortedUsers);
        this.renderLeaderboardTable(sortedUsers);
    }
    
    // 渲染前三名
    renderTopThree(users) {
        // 清空前三名数据
        this.clearTopThree();
        
        // 渲染第一名
        if (users.length >= 1) {
            const first = users[0];
            document.getElementById('first-username').textContent = first.username;
            document.getElementById('first-score').textContent = first.score;
            document.getElementById('first-grade-class').textContent = `${first.grade}年级${first.class}班`;
        }
        
        // 渲染第二名
        if (users.length >= 2) {
            const second = users[1];
            document.getElementById('second-username').textContent = second.username;
            document.getElementById('second-score').textContent = second.score;
            document.getElementById('second-grade-class').textContent = `${second.grade}年级${second.class}班`;
        }
        
        // 渲染第三名
        if (users.length >= 3) {
            const third = users[2];
            document.getElementById('third-username').textContent = third.username;
            document.getElementById('third-score').textContent = third.score;
            document.getElementById('third-grade-class').textContent = `${third.grade}年级${third.class}班`;
        }
    }
    
    // 清空前三名数据
    clearTopThree() {
        // 清空第一名
        document.getElementById('first-username').textContent = '暂无用户';
        document.getElementById('first-score').textContent = '0';
        document.getElementById('first-grade-class').textContent = '--年级--班';
        
        // 清空第二名
        document.getElementById('second-username').textContent = '暂无用户';
        document.getElementById('second-score').textContent = '0';
        document.getElementById('second-grade-class').textContent = '--年级--班';
        
        // 清空第三名
        document.getElementById('third-username').textContent = '暂无用户';
        document.getElementById('third-score').textContent = '0';
        document.getElementById('third-grade-class').textContent = '--年级--班';
    }
    
    // 渲染排行榜表格
    renderLeaderboardTable(users) {
        const tbody = document.getElementById('leaderboard-table').querySelector('tbody');
        tbody.innerHTML = '';
        
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            // 根据排名添加特殊样式
            let rankClass = '';
            if (index === 0) rankClass = 'first-rank';
            if (index === 1) rankClass = 'second-rank';
            if (index === 2) rankClass = 'third-rank';
            
            row.className = rankClass;
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.grade}</td>
                <td>${user.class}</td>
                <td>${user.school}</td>
                <td>${user.score}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // 加载积分兑换记录数据
    loadRedemptionRecordsData() {
        const records = window.storageManager.getAllPurchaseHistory();
        this.renderRedemptionRecordsTable(records);
    }
    
    // 渲染积分兑换记录表格
    renderRedemptionRecordsTable(records) {
        const tbody = document.getElementById('redemption-records-table').querySelector('tbody');
        tbody.innerHTML = '';
        
        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">暂无兑换记录</td></tr>';
            return;
        }
        
        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.purchaseId}</td>
                <td>${record.username}</td>
                <td>${record.itemName}</td>
                <td>${record.price}</td>
                <td>${new Date(record.purchaseTime).toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// 初始化管理员后台
const adminManager = new AdminManager();
window.adminManager = adminManager;