<template>
  <div class="max-w-6xl mx-auto px-6 py-12 space-y-8">
    <h1 class="text-4xl font-bold">О проекте Светофор</h1>

    <section class="bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Описание</h2>
      <p class="text-gray-700 mb-4">
        Светофор УШГН — это инновационная система мониторинга и диагностики скважин, разработанная компанией Татнефть.
        Система анализирует параметры электротока для автоматического выявления отклонений в работе оборудования.
      </p>
      <p class="text-gray-700">
        На текущей стадии опытно-промышленной эксплуатации система успешно выявляет проблемные скважины и способствует
        оптимизации технического обслуживания и ремонтных работ.
      </p>
    </section>

    <section class="bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Этапы развития</h2>
      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">1</div>
          <div>
            <h3 class="font-bold">Основы NLP и предобработка</h3>
            <p class="text-gray-600">Разработка логического ядра системы</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">2</div>
          <div>
            <h3 class="font-bold">Опытно-промышленная эксплуатация</h3>
            <p class="text-gray-600">Тестирование на реальных скважинах (текущий этап)</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">3</div>
          <div>
            <h3 class="font-bold">Применение машинного обучения</h3>
            <p class="text-gray-600">Классификация типов отказов и оптимизация моделей</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Технические характеристики</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-bold mb-2">Методология:</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>Анализ электротока скважин</li>
            <li>Сравнение с эталонными значениями</li>
            <li>Выявление отклонений в реальном времени</li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold mb-2">Выход:</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>Ранжированный список проблемных скважин</li>
            <li>Степень отклонения от нормы</li>
            <li>Рекомендации по срочности проверки</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
