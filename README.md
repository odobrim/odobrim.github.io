## Установка

```html
<script>!function(e,i){var t=e.createElement("script"),o=[].slice.call(e.scripts).pop();t.async=!0,t.onload=function(){_odobrimWidget._target=o,"undefined"!=typeof _odobrimWidgetInit&&_odobrimWidgetInit(_odobrimWidget)},t.src="//odobrim.ru/widget/whitelabel/lib/0.1.0/script.js",o.parentNode.insertBefore(t,o)}(document);</script>

<script>
    function _odobrimWidgetInit(widget) {
        widget.init({
            widgetId: 'whitelabel',
            partnerId: 'идендификатор партнёра',
            server: 'odobrim.ru',
            type: 'тип продукта'
        });
    }
</script>
```

---

## API

### `widget.init(options[, onReady[, target]])`

#### Описание

*Данный метод инициализирует виджет*

#### Параметры

+ **`options: object`** — список параметров, передаваемых в виджет. Обязательные параметры: `options.widgetId`, `options.partnerId`, `options.server` и `options.type`.

    - **`options.widgetId; string`** — идендификатор виджета. Доступные идендификаторы: `"whitelabel"`.

    - **`options.partnerId: string`** — идендификатор партнёра. Например: `"bankiros_white_label"`.

    - **`options.server: string`** — сервер виджета. Например: `"odobrim.ru"`.

    - **`options.type: string`** — тип продукта. Доступные значения: `"card"` (кредитные карты), `"cash"` (кредит наличными), `"loan"` (микрозаем), `"refinance"` (рефинансирование).

    - **`options.amount?: number`** — сумма кредита или кредитный лимит (в зависимости от типа продукта).

    - **`options.period?: number`** — срок кредита в месяцах, либо срок в днях (для микрозаема).

+ **`onReady?: function | null`** — функция, которая будет вызвана по готовности виджета. 

+ **`target?: Node | null`** — элемент, перед которым будет вставлен виджет. По умолчанию виджет вставляется в месте установки его скрипта.


### `widget.ready(callback)`

#### Описание

*Данный метод выполяет функцию `callback` по готовности виджета*

#### Параметры

+ **`callback: function`** — функция, которая будет вызвана по готовности виджета.


### `widget.sendAction(type[, data])`

#### Описание

*Отправляет в виджет `"action"` и данные для него*

#### Параметры

+ **`type: string`** — тип действия.
+ **`data?: object | null`** — объект данных, которые отправятся в виджет.

---

## Примеры

### 1. Вставка виджета для «bankiros»

```html
<script>!function(e,i){var t=e.createElement("script"),o=[].slice.call(e.scripts).pop();t.async=!0,t.onload=function(){_odobrimWidget._target=o,"undefined"!=typeof _odobrimWidgetInit&&_odobrimWidgetInit(_odobrimWidget)},t.src="//odobrim.ru/widget/whitelabel/lib/0.1.0/script.js",o.parentNode.insertBefore(t,o)}(document);</script>

<script>
    function _odobrimWidgetInit(widget) {
        widget.init({
            widgetId: 'whitelabel',
            partnerId: 'bankiros_white_label',
            server: 'odobrim.ru',
            type: 'cash',

            amount: 10000, // сумма кредита
            period: 12    // срок кредита
        });
    }
</script>
```

### 2. Динамическая передача новых данных

```html

<div>
    <span>Сумма кредита:</span>
    <input type="range" min="100000" max="250000" value="10000" onchange="changeAmount(this.value)">
</div>

<div>
    <span>Срок кредита:</span>
    <input type="range" min="1" max="12" value="6" onchange="changePeriod(this.value)">
</div>

<script>
    function changeAmount(amount) {
        _odobrimWidget.sendAction('changeAmount', {
            value: amount
        });
    }

    function changePeriod(period) {
        _odobrimWidget.sendAction('changePeriod', {
            value: period
        });
    }
</script>
```