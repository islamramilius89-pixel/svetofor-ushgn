# Защита проекта «Светофор УШГН» (React-версия)

Репозиторий: https://github.com/islamramilius89-pixel/svetofor-ushgn (ветка `react-nextjs`)

## 1. Коротко о проекте (вступление, ~1 минута)

«Светофор УШГН» — сайт о системе мониторинга скважин ПАО «Татнефть». УШГН — установки
скважинных штанговых глубинных насосов. Система анализирует ток электродвигателя и по
отклонениям от эталона находит неисправности оборудования.

Сайт состоит из четырёх разделов: «Главная», «О проекте», «Результаты», «Контакты».

**Что сделано по заданию:**

| Требование | Как выполнено |
|---|---|
| Базовая часть: лендинг | Главная страница: hero-блок, метрики, графики, возможности, призыв к действию |
| Бонус: SPA с роутингом | Next.js App Router: 4 маршрута + 404, переходы через `<Link>` без перезагрузки страницы |
| Бонус: стейт-менеджер | TanStack Query — состояние данных сервера (кеш, загрузка, ошибки, мутации) |

**Стек:** Next.js 16 (App Router), React 19, TypeScript, TanStack Query, Zod, Tailwind CSS 4.

Сначала проект был на Vue 3 (ветка `main`), затем я переписал его на React по слоистой
архитектуре, описанной в скилле `.claude/skills/next-frontend-architecture/SKILL.md`.

---

## 2. Архитектура: слои и путь вызова

```
app → component → flow → interaction → use-case → infrastructure → API
```

Каждый слой отвечает за одно:

| Слой | Папка | Отвечает за |
|---|---|---|
| Маршруты | `src/app/` | URL, страницы, общий каркас, серверный API |
| Экраны | `src/components/<feature>/` | вёрстка конкретной функции |
| Сценарии | `src/flows/` | собирают данные, действия и состояние для одного экрана |
| Взаимодействия | `src/interactions/` | TanStack Query: ключи кеша, запросы, мутации |
| Действия приложения | `src/layers/use-cases/` | правила и последовательности действий без React |
| Инфраструктура | `src/layers/infrastructure/` | HTTP-клиент, работа с API, источники данных |
| Предметная область | `src/layers/domain/` | типы, расчёты, схемы проверки. Не знает ни про React, ни про HTTP |
| Общее | `src/common/` | переиспользуемые UI-элементы, провайдер, форматирование |

**Главное правило:** слой создаётся, только если у него есть своя ответственность.
- Страница «О проекте» статичная, поэтому у неё только `app` и `components`.
- Главная и «Результаты» получают данные через use-case, им не нужны flow и Query.
- Полный путь через все слои есть только у формы контактов, потому что там есть запросы,
  мутации, проверка данных и состояние формы.

**Зачем это нужно:** каждую часть можно менять отдельно. Например, если вместо статических
данных появится настоящий API, поменяется только файл в `infrastructure`, а страницы,
расчёты и компоненты останутся прежними.

---

## 3. Структура проекта

```
src/
├── app/
│   ├── layout.tsx                 каркас: шапка, <main>, подвал, QueryProvider
│   ├── page.tsx                   /          главная
│   ├── about/page.tsx             /about
│   ├── results/page.tsx           /results
│   ├── contact/page.tsx           /contact
│   ├── not-found.tsx              страница 404
│   ├── icon.svg                   иконка вкладки (светофор)
│   └── api/messages/
│       ├── route.ts               GET (список), POST (создать), DELETE (очистить)
│       └── [id]/route.ts          DELETE (удалить одно)
├── components/
│   ├── layout/                    SiteHeader, NavLink, SiteFooter
│   ├── home/                      HomeScreen и его секции
│   ├── about/AboutScreen.tsx
│   ├── results/ResultsScreen.tsx
│   └── contact/                   ContactScreen, ContactForm, MessageList, ContactInfo
├── flows/use-contact-flow.ts
├── interactions/messages.ts
├── layers/
│   ├── domain/monitoring/monitoring.ts       типы и расчёты показателей
│   ├── domain/messages/message.ts            схема формы и сообщения (Zod)
│   ├── use-cases/monitoring/get-monitoring-overview.ts
│   ├── use-cases/messages/send-contact-message.ts     (браузер)
│   ├── use-cases/messages/accept-contact-message.ts   (сервер)
│   ├── infrastructure/http/http-client.ts
│   ├── infrastructure/messages/messages-api.ts        (браузер → API)
│   ├── infrastructure/messages/message-repository.ts  (хранилище на сервере)
│   └── infrastructure/monitoring/monitoring-source.ts (данные из презентации)
├── common/                        Card, PageShell, ProgressBar, QueryProvider, format.ts
└── assets/styles/globals.css
```

