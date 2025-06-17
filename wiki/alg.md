## **1. Бинарный поиск (Binary Search)**

**Суть**: Поиск элемента в **отсортированном массиве** за логарифмическое время.  
**Сложность**: O(log n)  
**Где используется**: Поиск в базах данных, оптимизация задач.

**Как работает**:

1. Сравниваем искомый элемент с серединой массива.
    
2. Если элемент меньше — ищем в левой половине, если больше — в правой.
    
3. Повторяем, пока не найдём элемент или не убедимся в его отсутствии.

**Код**:
```python

def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1  # Элемент не найден
```
# Пример:
```
arr = [1, 3, 5, 7, 9]
print(binary_search(arr, 3))  # Output: 1
```

---

## **2. Сортировка выбором (Selection Sort)**

**Суть**: На каждом шаге находим **минимальный элемент** и ставим его в начало.  
**Сложность**: O(n²)  
**Где используется**: Обучение алгоритмам (на практике не используется из-за неэффективности).

**Как работает**:

1. Проходим по массиву, ищем минимальный элемент.
    
2. Меняем его местами с первым неотсортированным элементом.
    
3. Повторяем для оставшейся части массива.

**Код**:
```python

def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
```

# Пример:
```
print(selection_sort([64, 25, 12, 22, 11]))  # Output: [11, 12, 22, 25, 64]
```

---

## **3. Быстрая сортировка (Quick Sort)**

**Суть**: Рекурсивный алгоритм **«разделяй и властвуй»** с опорным элементом.  
**Сложность**:

- Средний случай: O(n log n)
    
- Худший случай (если массив уже отсортирован): O(n²)

**Где используется**: Стандартная сортировка в Python (`sorted()` использует TimSort).

**Как работает**:

1. Выбираем **опорный элемент** (pivot).
    
2. Делим массив на два подмассива: элементы **меньше pivot** и **больше pivot**.
    
3. Рекурсивно сортируем подмассивы.

**Код**:
```python

def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```

# Пример:
```
print(quicksort([3, 6, 8, 10, 1, 2, 1]))  # Output: [1, 1, 2, 3, 6, 8, 10]
```

---

## **4. Поиск в ширину (BFS, Breadth-First Search)**

**Суть**: Обход графа **по уровням**, начиная с ближайших соседей.  
**Сложность**: O(V + E), где V — вершины, E — рёбра.  
**Где используется**:

- Поиск кратчайшего пути в невзвешенном графе.
    
- Проверка связности графа.

**Как работает**:

1. Используем **очередь** (FIFO).
    
2. Начинаем с начальной вершины, добавляем её в очередь.
    
3. Пока очередь не пуста:
    
    - Извлекаем вершину, проверяем её соседей.
        
    - Если сосед — цель, завершаем поиск.
        
    - Иначе добавляем соседей в очередь.

**Код**:
```python

from collections import deque

def bfs(graph, start, target):
    queue = deque([start])
    visited = {start: None}  # Для хранения пути
    
    while queue:
        current = queue.popleft()
        if current == target:
            break
        for neighbor in graph[current]:
            if neighbor not in visited:
                queue.append(neighbor)
                visited[neighbor] = current
    
    # Восстановление пути (опционально)
    path = []
    while target is not None:
        path.append(target)
        target = visited[target]
    return path[::-1]

```
# Пример:
```
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
print(bfs(graph, 'A', 'F'))  # Output: ['A', 'C', 'F']
```

---

## **5. Алгоритм Дейкстры (Dijkstra’s Algorithm)**

**Суть**: Поиск **кратчайшего пути** во взвешенном графе **без отрицательных весов**.  
**Сложность**: O((V + E) log V) с приоритетной очередью.  
**Где используется**: GPS-навигация, маршрутизация в сетях.

**Как работает**:

1. Присваиваем начальной вершине стоимость 0, остальным — ∞.
    
2. Используем **приоритетную очередь** для выбора вершины с минимальной стоимостью.
    
3. Обновляем стоимости соседей, если найден более короткий путь.

**Код**:
```python

import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    queue = [(0, start)]
    
    while queue:
        current_dist, current_node = heapq.heappop(queue)
        if current_dist > distances[current_node]:
            continue
        
        for neighbor, weight in graph[current_node].items():
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(queue, (distance, neighbor))
    
    return distances
```

# Пример:
```
graph = {
    'A': {'B': 1, 'C': 4},
    'B': {'A': 1, 'C': 2, 'D': 5},
    'C': {'A': 4, 'B': 2, 'D': 1},
    'D': {'B': 5, 'C': 1}
}
print(dijkstra(graph, 'A'))  # Output: {'A': 0, 'B': 1, 'C': 3, 'D': 4}
```

---

## **6. Динамическое программирование (Fibonacci)**

**Суть**: Решение задачи **разбиением на подзадачи** с запоминанием результатов.  
**Сложность**: O(n) с мемоизацией (без неё — O(2ⁿ)).  
**Где используется**: Оптимизация рекурсивных задач (числа Фибоначчи, рюкзак).

**Как работает**:

1. **Мемоизация**: Кешируем результаты вычислений.
    
2. **Табличный метод**: Строим решение снизу вверх.

**Код (с мемоизацией)**:
```python

def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 2:
        return 1
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]
```

# Пример:
```
print(fib(10))  # Output: 55
```

---

## **7. Жадный алгоритм (Задача о рюкзаке)**

**Суть**: На каждом шаге выбираем **локально оптимальное решение**.  
**Сложность**: O(n log n) (сортировка + один проход).  
**Где используется**: Задачи, где жадный выбор даёт глобальный оптимум (например, покрытие множества).

**Как работает**:

1. Сортируем предметы по удельной стоимости (ценность / вес).
    
2. Берём предметы с максимальной удельной стоимостью, пока рюкзак не заполнится.

**Код**:
```python

def fractional_knapsack(items, capacity):
    items.sort(key=lambda x: x[1] / x[0], reverse=True)
    total_value = 0.0
    
    for weight, value in items:
        if capacity >= weight:
            total_value += value
            capacity -= weight
        else:
            total_value += value * (capacity / weight)
            break
    return total_value
```

# Пример:
```
items = [(10, 60), (20, 100), (30, 120)]  # (вес, ценность)
print(fractional_knapsack(items, 50))  # Output: 240.0
```
