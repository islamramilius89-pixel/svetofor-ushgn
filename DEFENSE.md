# Защита проекта «Светофор УШГН»

Репозиторий: https://github.com/islamramilius89-pixel/svetofor-ushgn

## 1. Коротко о проекте (вступление, ~1 минута)

«Светофор УШГН» — одностраничное приложение (SPA) о системе мониторинга скважин
ПАО «Татнефть». УШГН — установки скважинных штанговых глубинных насосов.
Система анализирует ток электродвигателя и по отклонениям от эталона находит
неисправности оборудования.

Сайт состоит из четырёх разделов: «Главная», «О проекте», «Результаты», «Контакты».

**Что сделано по заданию:**

| Требование | Как выполнено |
|---|---|
| Базовая часть: лендинг | Главная страница: hero-блок, метрики, графики, возможности, призыв к действию |
| Бонус: SPA с роутингом | Vue Router, 4 маршрута, переходы без перезагрузки страницы |
| Бонус: стейт-менеджер | Pinia: общее хранилище, которое читают и меняют разные страницы |

**Стек:** Vue 3, Vue Router, Pinia, Tailwind CSS 4, сборщик Vite.

---

## 2. Структура проекта

```
svetofor-ushgn/
├── index.html              ← единственная HTML-страница, в неё монтируется Vue
├── package.json            ← зависимости и команды (dev / build / preview)
├── vite.config.js          ← настройка сборщика Vite
├── postcss.config.js       ← подключение Tailwind через PostCSS
├── public/favicon.svg      ← иконка вкладки
└── src/
    ├── main.js             ← точка входа: создаёт приложение, подключает Pinia и роутер
    ├── App.vue             ← корневой компонент: меню + <router-view> + подвал
    ├── style.css           ← подключение Tailwind и базовые стили
    ├── router/index.js     ← таблица маршрутов
    ├── stores/lightStore.js← хранилище Pinia (данные и действия)
    └── pages/              ← страницы (по одной на маршрут)
        ├── Home.vue
        ├── About.vue
        ├── Results.vue
        └── Contact.vue
```

**Как всё связано (путь запуска):**

```
index.html → main.js → App.vue → <router-view> → нужная страница из pages/
                 │                                        │
                 ├── app.use(createPinia()) ──────────────┴─→ useLightStore()
                 └── app.use(router)
```

---

## 3. Разбор кода по файлам

### 3.1. `index.html` — оболочка SPA

```html
<div id="app"></div>
<script type="module" src="/src/main.js"></script>
```

- Это **единственная** HTML-страница приложения. Именно поэтому оно называется
  *Single Page Application*: браузер загружает её один раз, а дальше весь
  контент меняет JavaScript.
- `<div id="app">` — пустой контейнер, в который Vue «монтирует» приложение.
- `type="module"` — скрипт подключается как ES-модуль, поэтому в нём
  работают `import` / `export`.

### 3.2. `src/main.js` — точка входа

```js
const app = createApp(App)   // 1. создаём приложение из корневого компонента
app.use(createPinia())       // 2. подключаем стейт-менеджер
app.use(router)              // 3. подключаем роутер
app.mount('#app')            // 4. выводим приложение в <div id="app">
```

- `createApp(App)` создаёт экземпляр Vue-приложения.
- `app.use(...)` — подключение **плагинов**. После этого Pinia и роутер
  доступны во всех компонентах. Отдельно импортировать их в каждый файл не нужно.
- `mount` вызывается последним, когда все плагины уже подключены.
- `import './style.css'` подключает глобальные стили (Tailwind).

### 3.3. `src/router/index.js` — маршрутизация

```js
const routes = [
  { path: '/',        component: Home,    name: 'home' },
  { path: '/about',   component: About,   name: 'about' },
  { path: '/results', component: Results, name: 'results' },
  { path: '/contact', component: Contact, name: 'contact' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

- `routes` — таблица соответствия «адрес → компонент страницы».
- `name` — имя маршрута. По нему можно переходить без жёсткой ссылки:
  `{ name: 'about' }`.
- `createWebHistory()` — режим **History API**. Адреса выглядят обычно
  (`/about`), без решётки. Роутер меняет URL через `history.pushState`,
  поэтому страница не перезагружается, а кнопки «Назад» и «Вперёд» в браузере работают.
- Альтернатива — `createWebHashHistory()` с адресами вида `/#/about`.

### 3.4. `src/App.vue` — корневой компонент (каркас сайта)