---

## 4. Роутинг: как устроено SPA в Next.js

### Маршруты — это папки

В App Router адрес определяется **структурой папок**, отдельного файла с таблицей маршрутов нет:

| Файл | Адрес |
|---|---|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/results/page.tsx` | `/results` |
| `app/contact/page.tsx` | `/contact` |
| `app/not-found.tsx` | любой несуществующий адрес |

### Общий каркас — `layout.tsx`

```tsx
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col ...">
        <QueryProvider>
          <SiteHeader />
          <main className="w-full flex-1">{children}</main>
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  )
}
```

- `children` — текущая страница. Шапка и подвал при переходах **не перерисовываются**,
  меняется только содержимое `<main>`.
- `metadata` с `template: '%s — Светофор УШГН'` задаёт заголовок вкладки, у каждой страницы он свой.

### Переходы без перезагрузки — `<Link>`

```tsx
'use client'
export function NavLink({ href, children }) {
  const isActive = usePathname() === href
  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined} className={...}>
      {children}
    </Link>
  )
}
```

- `<Link>` из `next/link` перехватывает клик: браузер не загружает страницу заново,
  Next.js подгружает только данные новой страницы и подменяет содержимое.
  Поэтому это **SPA**.
- Next.js заранее подгружает страницы, ссылки на которые видны на экране (prefetch),
  так что переходы почти мгновенные.
- `usePathname()` возвращает текущий адрес, по нему подсвечивается активный пункт меню.
  `aria-current="page"` сообщает скринридеру, на какой странице находится пользователь.

**Отличие от Vue Router:** во Vue я описывал маршруты массивом в `router/index.js`,
а здесь маршрут — это файл. Роль `<router-link>` играет `<Link>`, а роль `<router-view>` — `children` в `layout.tsx`.

---

## 5. Сервер и браузер

Все `page.tsx` и `layout.tsx` — **серверные компоненты**: они выполняются на сервере
(или при сборке), и в браузер приходит готовый HTML. Их JavaScript в браузер не загружается.

`"use client"` стоит только там, где нужна интерактивность:

| Компонент | Зачем ему браузер |
|---|---|
| `NavLink` | `usePathname()` для подсветки активной ссылки |
| `QueryProvider` | создаёт кеш TanStack Query (нужен `useState`) |
| `ContactScreen` | форма, обработчики событий, запросы к API |

**Пример границы** (`app/contact/page.tsx`):

```tsx
<PageShell title="Контакты">
  <ContactScreen info={<ContactInfo />} />
</PageShell>
```

`ContactInfo` — статичный блок, он рендерится на сервере и передаётся внутрь клиентского
`ContactScreen` через prop. Так клиентским становится только то, что действительно интерактивно.

**Главная получает данные на сервере:**

```tsx
export default function HomePage() {
  return <HomeScreen overview={getMonitoringOverview()} />
}
```

Страница вызывает use-case прямо на сервере и передаёт экрану готовые данные через props.
В сборке эти страницы помечены как `○ (Static)`: они собраны заранее и открываются мгновенно.

---

## 6. Данные мониторинга: domain → use-case → компоненты

### domain — правила предметной области (`monitoring.ts`)

```ts
export function percentOf(part: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((part / total) * 100)
}

export function completenessGain(progress: CompletenessProgress): number {
  return roundTo(progress.current - progress.before)   // 63.9 − 61.7 = 2.2
}

