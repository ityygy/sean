// 初始数据文件

// 默认管理员账号（密码已加密：admin123 → YWRtaW4xMjM=）
export const adminUser = {
    username: 'admin',
    password: 'YWRtaW4xMjM=',
    grade: 0,
    class: 0,
    school: '管理员',
    score: 0,
    completedQuestions: [],
    role: 'admin'
};

// 初始题库数据
export const initialQuestions = [
    // 一年级单词
    {
        type: 'word',
        grade: 1,
        chinese: '苹果',
        english: 'apple',
        score: 5
    },
    {
        type: 'word',
        grade: 1,
        chinese: '香蕉',
        english: 'banana',
        score: 5
    },
    {
        type: 'word',
        grade: 1,
        chinese: '猫',
        english: 'cat',
        score: 5
    },
    {
        type: 'word',
        grade: 1,
        chinese: '狗',
        english: 'dog',
        score: 5
    },
    {
        type: 'word',
        grade: 1,
        chinese: '大象',
        english: 'elephant',
        score: 5
    },
    {
        type: 'word',
        grade: 1,
        chinese: '鱼',
        english: 'fish',
        score: 5
    },
    {
        type: 'word',
        grade: 1,
        chinese: '绿色',
        english: 'green',
        score: 5
    },
    {
        type: 'word',
        grade: 1,
        chinese: '红色',
        english: 'red',
        score: 5
    },
    {
        type: 'word',
        grade: 1,
        chinese: '蓝色',
        english: 'blue',
        score: 5
    },
    {
        type: 'word',
        grade: 1,
        chinese: '黄色',
        english: 'yellow',
        score: 5
    },
    
    // 二年级单词
    {
        type: 'word',
        grade: 2,
        chinese: '书包',
        english: 'bag',
        score: 6
    },
    {
        type: 'word',
        grade: 2,
        chinese: '书',
        english: 'book',
        score: 6
    },
    {
        type: 'word',
        grade: 2,
        chinese: '铅笔',
        english: 'pencil',
        score: 6
    },
    {
        type: 'word',
        grade: 2,
        chinese: '钢笔',
        english: 'pen',
        score: 6
    },
    {
        type: 'word',
        grade: 2,
        chinese: '尺子',
        english: 'ruler',
        score: 6
    },
    
    // 一年级句子
    {
        type: 'sentence',
        grade: 1,
        chinese: '这是一个苹果。',
        english: 'This is an apple.',
        score: 10
    },
    {
        type: 'sentence',
        grade: 1,
        chinese: '我有一只猫。',
        english: 'I have a cat.',
        score: 10
    },
    {
        type: 'sentence',
        grade: 1,
        chinese: '它是红色的。',
        english: 'It is red.',
        score: 10
    },
    
    // 二年级句子
    {
        type: 'sentence',
        grade: 2,
        chinese: '我喜欢香蕉。',
        english: 'I like bananas.',
        score: 12
    },
    {
        type: 'sentence',
        grade: 2,
        chinese: '这是我的书包。',
        english: 'This is my bag.',
        score: 12
    },
    {
        type: 'sentence',
        grade: 2,
        chinese: '我有一支铅笔。',
        english: 'I have a pencil.',
        score: 12
    }
];