```vue
<router-link to="/about">О проекте</router-link>
...
<main class="w-full flex-1">
  <router-view />
</main>
```

- **`<router-link>`** — ссылка роутера. Выглядит как обычная `<a>`, но
  перехватывает клик: вместо перезагрузки страницы роутер просто меняет
  компонент.
- **`<router-view>`** — место, куда подставляется компонент текущего маршрута.
  Меню и подвал остаются на месте, меняется только содержимое `<main>`.
- Активный пункт меню подчёркивается. Роутер сам добавляет текущей ссылке
  класс `router-link-exact-active`, стиль для него задан в `<style scoped>`.
- `scoped` значит, что стили действуют только внутри этого компонента.
- Вёрстка: `min-h-screen flex flex-col` на корне и `flex-1` на `<main>`.
  Благодаря этому подвал всегда внизу окна, даже если на странице мало текста.

### 3.5. `src/stores/lightStore.js` — хранилище Pinia

```js
export const useLightStore = defineStore('light', () => {
  // State — данные
  const wells = ref(2494)
  const wellsWithDeviations = ref(1570)
  const downtimeFound = ref(843)
  const targetCompleteness = ref(90)
  const currentCompleteness = ref(63.9)
  const userMessages = ref([])
  let nextMessageId = 1

  // Getters — вычисляемые значения
  const messageCount = computed(() => userMessages.value.length)

  // Actions — функции, которые меняют данные
  const addMessage = (message) => {
    userMessages.value.push({
      id: nextMessageId++,
      text: message,
      timestamp: new Date().toLocaleString('ru-RU'),
    })
  }
  const removeMessage = (id) => {
    userMessages.value = userMessages.value.filter(msg => msg.id !== id)
  }
  const clearMessages = () => { userMessages.value = [] }

  return { wells, ..., addMessage, removeMessage, clearMessages }
})
```

Хранилище написано в стиле **Setup Store** (через Composition API):

| Часть Pinia | Чем сделано в коде | Пример |
|---|---|---|
| **state** (состояние) | `ref(...)` | `wells`, `userMessages` |
| **getters** (вычисляемые) | `computed(...)` | `messageCount` |
| **actions** (действия) | обычные функции | `addMessage`, `removeMessage`, `clearMessages` |

- `defineStore('light', ...)` — `'light'` — уникальный id хранилища
  (по нему оно видно в Vue DevTools).
- `useLightStore` — функция-«хук». Любой компонент вызывает её и получает
  **один и тот же** экземпляр хранилища, поэтому данные общие для всех страниц.
- Всё, что должно быть доступно снаружи, нужно **вернуть** из функции (`return`).
- `messageCount` пересчитывается автоматически при изменении `userMessages`.
- `nextMessageId++` даёт каждому сообщению уникальный id. Он нужен для
  `:key` в списке и для удаления нужного сообщения.

### 3.6. `src/pages/Home.vue` — главная (лендинг)

Блоки страницы: hero → 4 карточки метрик → прогресс полноты → типы
неисправностей → охват по НГДУ → возможности → призыв к действию.

**Чтение данных из Pinia:**

```vue
<div class="text-5xl ...">{{ store.wells }}</div>
...
<script setup>
import { computed } from 'vue'
import { useLightStore } from '../stores/lightStore'

const store = useLightStore()

const deviationShare = computed(() =>
  Math.round((store.wellsWithDeviations / store.wells) * 100)
)
</script>
```

- `<script setup>` — сокращённая запись Composition API: всё, что объявлено
  в скрипте, сразу доступно в шаблоне.
- `{{ store.wells }}` — интерполяция. При изменении значения в хранилище
  число на странице обновится само, это и есть **реактивность**.
- `.value` в шаблоне не пишем: Pinia сама «разворачивает» `ref`.
- `deviationShare` — вычисляемая доля скважин с отклонениями:
  1570 / 2494 ≈ 63%. Число не вписано вручную, а считается из данных.

**Динамическая ширина прогресс-бара:**

```vue
<div :style="{ width: store.currentCompleteness + '%' }"></div>
```

`:style` (сокращение от `v-bind:style`) привязывает стиль к данным: ширина
полосы равна значению из хранилища.

**Столбчатая диаграмма через `v-for`:**

```vue
<div v-for="(percent, ngdu) in ngduData" :key="ngdu">
  <p>{{ ngdu }}</p>
  <div class="w-20 h-40 bg-gray-300 flex items-end">
    <div :style="{ height: percent + '%' }"></div>
  </div>
  <div>{{ percent }}%</div>
</div>
```

