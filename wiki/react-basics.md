# React: Краткий справочник

Этот документ представляет собой краткий справочник по библиотеке React, основанный на ключевых концепциях и примерах.

## 1. Введение в React

### 1.1. Первое приложение

```jsx
// App.jsx
import React from 'react';

function App() {
  return (
    <div>
      <h1>Привет, React!</h1>
    </div>
  );
}

export default App;
```

**Пояснение:**
* React использует JSX - синтаксис, похожий на HTML, но с возможностью встраивания JavaScript
* Компоненты - это функции, возвращающие JSX
* Каждый компонент должен начинаться с заглавной буквы

## 2. Основы компонентов

### 2.1. Функциональные компоненты

```jsx
// Button.jsx
function Button({ text, onClick }) {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  );
}

// Использование
<Button text="Нажми меня" onClick={() => alert('Клик!')} />
```

### 2.2. Компоненты с состоянием

```jsx
// Counter.jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Увеличить
      </button>
    </div>
  );
}
```

## 3. Хуки

### 3.1. useState

```jsx
// Пример с несколькими состояниями
function UserProfile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Деактивировать' : 'Активировать'}
      </button>
    </div>
  );
}
```

### 3.2. useEffect

```jsx
// Базовое использование
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://api.example.com/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); // Пустой массив зависимостей = выполнить только при монтировании

  if (loading) return <div>Загрузка...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### 3.3. useContext

```jsx
// Создание контекста
const ThemeContext = React.createContext('light');

// Провайдер
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// Использование
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Тема: {theme}</button>;
}
```

## 4. Обработка событий

### 4.1. Базовые события

```jsx
function EventHandler() {
  const handleClick = (event) => {
    console.log('Клик!', event);
  };

  const handleChange = (event) => {
    console.log('Новое значение:', event.target.value);
  };

  return (
    <div>
      <button onClick={handleClick}>Клик</button>
      <input onChange={handleChange} />
    </div>
  );
}
```

### 4.2. Формы

```jsx
function Form() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Отправка формы:', formData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Отправить</button>
    </form>
  );
}
```

## 5. Списки и ключи

### 5.1. Рендеринг списков

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Изучить React' },
    { id: 2, text: 'Создать приложение' }
  ]);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

### 5.2. Фильтрация и сортировка

```jsx
function FilteredList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Яблоко', category: 'фрукты' },
    { id: 2, name: 'Морковь', category: 'овощи' }
  ]);
  const [filter, setFilter] = useState('все');

  const filteredItems = items.filter(item => 
    filter === 'все' || item.category === filter
  );

  return (
    <div>
      <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="все">Все</option>
        <option value="фрукты">Фрукты</option>
        <option value="овощи">Овощи</option>
      </select>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 6. Маршрутизация

### 6.1. Базовая маршрутизация

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/about">О нас</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 6.2. Параметры маршрута

```jsx
function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Загрузка данных пользователя
    fetchUser(id).then(setUser);
  }, [id]);

  if (!user) return <div>Загрузка...</div>;
  return <div>Профиль пользователя: {user.name}</div>;
}

// В маршрутах
<Route path="/user/:id" element={<UserProfile />} />
```

## 7. Управление состоянием

### 7.1. Redux

```jsx
// store.js
import { createStore } from 'redux';

const initialState = { count: 0 };

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(reducer);

// Counter.jsx
function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        Увеличить
      </button>
    </div>
  );
}
```

### 7.2. Context API

```jsx
// ThemeContext.js
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Использование
function App() {
  return (
    <ThemeProvider>
      <ThemedComponent />
    </ThemeProvider>
  );
}
```

## 8. Оптимизация производительности

### 8.1. useMemo и useCallback

```jsx
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => item * 2);
  }, [data]);

  const handleClick = useCallback(() => {
    console.log('Обработка клика');
  }, []);

  return (
    <div>
      {processedData.map(item => (
        <div key={item}>{item}</div>
      ))}
      <button onClick={handleClick}>Клик</button>
    </div>
  );
}
```

### 8.2. React.memo

```jsx
const MemoizedComponent = React.memo(function MyComponent({ value }) {
  console.log('Рендер компонента');
  return <div>{value}</div>;
});

// Использование
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <MemoizedComponent value="Статическое значение" />
      <button onClick={() => setCount(count + 1)}>
        Счетчик: {count}
      </button>
    </div>
  );
}
```

## 9. Тестирование

### 9.1. Jest и React Testing Library

```jsx
// Button.test.jsx
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

test('кнопка вызывает onClick при клике', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <Button text="Тест" onClick={handleClick} />
  );

  fireEvent.click(getByText('Тест'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 9.2. Тестирование хуков

```jsx
// useCounter.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from './useCounter';

test('useCounter увеличивает значение', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## 10. Полезные ресурсы

1. [Официальная документация React](https://reactjs.org/docs/getting-started.html)
2. [React Router](https://reactrouter.com/)
3. [Redux Toolkit](https://redux-toolkit.js.org/)
4. [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Заключение

Этот краткий справочник охватывает основные аспекты разработки на React. Для более глубокого изучения рекомендуется обратиться к официальной документации и практике. 