# Raspberry Pi: Практическое руководство

Этот документ представляет собой практическое руководство по работе с Raspberry Pi, включающее основные концепции, примеры кода и полезные советы.

## 1. Введение в Raspberry Pi

### 1.1. Что такое Raspberry Pi?

Raspberry Pi - это одноплатный компьютер размером с кредитную карту, разработанный для обучения программированию и создания различных проектов. Он может работать как полноценный компьютер, сервер или контроллер для различных устройств.

### 1.2. Первая программа: Мигающий светодиод

```python
import RPi.GPIO as GPIO
import time

# Настройка нумерации пинов
GPIO.setmode(GPIO.BCM)

# Определяем пин для светодиода
LED_PIN = 18
GPIO.setup(LED_PIN, GPIO.OUT)

try:
    while True:
        GPIO.output(LED_PIN, GPIO.HIGH)  # Включаем светодиод
        time.sleep(1)                    # Ждем 1 секунду
        GPIO.output(LED_PIN, GPIO.LOW)   # Выключаем светодиод
        time.sleep(1)                    # Ждем 1 секунду
except KeyboardInterrupt:
    GPIO.cleanup()  # Очищаем настройки GPIO при выходе
```

**Пояснение:**
* `GPIO.setmode(GPIO.BCM)`: Устанавливаем режим нумерации пинов (BCM)
* `GPIO.setup()`: Настройка пина как входа или выхода
* `GPIO.output()`: Установка высокого или низкого уровня на пине
* `time.sleep()`: Задержка выполнения программы
* `GPIO.cleanup()`: Очистка настроек GPIO при завершении программы

## 2. Работа с GPIO

### 2.1. Цифровые входы и выходы

```python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

# Определяем пины
BUTTON_PIN = 17
LED_PIN = 18

# Настройка пинов
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(LED_PIN, GPIO.OUT)

try:
    while True:
        # Читаем состояние кнопки
        button_state = GPIO.input(BUTTON_PIN)
        
        # Если кнопка нажата (LOW из-за pull-up)
        if button_state == GPIO.LOW:
            GPIO.output(LED_PIN, GPIO.HIGH)
        else:
            GPIO.output(LED_PIN, GPIO.LOW)
            
        time.sleep(0.1)  # Небольшая задержка для стабильности
except KeyboardInterrupt:
    GPIO.cleanup()
```

### 2.2. ШИМ (PWM) для управления яркостью

```python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
LED_PIN = 18

# Настройка пина для ШИМ
GPIO.setup(LED_PIN, GPIO.OUT)
pwm = GPIO.PWM(LED_PIN, 100)  # Частота 100 Гц
pwm.start(0)

try:
    while True:
        # Плавно увеличиваем яркость
        for duty_cycle in range(0, 101, 5):
            pwm.ChangeDutyCycle(duty_cycle)
            time.sleep(0.1)
        
        # Плавно уменьшаем яркость
        for duty_cycle in range(100, -1, -5):
            pwm.ChangeDutyCycle(duty_cycle)
            time.sleep(0.1)
except KeyboardInterrupt:
    pwm.stop()
    GPIO.cleanup()
```

## 3. Работа с датчиками

### 3.1. Датчик температуры и влажности DHT22

```python
import Adafruit_DHT
import time

# Настройка датчика
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 4

while True:
    # Чтение данных с датчика
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    
    if humidity is not None and temperature is not None:
        print(f'Температура: {temperature:.1f}°C')
        print(f'Влажность: {humidity:.1f}%')
    else:
        print('Ошибка чтения датчика')
    
    time.sleep(2)
```

### 3.2. Ультразвуковой датчик расстояния HC-SR04

```python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

# Определяем пины
TRIG = 23
ECHO = 24

GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

def get_distance():
    # Отправляем импульс
    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)
    
    # Измеряем время отклика
    start_time = time.time()
    stop_time = time.time()
    
    while GPIO.input(ECHO) == 0:
        start_time = time.time()
    
    while GPIO.input(ECHO) == 1:
        stop_time = time.time()
    
    # Вычисляем расстояние
    time_elapsed = stop_time - start_time
    distance = (time_elapsed * 34300) / 2
    
    return distance

try:
    while True:
        dist = get_distance()
        print(f"Расстояние: {dist:.1f} см")
        time.sleep(1)
except KeyboardInterrupt:
    GPIO.cleanup()
```

