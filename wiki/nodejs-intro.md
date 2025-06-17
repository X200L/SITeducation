# Node.js: Введение

Этот документ представляет собой краткое руководство по Node.js, основанное на ключевых концепциях и практических примерах.

## 1. Введение в Node.js

### 1.1. Первая программа: "Hello, World!"

```javascript
// Создаем простой HTTP-сервер
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, World!');
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
```

**Пояснение:**
* `require('http')`: Импорт встроенного модуля HTTP
* `createServer()`: Создание HTTP-сервера
* `listen()`: Запуск сервера на указанном порту

## 2. Основы Node.js

### 2.1. Модули и пакеты

#### Встроенные модули

```javascript
// Примеры использования встроенных модулей
const fs = require('fs');
const path = require('path');
const os = require('os');

// Работа с файловой системой
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Работа с путями
const filePath = path.join(__dirname, 'file.txt');

// Информация о системе
console.log(os.platform());
console.log(os.cpus());
```

#### NPM и package.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "Мой проект на Node.js",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^6.0.0"
  }
}
```

### 2.2. Асинхронное программирование

#### Callbacks

```javascript
const fs = require('fs');

// Чтение файла с использованием callback
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка чтения файла:', err);
        return;
    }
    console.log('Содержимое файла:', data);
});
```

#### Promises

```javascript
const fs = require('fs').promises;

// Чтение файла с использованием Promise
fs.readFile('file.txt', 'utf8')
    .then(data => console.log('Содержимое файла:', data))
    .catch(err => console.error('Ошибка чтения файла:', err));
```

#### Async/Await

```javascript
const fs = require('fs').promises;

async function readFile() {
    try {
        const data = await fs.readFile('file.txt', 'utf8');
        console.log('Содержимое файла:', data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
    }
}
```

## 3. Создание веб-приложений

### 3.1. Express.js

```javascript
const express = require('express');
const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Маршруты
app.get('/', (req, res) => {
    res.send('Главная страница');
});

app.post('/api/users', (req, res) => {
    const user = req.body;
    // Обработка данных пользователя
    res.json({ message: 'Пользователь создан', user });
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
```

### 3.2. Middleware

```javascript
// Пример middleware для логирования
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Что-то пошло не так!');
});
```

## 4. Работа с базами данных

### 4.1. MongoDB с Mongoose

```javascript
const mongoose = require('mongoose');

// Подключение к базе данных
mongoose.connect('mongodb://localhost/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Определение схемы
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

// Создание модели
const User = mongoose.model('User', userSchema);

// Примеры операций
async function createUser() {
    const user = new User({
        name: 'Иван',
        email: 'ivan@example.com',
        age: 25
    });
    await user.save();
}

async function findUsers() {
    const users = await User.find({ age: { $gt: 20 } });
    console.log(users);
}
```

### 4.2. SQL с Sequelize

```javascript
const { Sequelize, DataTypes } = require('sequelize');

// Подключение к базе данных
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

// Определение модели
const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER
});

// Примеры операций
async function createUser() {
    const user = await User.create({
        name: 'Иван',
        email: 'ivan@example.com',
        age: 25
    });
}

async function findUsers() {
    const users = await User.findAll({
        where: {
            age: {
                [Op.gt]: 20
            }
        }
    });
}
```

## 5. Аутентификация и безопасность

### 5.1. JWT аутентификация

```javascript
const jwt = require('jsonwebtoken');

// Создание токена
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        'your-secret-key',
        { expiresIn: '1h' }
    );
}

// Middleware для проверки токена
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Недействительный токен' });
        }
        req.user = user;
        next();
    });
}
```

### 5.2. Хеширование паролей

```javascript
const bcrypt = require('bcrypt');

// Хеширование пароля
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// Проверка пароля
async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
```

## 6. Тестирование

### 6.1. Unit тесты с Jest

```javascript
// user.test.js
const { createUser, findUser } = require('./user');

describe('User Module', () => {
    test('should create a new user', async () => {
        const user = await createUser({
            name: 'Test User',
            email: 'test@example.com'
        });
        expect(user.name).toBe('Test User');
    });

    test('should find user by email', async () => {
        const user = await findUser('test@example.com');
        expect(user).toBeDefined();
    });
});
```

### 6.2. API тесты с Supertest

```javascript
const request = require('supertest');
const app = require('./app');

describe('API Endpoints', () => {
    test('GET /api/users', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body).toBeInstanceOf(Array);
    });
});
```

## 7. Развертывание

### 7.1. PM2 для управления процессами

```bash
# Установка PM2
npm install -g pm2

# Запуск приложения
pm2 start app.js

# Мониторинг
pm2 monit

# Логи
pm2 logs
```

### 7.2. Docker

```dockerfile
# Dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## 8. Полезные ресурсы

1. [Официальная документация Node.js](https://nodejs.org/ru/docs/)
2. [Express.js документация](https://expressjs.com/ru/)
3. [MongoDB документация](https://docs.mongodb.com/)
4. [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## Заключение

Этот краткий справочник охватывает основные аспекты разработки на Node.js. Для более глубокого изучения рекомендуется обратиться к специализированной литературе и практике. Важно помнить о безопасности, производительности и лучших практиках при разработке приложений. 