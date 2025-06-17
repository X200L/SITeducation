# Введение в Data Science

Этот документ представляет собой подробное руководство по анализу данных и машинному обучению, основанное на практических примерах и ключевых концепциях.

## 1. Введение в анализ данных

### 1.1. Основные библиотеки Python для анализа данных

```python
# Импорт основных библиотек
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Настройка отображения графиков
plt.style.use('seaborn')
sns.set_palette("husl")
```

### 1.2. Загрузка и первичный анализ данных

```python
# Загрузка данных
df = pd.read_csv('data.csv')

# Первичный анализ
print("Размер датасета:", df.shape)
print("\nПервые 5 строк:")
print(df.head())

# Базовая статистика
print("\nСтатистическое описание:")
print(df.describe())

# Проверка пропущенных значений
print("\nКоличество пропущенных значений:")
print(df.isnull().sum())
```

## 2. Предобработка данных

### 2.1. Обработка пропущенных значений

```python
# Заполнение пропущенных значений
def handle_missing_values(df):
    # Числовые колонки заполняем медианой
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    for col in numeric_columns:
        df[col].fillna(df[col].median(), inplace=True)
    
    # Категориальные колонки заполняем модой
    categorical_columns = df.select_dtypes(include=['object']).columns
    for col in categorical_columns:
        df[col].fillna(df[col].mode()[0], inplace=True)
    
    return df

# Обработка выбросов
def remove_outliers(df, columns, n_std):
    for col in columns:
        mean = df[col].mean()
        std = df[col].std()
        df = df[abs(df[col] - mean) <= (n_std * std)]
    return df
```

### 2.2. Кодирование категориальных переменных

```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Метод 1: Label Encoding
def label_encode(df, columns):
    le = LabelEncoder()
    for col in columns:
        df[col] = le.fit_transform(df[col])
    return df

# Метод 2: One-Hot Encoding
def one_hot_encode(df, columns):
    return pd.get_dummies(df, columns=columns)

# Метод 3: Target Encoding
def target_encode(df, columns, target):
    for col in columns:
        target_mean = df.groupby(col)[target].mean()
        df[f'{col}_encoded'] = df[col].map(target_mean)
    return df
```

## 3. Визуализация данных

### 3.1. Базовые графики

```python
def create_basic_plots(df):
    # Гистограмма
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df, x='column_name', bins=30)
    plt.title('Распределение значений')
    plt.show()
    
    # Box plot
    plt.figure(figsize=(10, 6))
    sns.boxplot(data=df, x='category_column', y='numeric_column')
    plt.title('Распределение по категориям')
    plt.show()
    
    # Scatter plot
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=df, x='column1', y='column2', hue='category')
    plt.title('Зависимость между переменными')
    plt.show()
```

### 3.2. Продвинутые визуализации

```python
def create_advanced_plots(df):
    # Heatmap корреляций
    plt.figure(figsize=(12, 8))
    sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
    plt.title('Корреляционная матрица')
    plt.show()
    
    # Pair plot
    sns.pairplot(df, hue='target_column')
    plt.show()
    
    # Violin plot
    plt.figure(figsize=(12, 6))
    sns.violinplot(data=df, x='category', y='value')
    plt.title('Распределение значений по категориям')
    plt.show()
```

## 4. Статистический анализ

### 4.1. Описательная статистика

```python
def descriptive_statistics(df):
    # Базовые статистики
    stats = df.describe()
    
    # Дополнительные метрики
    stats['skewness'] = df.skew()
    stats['kurtosis'] = df.kurtosis()
    
    # Квартили
    stats['q1'] = df.quantile(0.25)
    stats['q3'] = df.quantile(0.75)
    stats['iqr'] = stats['q3'] - stats['q1']
    
    return stats
```

### 4.2. Проверка гипотез

```python
def hypothesis_testing(data1, data2):
    # t-тест
    t_stat, p_value = stats.ttest_ind(data1, data2)
    print(f"t-статистика: {t_stat:.4f}")
    print(f"p-значение: {p_value:.4f}")
    
    # Тест на нормальность
    stat, p_value = stats.normaltest(data1)
    print(f"\nТест на нормальность:")
    print(f"Статистика: {stat:.4f}")
    print(f"p-значение: {p_value:.4f}")
```

## 5. Машинное обучение

### 5.1. Подготовка данных для ML

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def prepare_ml_data(df, target_column):
    # Разделение на признаки и целевую переменную
    X = df.drop(target_column, axis=1)
    y = df[target_column]
    
    # Разделение на обучающую и тестовую выборки
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Масштабирование признаков
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test
```

### 5.2. Классификация

```python
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