## 4. Работа с дисплеями

### 4.1. LCD дисплей 16x2

```python
import RPi.GPIO as GPIO
import time
from RPLCD import CharLCD

# Инициализация LCD
lcd = CharLCD(cols=16, rows=2, pin_rs=37, pin_e=35, pins_data=[33, 31, 29, 23])

try:
    # Очистка дисплея
    lcd.clear()
    
    # Вывод текста
    lcd.write_string('Hello, World!')
    lcd.cursor_pos = (1, 0)
    lcd.write_string('Raspberry Pi')
    
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    lcd.clear()
    GPIO.cleanup()
```

## 5. Создание веб-сервера

### 5.1. Простой веб-сервер на Flask

```python
from flask import Flask, render_template
import RPi.GPIO as GPIO
import time

app = Flask(__name__)

# Настройка GPIO
GPIO.setmode(GPIO.BCM)
LED_PIN = 18
GPIO.setup(LED_PIN, GPIO.OUT)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/led/<state>')
def led_control(state):
    if state == 'on':
        GPIO.output(LED_PIN, GPIO.HIGH)
    elif state == 'off':
        GPIO.output(LED_PIN, GPIO.LOW)
    return 'OK'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
```

## 6. Работа с камерой

### 6.1. Создание фото и видео

```python
from picamera import PiCamera
import time

camera = PiCamera()

# Настройка камеры
camera.resolution = (1920, 1080)
camera.framerate = 30

# Создание фото
camera.start_preview()
time.sleep(2)  # Даем камере время на фокусировку
camera.capture('/home/pi/image.jpg')
camera.stop_preview()

# Создание видео
camera.start_preview()
camera.start_recording('/home/pi/video.h264')
time.sleep(10)  # Запись 10 секунд
camera.stop_recording()
camera.stop_preview()
```

## 7. Создание проектов

### 7.1. Система мониторинга с веб-интерфейсом

```python
from flask import Flask, render_template, jsonify
import Adafruit_DHT
import time
import threading

app = Flask(__name__)

# Глобальные переменные для хранения данных
sensor_data = {
    'temperature': 0,
    'humidity': 0
}

def read_sensor():
    DHT_SENSOR = Adafruit_DHT.DHT22
    DHT_PIN = 4
    
    while True:
        humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
        if humidity is not None and temperature is not None:
            sensor_data['temperature'] = temperature
            sensor_data['humidity'] = humidity
        time.sleep(2)

@app.route('/')
def home():
    return render_template('monitor.html')

@app.route('/data')
def get_data():
    return jsonify(sensor_data)

if __name__ == '__main__':
    # Запускаем чтение датчика в отдельном потоке
    sensor_thread = threading.Thread(target=read_sensor)
    sensor_thread.daemon = True
    sensor_thread.start()
    
    # Запускаем веб-сервер
    app.run(host='0.0.0.0', port=80)
```

## 8. Советы и рекомендации

### 8.1. Автозапуск программ

Создайте файл `/etc/systemd/system/myprogram.service`:
```ini
[Unit]
Description=My Raspberry Pi Program
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/myprogram.py
WorkingDirectory=/home/pi
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

Активация сервиса:
```bash
sudo systemctl enable myprogram.service
sudo systemctl start myprogram.service
```

### 8.2. Резервное копирование

```bash
# Создание образа SD-карты
sudo dd if=/dev/mmcblk0 of=/path/to/backup.img bs=4M

# Восстановление из образа
sudo dd if=/path/to/backup.img of=/dev/mmcblk0 bs=4M
```

## Заключение

Это руководство охватывает основные аспекты работы с Raspberry Pi. Для успешной работы рекомендуется:

1. Регулярно обновлять систему:
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

2. Использовать виртуальное окружение для Python-проектов:
   ```bash
   python3 -m venv myproject
   source myproject/bin/activate
   ```

3. Следить за температурой процессора:
   ```bash
   vcgencmd measure_temp
   ```

4. Правильно настраивать права доступа:
   ```bash
   sudo usermod -a -G gpio pi
   ```

5. Использовать логирование для отладки:
   ```python
   import logging
   logging.basicConfig(filename='app.log', level=logging.DEBUG)
   ```

Для более глубокого изучения рекомендуется обратиться к официальной документации Raspberry Pi и специализированным ресурсам. 