export function detectionQuality(rate: number): DetectionQuality {
  return rate >= GOOD_DETECTION_THRESHOLD ? 'good' : 'needs-work'
}
```

- Чистые функции без React и HTTP, поэтому их легко проверить и переиспользовать.
- `roundTo` нужен из-за особенностей дробных чисел: `63.9 - 61.7` в JavaScript даёт
  `2.2000000000000028`.
- `detectionQuality` решает, какая подпись будет у карточки: «Хорошо обнаруживается»
  (78.3%) или «Требует доработки» (48.1%). Порог 70% вынесен в константу.

### use-case — сборка показателей (`get-monitoring-overview.ts`)

```ts
export function getMonitoringOverview(): MonitoringOverview {
  const snapshot = loadMonitoringSnapshot()
  const downtime = totalDowntime(snapshot.faultGroups)
  return {
    ...snapshot,
    deviationShare: percentOf(snapshot.wellsWithDeviations, snapshot.totalWells), // 63%
    totalDowntime: downtime,                                                       // 843
    faultSummaries: snapshot.faultGroups.map((group) => ({
      ...group,
      share: percentOf(group.downtimeCount, downtime),                             // 47% / 53%
      quality: detectionQuality(group.detectionRate),
    })),
    ...
  }
}
```

Берёт исходные данные из инфраструктуры и рассчитывает всё, что показывают страницы.
**Ни одно производное число не вписано в вёрстку вручную**: 63%, 843, 47%/53%, +2.2%,
разброс 54–69% считаются из исходных данных.

### Компоненты — только отображение

```tsx
{summaries.map((group) => (
  <div key={group.id}>
    <span className={groupColors[group.id].text}>{group.title}</span>
    <ProgressBar value={group.share} label={group.title} barClassName={groupColors[group.id].bar} />
    <span>{group.downtimeCount} ({group.share}%)</span>
  </div>
))}
```

- `.map()` выводит список, а `key` помогает React понять, какой элемент изменился.
- Цвета хранятся в объекте по `id` группы (`Record<FaultGroupId, ...>`). Если добавить
  новую группу и забыть указать для неё цвет, TypeScript выдаст ошибку.
- Классы Tailwind записаны целиком (`'text-blue-600'`), а не собираются из частей:
  Tailwind находит классы поиском по тексту файлов.

---

## 7. Форма контактов: полный путь через все слои

Это главный пример архитектуры и стейт-менеджмента.

```
ContactForm (кнопка «Отправить»)
  → useContactFlow.submit()                       flows
    → useSendMessageMutation().mutate(form)       interactions
      → sendContactMessage(form)                  use-case: проверка Zod в браузере
        → createMessage(data)                     infrastructure: POST /api/messages
          → route.ts POST                         app/api: сервер
            → acceptContactMessage(body)          use-case: повторная проверка на сервере
              → messageRepository.add(...)        infrastructure: сохранение
      ← onSuccess: setQueryData(...)              кеш обновлён, список перерисован
```

### domain — схема формы (`message.ts`)

```ts
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Имя должно быть не короче 2 символов').max(80, ...),
  email: z.string().trim().pipe(z.email('Введите корректный email')),
  text: z.string().trim().min(1, 'Введите сообщение').max(2000, ...),
})
export type ContactForm = z.output<typeof contactFormSchema>
```

- **Zod** описывает правила один раз. Из той же схемы TypeScript выводит тип
  (`z.output`), поэтому тип и проверка не могут разойтись.
- `.trim()` убирает пробелы, так что имя из одних пробелов не пройдёт.
- `validateContactForm` возвращает либо очищенные данные, либо ошибки по каждому полю.

### Проверка в двух местах

- **В браузере** (`send-contact-message.ts`): пользователь сразу видит ошибки, лишний
  запрос не отправляется.
- **На сервере** (`accept-contact-message.ts`): клиенту доверять нельзя, запрос можно
  отправить в обход формы. Сервер проверяет данные по **той же схеме** и отвечает `400`
  с ошибками по полям.

### infrastructure — HTTP-клиент (`http-client.ts`)

```ts
export async function requestJson<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const response = await send(path, init)
  const parsed = schema.safeParse(await response.json().catch(() => null))
  if (!parsed.success) throw new ApiError('Сервер вернул данные в неожиданном формате', response.status)
  return parsed.data
}
```

- Вся работа с `fetch` собрана в одном месте: базовый URL, заголовки, `credentials`,
  обработка ошибок. Компоненты сами `fetch` не вызывают.
- **Ответ сервера тоже проверяется схемой.** Данные из сети считаются неизвестными,
  и в приложение попадают только данные правильного формата.
- Ошибка сети или сервера превращается в `ApiError` с понятным текстом на русском.

### interactions — TanStack Query (`messages.ts`)

```ts
export const messageKeys = { list: ['messages', 'list'] as const }

