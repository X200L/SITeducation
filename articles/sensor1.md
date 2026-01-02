# Датчик температуры на esp8266
Привет! Сегодня речь пойдет о создании датчика температуры с передачей данных по wi-fi. Это простой проект который поможет вам освоить основы программирования для esp8266 , но при этом данный проект можно сделать довольно серьезным, добавив много различного функционала для самого датчика.  Данная статья является первой частью из трех, связанных с созданием автономных датчиков.

Вообще, однажды я уже делал такой проект и представлял его на конкурс большие вызовы, где с ним дошел до финала и почти получил призера, не добрав пол балла. Сейчас представляю все информацию по нему в неизменном виде, поэтому дайте этой теме шанс на реализацию)

## Первая версия датчика

### Немного про AJAX. Что это?

AJAX (Asynchronous JavaScript and XML) - технология асинхронного обмена данными между браузером и сервером. 
Принцип работы прост: JavaScript периодически отправляет запросы на сервер, получает только обновленные данные (в нашем случае, температуру) и вставляет их в нужное место на странице. [Подробнее](https://ru.wikipedia.org/wiki/AJAX)

### Необходимые компоненты

Для создания самого датчика нам потребуется:
- **Модуль ESP8266** (Любой, я использую ESP-01)
- **Датчик температуры** DS18B20 (однопроводной интерфейс)
- **Соединительные провода**
- **Светодиод + резистор 100 Ом** 
- **Макетная плата**
- **Usb-кабель + Usb-ttl конвертер** для программирования и питания

### Необходимое ПО:
- Arduino IDE с поддержкой ESP8266
- Библиотеки(помимо встроенных):
  - OneWire
  - DallasTemperature

## Сборка

Собирать датчик нужно по схеме:

![images/ds.png](images/ds.png)

Или текстом:
 ```
 Датчик DS18B20 -> ESP8266
───────────────   ────────
Красный провод -> 3.3V (питание)
Чёрный провод  -> GND (земля)
Жёлтый провод  -> GPIO2 (D4, данные)
 ```

Далее я напечатал корпус на 3д принтере:
![images/sensorcopy.png](images/sensorcopy.png)

Внутри конечно картина не такая приятная, но раньше я умел делать только такое:
![images/Sensor.png](images/Sensor.png)

Далее можем перейти к коду

## Программирование сенсора

### Веб страница
Для начала напишем простую веб страницу **index.h**:
```html
const char webpage[] PROGMEM = R"=====(
<!DOCTYPE html>
<html>
<style type="text/css">
.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
</style>
<body style="background-color: black; color: white ">
<center>
<div>
<h1>Temperature sensor</h1>
  <button class="button" onclick="send(1)">LED ON</button>
  <button class="button" onclick="send(0)">LED OFF</button><BR>
</div>
 <br>
<div><h2>
  Temp(C): <span id="adc_val">0</span><br><br>
  LED State: <span id="state">NA</span>
</h2>
</div>
<script>
function send(led_sts) 
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("state").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "led_set?state="+led_sts, true);
  xhttp.send();
}
setInterval(function() 
{
  getData();
}, 2000); 
function getData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("adc_val").innerHTML =
      this.responseText;
    }
  };
  xhttp.open("GET", "adcread", true);
  xhttp.send();
}
</script>
</center>
</body>
</html>
)=====";
```

Ключевая функция для периодического опроса:
```javascript
setInterval(function() {
  getData();
}, 2000);

function getData() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "adcread", true);
  xhttp.send();
}
```

### Основной код

Далее перейдем к основной части программы. Вот полный код файла main.ino

```c
//https://compacttool.ru/wemos-ttgo-modul-wifi-peredatchika-esp8266-nodemcu-s-oled-ekranom-091-dyujma
/*U8g2 library: https://github.com/olikraus/u8g2
SDA D4 / GPIO2
SCL D5 / GPIO14
RST D2 / GPIO4*/

/*Arduino code for ESP8266 AJAX Webserver www.circuitdigest.com */
#define AP // Работа в режиме точки доступа (или клиента - закомментировать)

#include <ESP8266WiFi.h> // вообще всегда нужон
//#include <WiFiClient.h> // Для работы с имеющейся сетью
#include <ESP8266WebServer.h> // Для работы сервера
#include "index.h"



//////////////////////////////////////////
#include <OneWire.h>
#include <DallasTemperature.h>

const int SensorDataPin = 2;     

OneWire oneWire(SensorDataPin);
 
DallasTemperature sensors(&oneWire);
//////////////////////////////////////////


#ifdef AP // Режим работы точки доступа
#define AP_SSID "Temperature sensor"
//#define AP_PASS "0000" // Если что - просто раскомментировать
#else // Подключение к имеющейся сети
const char* ssid = "RPI-NET";// Имя имеющейся сети
const char* password = "18598940"; // и её пароль
#endif

ESP8266WebServer server(80);
void handleRoot()
{
  String s = webpage;
  //  String s = index;
  server.send(200, "text/html", s);
}
void sensor_data()
{
  sensors.requestTemperatures(); 
  float temperature_Celsius = sensors.getTempCByIndex(0);
  float temperature_Fahrenheit = sensors.getTempFByIndex(0);
 // String sensor_value = String(temperature_Celsius);
  Serial.print("Temperature: ");
  Serial.print(temperature_Celsius);
  Serial.println(" ºC");
  Serial.print("Temperature: ");
  Serial.print(temperature_Fahrenheit);
  Serial.println(" ºF");
//  Serial.print(sensor_value);
  Serial.println("");
  delay(100);
  
  //int a = analogRead(A0);
  //int temp = a / 4.35;
  //float temp = float(random(0, 1000)) / 100;
  String sensor_value = String(temperature_Celsius);
  server.send(200, "text/plane", sensor_value);
}
void led_control()
{
  String state = "OFF";
  String act_state = server.arg("state");
  if (act_state == "1")
  { // Для есп почему-то состояния инвертированы
    digitalWrite(LED_BUILTIN, HIGH); //LED ON (включение светодиода)
    state = "ON";
    /* delay(100);
      digitalWrite(LED_BUILTIN, HIGH); //LED OFF (выключение светодиода)*/
  }  else  {// Для есп почему-то состояния инвертированы
    digitalWrite(LED_BUILTIN, LOW); //LED OFF (выключение светодиода)
    state = "OFF";
  }
  server.send(200, "text/plane", state);
}
void setup(void)
{
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW); //LED OFF (выключение светодиода)
#ifdef AP // Если работаем в режиме точки доступа:
  WiFi.mode(WIFI_AP);
  Serial.println("...");
  Serial.print("WiFi: ");
  Serial.println(AP_SSID);
#ifdef AP_PASS // для точки доступа задан пароль...
  WiFi.softAP(AP_SSID, AP_PASS) // сеть с паролем
  Serial.print("Password: ");
  Serial.println(AP_PASS);
#else // или для точки доступа не задан пароль...
  WiFi.softAP(AP_SSID); // сеть без пароля. Указываем только имя
#endif
  Serial.print("IP address: 192.168.4.1"); // Обычный адрес есп в этой сети
#else // Работаем в режиме клиента, подключившись к имеющейся сети
  WiFi.begin(ssid, password);
  Serial.println("");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Connecting...");
    delay(250);
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
#endif

  server.on("/", handleRoot);
  server.on("/led_set", led_control);
  server.on("/adcread", sensor_data);
  server.begin();
}
void loop(void)
{
  server.handleClient();
}
```
### Пояснения к коду

### 1. Два режима работы Wi-Fi
Данная программа поддерживает два режима:

```cpp
#ifdef AP
// Режим точки доступа
WiFi.softAP("Temperature sensor");
#else
// Режим клиента
WiFi.begin("RPI-NET", "18598940");
#endif
```

**Точка доступа** удобна для автономной работы, **клиентский режим** - для интеграции в существующую сеть.
### 2. Подключение библиотек и датчика
```cpp
#include <OneWire.h>
#include <DallasTemperature.h>

const int SensorDataPin = 2; // GPIO2 (D4)
OneWire oneWire(SensorDataPin);
DallasTemperature sensors(&oneWire);
```

### 3. Функция чтения температуры
```cpp
void sensor_data() {
  sensors.requestTemperatures();
  float temperature_Celsius = sensors.getTempCByIndex(0);
  String sensor_value = String(temperature_Celsius);
  server.send(200, "text/plane", sensor_value);
}
```

### 4. AJAX-обработчики сервера
```cpp
server.on("/", handleRoot); // Главная страница
server.on("/led_set", led_control); // Управление светодиодом
server.on("/adcread", sensor_data); // Получение температуры
```

## Подключение и использование

Далее перейдем к этапу подключения и использования самого датчика. В режиме клиента ip-адрес отображается в мониторе порта, вводим его в браузер и открываем интерфейс. Я в основном использовал режим точки доступа, тогда интерфейс датчика доступен по адресу `192.168.4.1`.
Вот так выглядит веб страничка:
![page](images/dsWeb.png)
Температура в веб интерфейсе обновляется каждые  секунды, также по кнопке можно включить и отключить светодиод, встроенный в сенсор.

## Улучшения проекта

Данные проект довольно прост и является учебным, ном его можно круто доработать и презентовать как крутой и серьезный проект. Вот как пример я подскажу вам пару идей) 

### Для расширения функционала можно:
1. Добавить график температуры с использованием Chart.js
2. Реализовать логирование данных на SD-карту
3. Добавить отправку  данных в облачные сервисы (MQTT, ThingSpeak) *Кстати мы это реализуем в одной из следующих статей*
4. Сделать более красивый пользовательский интерфейс
## Заключение

В первой статье мы с вами реализовали простой датчик температуры на базе esp-01. В следущий статьях сделаем более крутую версию и я расскажу про собственную библиотеку для создания автономных датчиков. 

Но несмотря на все это, создание датчика температуры на ESP8266 с AJAX-интерфейсом - отличный проект для знакомства с IoT.

Такой датчик может стать основой для более сложных систем мониторинга окружающей среды(*спойлер, мы этим займемся*), умного дома или промышленного IoT.

Все исходники выложил на [github](https://github.com/ArduRadioKot/Temperature-sensor), накиньте звезд на проект пж ;) 
Кстати там есть спойлер следущей части :)