- `v-for` по **объекту** даёт пару `(значение, ключ)`: `percent` = 67,
  `ngdu` = «НГДУ №1».
- `:key` — уникальный ключ элемента. По нему Vue понимает, какие элементы
  изменились, и перерисовывает только их.
- Высота столбика = процент, `items-end` прижимает его к низу.

### 3.7. `src/pages/Contact.vue` — форма, которая пишет в Pinia

Эта страница показывает **запись** в стейт-менеджер.

```vue
<form @submit.prevent="submitForm">
  <input id="contact-name" v-model="form.name" type="text" required />
  <input id="contact-email" v-model="form.email" type="email" required />
  <textarea id="contact-message" v-model="form.message" required></textarea>
  <button type="submit">Отправить</button>
</form>
```

```js
const store = useLightStore()
const form = ref({ name: '', email: '', message: '' })

const submitForm = () => {
  const message = `${form.value.name} (${form.value.email}): ${form.value.message}`
  store.addMessage(message)                       // запись в хранилище
  form.value = { name: '', email: '', message: '' } // очистка формы
}
```

- **`v-model`** — двусторонняя привязка. Ввод в поле сразу меняет
  `form.name`, а изменение `form.name` в коде меняет поле.
- **`@submit.prevent`** — обработчик отправки. Модификатор `.prevent`
  вызывает `event.preventDefault()`: форма не перезагружает страницу, как это
  было бы в обычном HTML.
- `required` и `type="email"` — встроенная проверка браузера: пустую
  форму или неправильный email отправить нельзя.
- `<label for="...">` связан с `id` поля: клик по подписи ставит курсор
  в поле (это нужно для доступности).
- Список сообщений:

```vue
<section v-if="store.userMessages.length > 0">
  <h2>Полученные сообщения ({{ store.messageCount }})</h2>
  <div v-for="msg in store.userMessages" :key="msg.id">
    {{ msg.text }} — {{ msg.timestamp }}
    <button type="button" @click="store.removeMessage(msg.id)">✕</button>
  </div>
  <button type="button" @click="store.clearMessages">Очистить все</button>
</section>
```

  - `v-if` — блок появляется в DOM, только когда есть сообщения.
  - `@click` вызывает **actions** хранилища.
  - `type="button"` — чтобы кнопки не считались кнопками отправки формы.

### 3.8. `About.vue` и `Results.vue`

Это страницы-статьи: описание системы, этапы развития, технические
характеристики, результаты опытно-промышленной эксплуатации и дорожная карта.
Логики в них нет, только вёрстка на Tailwind. Они нужны, чтобы у роутера
было между чем переключаться.

### 3.9. Стили: Tailwind CSS 4

`style.css`:

```css
@import "tailwindcss";

@layer base {
  html { font-family: ...; }
  body { color: #213547; background-color: #f9fafb; }
}
```

- Tailwind — **утилитарный** CSS: стили пишутся классами прямо в разметке
  (`p-8` — внутренний отступ, `rounded-2xl` — скругление, `shadow-xl` — тень).
- Адаптивность через префиксы: `grid-cols-1 md:grid-cols-4` значит
  «на телефоне 1 колонка, от 768px — 4».
- Состояния: `hover:scale-105` увеличивает карточку при наведении.
- Tailwind 4 подключается одной строкой `@import "tailwindcss"` и через плагин
  `@tailwindcss/postcss` (в `postcss.config.js`). Какие классы используются,
  он находит в файлах проекта сам, отдельный `tailwind.config.js` не нужен.
- Свои базовые стили лежат внутри `@layer base`. Если писать их вне слоя,
  они перебьют утилиты Tailwind. Именно эту ошибку я исправлял: сброс
  `* { margin: 0; padding: 0 }` отключал все отступы на сайте.

### 3.10. Сборка: Vite

| Команда | Что делает |
|---|---|
| `npm install` | ставит зависимости из `package.json` |
| `npm run dev` | dev-сервер на http://localhost:5173 с горячей перезагрузкой (HMR) |
| `npm run build` | собирает готовый сайт в папку `dist/` (минифицированные JS и CSS) |
| `npm run preview` | локально показывает собранную версию из `dist/` |

`vite.config.js` подключает плагин `@vitejs/plugin-vue`, который учит Vite
понимать `.vue`-файлы.

---

## 4. Демонстрация (что показать вживую)

1. `npm install`, затем `npm run dev`, открыть http://localhost:5173.
2. Пощёлкать меню: адрес в строке меняется, а страница **не перезагружается**
   (в DevTools → Network новых загрузок HTML нет). Кнопка «Назад» работает.