def classification_models(X_train, X_test, y_train, y_test):
    # Логистическая регрессия
    lr = LogisticRegression()
    lr.fit(X_train, y_train)
    lr_pred = lr.predict(X_test)
    
    # Случайный лес
    rf = RandomForestClassifier(n_estimators=100)
    rf.fit(X_train, y_train)
    rf_pred = rf.predict(X_test)
    
    # Оценка моделей
    print("Логистическая регрессия:")
    print(classification_report(y_test, lr_pred))
    print("\nСлучайный лес:")
    print(classification_report(y_test, rf_pred))
```

### 5.3. Регрессия

```python
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

def regression_models(X_train, X_test, y_train, y_test):
    # Линейная регрессия
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    lr_pred = lr.predict(X_test)
    
    # Случайный лес
    rf = RandomForestRegressor(n_estimators=100)
    rf.fit(X_train, y_train)
    rf_pred = rf.predict(X_test)
    
    # Оценка моделей
    print("Линейная регрессия:")
    print(f"MSE: {mean_squared_error(y_test, lr_pred):.4f}")
    print(f"R2: {r2_score(y_test, lr_pred):.4f}")
    
    print("\nСлучайный лес:")
    print(f"MSE: {mean_squared_error(y_test, rf_pred):.4f}")
    print(f"R2: {r2_score(y_test, rf_pred):.4f}")
```

## 6. Временные ряды

### 6.1. Анализ временных рядов

```python
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller

def time_series_analysis(series):
    # Декомпозиция временного ряда
    decomposition = seasonal_decompose(series, period=12)
    
    # Тест на стационарность
    result = adfuller(series)
    print('ADF Statistic:', result[0])
    print('p-value:', result[1])
    
    # Визуализация
    plt.figure(figsize=(12, 8))
    plt.subplot(411)
    plt.plot(series)
    plt.title('Исходный ряд')
    plt.subplot(412)
    plt.plot(decomposition.trend)
    plt.title('Тренд')
    plt.subplot(413)
    plt.plot(decomposition.seasonal)
    plt.title('Сезонность')
    plt.subplot(414)
    plt.plot(decomposition.resid)
    plt.title('Остатки')
    plt.tight_layout()
    plt.show()
```

### 6.2. Прогнозирование

```python
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet

def time_series_forecasting(series):
    # ARIMA модель
    model = ARIMA(series, order=(1,1,1))
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=12)
    
    # Prophet модель
    df_prophet = pd.DataFrame({
        'ds': series.index,
        'y': series.values
    })
    prophet = Prophet()
    prophet.fit(df_prophet)
    future = prophet.make_future_dataframe(periods=12)
    prophet_forecast = prophet.predict(future)
    
    return forecast, prophet_forecast
```

## 7. Работа с текстовыми данными

### 7.1. Предобработка текста

```python
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def preprocess_text(text):
    # Токенизация
    tokens = word_tokenize(text.lower())
    
    # Удаление стоп-слов
    stop_words = set(stopwords.words('russian'))
    tokens = [t for t in tokens if t not in stop_words]
    
    # Лемматизация
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    
    return tokens
```

### 7.2. Векторизация текста

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from gensim.models import Word2Vec

def text_vectorization(texts):
    # TF-IDF векторизация
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(texts)
    
    # Word2Vec векторизация
    tokenized_texts = [preprocess_text(text) for text in texts]
    w2v_model = Word2Vec(tokenized_texts, vector_size=100, window=5, min_count=1)
    
    return tfidf_matrix, w2v_model
```

## 8. Полезные ресурсы

1. [Pandas документация](https://pandas.pydata.org/docs/)
2. [Scikit-learn документация](https://scikit-learn.org/stable/)
3. [Matplotlib документация](https://matplotlib.org/)
4. [Seaborn документация](https://seaborn.pydata.org/)
5. [Kaggle](https://www.kaggle.com/)
6. [Towards Data Science](https://towardsdatascience.com/)

## Заключение

Этот справочник охватывает основные аспекты анализа данных и машинного обучения. Для успешной работы в области Data Science рекомендуется:

1. Регулярно практиковаться на реальных данных
2. Изучать новые методы и алгоритмы
3. Участвовать в соревнованиях по анализу данных
4. Следить за развитием области через научные статьи и блоги
5. Развивать навыки визуализации и презентации результатов

Помните, что успешный анализ данных требует не только технических навыков, но и понимания предметной области и умения правильно интерпретировать результаты. 