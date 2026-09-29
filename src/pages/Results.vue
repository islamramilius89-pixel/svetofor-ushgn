<template>
  <div class="max-w-6xl mx-auto px-6 py-12 space-y-8">
    <h1 class="text-4xl font-bold">Результаты ОПИ</h1>

    <!-- Progress -->
    <section class="bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6">Прогресс полноты обнаружения</h2>
      <div class="space-y-4">
        <div>
          <div class="flex justify-between mb-2">
            <span>Текущая полнота</span>
            <span class="font-bold">63.9%</span>
          </div>
          <div class="w-full bg-gray-200 rounded h-4">
            <div class="bg-yellow-500 h-4 rounded" style="width: 63.9%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between mb-2">
            <span>Целевая полнота</span>
            <span class="font-bold">≥ 90%</span>
          </div>
          <div class="w-full bg-gray-200 rounded h-4">
            <div class="bg-green-600 h-4 rounded" style="width: 90%"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics -->
    <section class="bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6">Статистика обходов</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border-l-4 border-blue-600 pl-4">
          <h3 class="font-bold text-gray-700">Наземный привод</h3>
          <p class="text-3xl font-bold text-blue-600 mt-2">398</p>
          <p class="text-gray-600">выявленных неисправностей</p>
        </div>
        <div class="border-l-4 border-purple-600 pl-4">
          <h3 class="font-bold text-gray-700">ГНО и технология</h3>
          <p class="text-3xl font-bold text-purple-600 mt-2">445</p>
          <p class="text-gray-600">выявленных проблем</p>
        </div>
      </div>
    </section>

    <!-- Insights -->
    <section class="bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6">Ключевые находки</h2>
      <div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded border-l-4 border-blue-600">
          <h3 class="font-bold text-blue-900">Охват фонда</h3>
          <p class="text-gray-700">1 570 из 2 494 скважин (63%) имели отклонения, выявленные системой</p>
        </div>
        <div class="bg-yellow-50 p-4 rounded border-l-4 border-yellow-600">
          <h3 class="font-bold text-yellow-900">Ложные срабатывания</h3>
          <p class="text-gray-700">11.4% эпизодов не подтвердились при физической проверке</p>
        </div>
        <div class="bg-green-50 p-4 rounded border-l-4 border-green-600">
          <h3 class="font-bold text-green-900">Эффективность</h3>
          <p class="text-gray-700">Рост полноты обнаружения с 61.7% до 63.9% после корректировки эталонов</p>
        </div>
      </div>
    </section>

    <!-- Roadmap -->
    <section class="bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6">Дорожная карта развития</h2>
      <div class="space-y-4">
        <div class="flex gap-4">
          <div class="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">1</div>
          <div>
            <h3 class="font-bold">Сентябрь: Корректировка эталонов</h3>
            <p class="text-gray-600">Ручная корректировка ~1100 скважин для снижения ложных срабатываний</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="bg-yellow-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">2</div>
          <div>
            <h3 class="font-bold">Октябрь: Разделение сигналов</h3>
            <p class="text-gray-600">Классификация отклонений по типам неисправностей</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">3</div>
          <div>
            <h3 class="font-bold">Далее: ML и оптимизация</h3>
            <p class="text-gray-600">Применение машинного обучения для автоматической классификации</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