3. Перейти в «Контакты», отправить 2 сообщения: появится список и счётчик.
4. Уйти на «Главную» и вернуться в «Контакты»: сообщения **на месте**,
   потому что они хранятся в Pinia, а не в самой странице.
5. Удалить одно сообщение (✕), затем очистить все.
6. Сузить окно: сетки перестраиваются в одну колонку, меню переносится.

---

## 5. Вопросы, которые могут задать, и ответы

**Что такое SPA и чем отличается от обычного сайта?**
Обычный сайт при каждом переходе загружает новую HTML-страницу с сервера.
SPA загружается один раз, а дальше JavaScript сам меняет содержимое
и адрес. Переходы быстрее, и состояние (например, данные в Pinia)
сохраняется между страницами.

**Как роутер меняет адрес без перезагрузки?**
Через History API браузера (`history.pushState`). `<router-link>` отменяет
обычный переход по ссылке, роутер находит маршрут в таблице и подставляет
нужный компонент в `<router-view>`.

**Зачем нужен стейт-менеджер, если можно хранить данные в компоненте?**
Данные внутри компонента живут, пока он на экране: при переходе на другую
страницу компонент уничтожается, и данные пропадают. Хранилище Pinia живёт,
пока открыто приложение, и одно на всех. В моём проекте главная читает из него
метрики, а «Контакты» пишут и удаляют сообщения.

**Что такое state, getters и actions?**
State — сами данные (`ref`). Getters — значения, вычисляемые из данных
(`computed`, у меня `messageCount`). Actions — функции, которые меняют
данные (`addMessage`, `removeMessage`, `clearMessages`).

**Почему Pinia, а не Vuex?**
Pinia — официальный рекомендуемый стейт-менеджер для Vue 3. В нём
нет мутаций, как во Vuex, меньше шаблонного кода, и он поддерживает
Composition API.

**Что будет, если сделать `const { wells } = store`?**
Реактивность потеряется: `wells` станет обычным числом и перестанет
обновляться. Для деструктуризации нужен `storeToRefs(store)`. Поэтому
я обращаюсь к данным через `store.wells`.

**Зачем `:key` в `v-for`?**
Чтобы Vue отличал элементы списка друг от друга и при изменениях
(например, удалении сообщения) перерисовывал только нужный элемент.

**Чем `v-if` отличается от `v-show`?**
`v-if` добавляет или удаляет элемент из DOM, а `v-show` только скрывает
его через `display: none`. Для списка сообщений, который появляется
редко, подходит `v-if`.

**Что делает `.prevent` в `@submit.prevent`?**
Вызывает `preventDefault()`: браузер не отправляет форму на сервер
и не перезагружает страницу.

**Сохранятся ли сообщения после обновления страницы (F5)?**
Нет. Pinia хранит данные в памяти вкладки, и при перезагрузке они
сбрасываются. Чтобы сохранять их, можно записывать массив в `localStorage`
(или подключить плагин `pinia-plugin-persistedstate`), а в реальном проекте
отправлять на сервер через API.

**Что будет, если открыть несуществующий адрес, например `/abc`?**
Сейчас откроется пустая область между меню и подвалом. Это исправляется
маршрутом-«заглушкой» `{ path: '/:pathMatch(.*)*', component: NotFound }`.

**Как опубликовать сайт?**
`npm run build` создаёт папку `dist/`, её можно выложить на GitHub Pages,
Netlify или Vercel. При режиме `createWebHistory` хостинг нужно настроить
так, чтобы на любой адрес он отдавал `index.html`. Иначе при обновлении
страницы `/about` сервер вернёт 404. Другой вариант — перейти на
`createWebHashHistory`.

**Откуда данные?**
Метрики взяты из презентации результатов проекта: 2 494 скважины,
1 570 с отклонениями, 843 простоя (398 наземный привод + 445 ГНО),
полнота обнаружения выросла с 61.7% до 63.9% при цели ≥ 90%.

---

## 6. Итог

- **Лендинг:** главная страница с hero-блоком, метриками, диаграммами и
  призывом к действию; адаптивная вёрстка на Tailwind.
- **SPA и роутинг:** Vue Router, 4 маршрута, `<router-link>` и `<router-view>`,
  History API.
- **Стейт-менеджер:** Pinia (state, getters, actions); данные общие для
  нескольких страниц, чтение на главной, запись и удаление на «Контактах».
- **Git:** код опубликован на GitHub.