export function useMessagesQuery() {
  return useQuery({ queryKey: messageKeys.list, queryFn: fetchMessages })
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sendContactMessage,
    onSuccess: (message) => {
      queryClient.setQueryData<Message[]>(messageKeys.list, (current = []) => [...current, message])
    },
  })
}
```

- **`useQuery`** загружает данные и хранит их в кеше по ключу `['messages', 'list']`.
  Сам отслеживает состояния: `isPending` (загрузка), `error`, `data`.
- **`useMutation`** — изменение данных на сервере (создать, удалить).
- **Точечное обновление кеша:** после отправки новое сообщение добавляется в кеш через
  `setQueryData`, а не перезагружается весь список. После удаления оно убирается из кеша фильтром.
- `QueryClient` создаётся в `QueryProvider` через `useState(() => new QueryClient())`:
  один раз на вкладку, без пересоздания при каждой перерисовке.

### flows — сценарий экрана (`use-contact-flow.ts`)

```ts
export function useContactFlow() {
  const [form, setForm] = useState<ContactFormInput>(EMPTY_FORM)
  const messagesQuery = useMessagesQuery()
  const sendMutation = useSendMessageMutation()
  ...
  function submit() {
    sendMutation.mutate(form, { onSuccess: () => setForm(EMPTY_FORM) })
  }
  return { form, updateField, submit, fieldErrors, isSending, messages, removeMessage, ... }
}
```

Собирает для экрана всё сразу: поля формы, запрос списка, три мутации, ошибки и флаги
загрузки. Компоненты получают готовый объект `flow` и ничего не знают о Query и API.
Когда пользователь начинает исправлять поле, старые ошибки сбрасываются (`sendMutation.reset()`).

### components — только отображение

- `ContactForm`: поля описаны массивом и выводятся через `.map()`. `<label htmlFor>`
  связан с полем, `aria-invalid` и `aria-describedby` сообщают скринридеру об ошибке.
  `noValidate` отключает встроенную проверку браузера, чтобы тексты ошибок были из нашей схемы.
- `MessageList` показывает все состояния: **загрузка**, **ошибка с кнопкой «Повторить»**,
  **пустой список** и **сообщения**. Пока сообщение удаляется, его кнопка заблокирована.

### Сервер — Route Handlers

```ts
// app/api/messages/route.ts
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const result = acceptContactMessage(body)
  if (!result.ok) {
    return Response.json({ error: 'Форма заполнена с ошибками', fieldErrors: result.fieldErrors }, { status: 400 })
  }
  return Response.json(result.message, { status: 201 })
}
```

- Route Handler — серверная функция на стандартных `Request` и `Response`.
- Коды ответов: `201` — создано, `400` — ошибка данных, `404` — не найдено, `204` — удалено, без тела.
- `GET`, `DELETE` и `DELETE /[id]` обращаются к хранилищу напрямую: отдельный use-case
  был бы просто переименованием одного вызова, а скилл это запрещает.

---

## 8. Где какое состояние

| Состояние | Где хранится | Почему |
|---|---|---|
| Метрики мониторинга | на сервере, передаются через props | не меняются, им не нужен JavaScript в браузере |
| Сообщения | API + кеш TanStack Query | это данные сервера: нужны загрузка, ошибки, кеш и синхронизация |
| Текст в полях формы | локальный `useState` во flow | временное состояние интерфейса |
| Текущая страница | URL | переживает обновление, ссылкой можно поделиться |

---

## 9. Демонстрация (что показать вживую)

1. `npm install`, затем `npm run dev`, открыть http://localhost:3000.
2. Пощёлкать меню: адрес меняется, страница не перезагружается, активный пункт
   подчёркнут, у вкладки меняется заголовок.
3. «Контакты» → нажать «Отправить» на пустой форме: под полями появятся ошибки из схемы Zod.
4. Заполнить форму и отправить: появится «Сообщение отправлено», форма очистится,
   сообщение появится в списке со счётчиком.
5. **Нажать F5: сообщение осталось**, потому что оно хранится на сервере.
6. Удалить сообщение (✕), затем очистить все.
7. Открыть `/abc`: появится страница 404.
8. В DevTools → Network видно запросы к `/api/messages` и коды ответов.
9. Сузить окно: сетки перестраиваются, меню переносится.

---

## 10. Вопросы, которые могут задать, и ответы

**Что такое SPA, если Next.js рендерит страницы на сервере?**
Первая страница приходит готовым HTML, поэтому она быстро открывается и индексируется
поисковиками. Дальше приложение работает как SPA: `<Link>` переключает страницы без
перезагрузки, шапка и подвал остаются на месте, и состояние (кеш TanStack Query) сохраняется.

**Где здесь стейт-менеджер?**
TanStack Query — менеджер **серверного состояния**. Он хранит данные с сервера в общем
кеше, следит за загрузкой и ошибками, обновляет кеш после мутаций. Любой компонент,
вызвавший `useMessagesQuery()`, получит те же данные из кеша без повторного запроса.

**Почему не Redux или Zustand?**
По архитектуре проекта состояние разделено по назначению: данные сервера хранятся в
TanStack Query, временное состояние интерфейса — в `useState`, параметры — в URL.
Глобального клиентского состояния, которое не относится ни к одному из этих типов, в
проекте нет. Отдельный Redux дублировал бы то, что уже делает Query.

**Чем серверный компонент отличается от клиентского?**
Серверный выполняется на сервере, и его код в браузер не попадает. В нём нельзя
использовать `useState`, обработчики событий и браузерные API. Клиентский (с
`"use client"`) загружается в браузер и может быть интерактивным. Я помечаю клиентскими
только интерактивные части.

**Зачем проверять форму и в браузере, и на сервере?**
Проверка в браузере нужна для удобства: ошибки видны сразу. Проверка на сервере — для
безопасности: запрос можно отправить в обход формы, например через DevTools или curl.
Обе используют одну схему из `domain`.

**Зачем проверять ответ сервера схемой?**
Ответ внешнего API — это неизвестные данные. Если формат изменится, ошибка будет понятной
и случится в одном месте (`http-client.ts`), а не где-то в глубине компонента.

**Зачем `queryKey`?**
Это адрес данных в кеше. По нему мутации находят нужный список и обновляют его, а
разные компоненты получают одни и те же данные.

**Почему `setQueryData`, а не `invalidateQueries`?**
`invalidateQueries` перезапросил бы весь список с сервера. Сервер и так вернул созданное
сообщение, поэтому достаточно точечно добавить его в кеш, и лишнего запроса не будет.

**Сохранятся ли сообщения после перезапуска сервера?**
Нет. Они хранятся в памяти сервера (`message-repository.ts`), поэтому переживают F5,
но не перезапуск. В реальном проекте там была бы база данных, и поменялся бы только этот файл.

**Зачем TypeScript?**
Ошибки находятся до запуска. Например, если опечататься в имени поля формы или забыть
цвет для новой группы неисправностей, проект не соберётся.

**Как проверить качество кода?**
`npm run lint` (ESLint с правилами Next.js и React Hooks) и `npm run build` (сборка с
проверкой типов). Оба проходят без ошибок и предупреждений.

**Как опубликовать сайт?**
Проще всего на Vercel: подключить репозиторий, и сайт соберётся сам. GitHub Pages не
подойдёт, потому что он отдаёт только статические файлы, а здесь есть серверный API.

---

## 11. Итог

- **Лендинг:** главная с hero-блоком, метриками, диаграммами и призывом к действию;
  адаптивная вёрстка на Tailwind.
- **SPA и роутинг:** Next.js App Router, 4 страницы + 404, `<Link>` и общий `layout`.
- **Стейт-менеджер:** TanStack Query — кеш, загрузка, ошибки, мутации с точечным
  обновлением кеша.
- **Архитектура:** слои `app → components → flows → interactions → use-cases →
  infrastructure`, предметная логика в `domain` не зависит от UI.
- **Надёжность:** TypeScript, проверка Zod на клиенте, на сервере и для ответов API,
  все состояния экрана (загрузка, ошибка, пусто).
- **Git:** Vue-версия в `main`, React-версия в `react-nextjs`.
