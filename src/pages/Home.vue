<template>
  <div class="w-full space-y-16 pb-16">
    <!-- Hero Section -->
    <section class="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-32">
      <div class="px-12 sm:px-16 md:px-20">
        <div class="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
          <h1 class="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg">🚨 Светофор УШГН</h1>
          <p class="text-2xl md:text-3xl mb-6 opacity-95 font-semibold">Инновационная система мониторинга и диагностики скважин</p>
          <p class="text-lg md:text-xl opacity-90 mb-8 max-w-3xl">Автоматическое выявление отклонений в работе оборудования</p>
          <div class="flex gap-4 justify-center flex-wrap">
            <router-link to="/about" class="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition text-lg">Узнать больше</router-link>
            <router-link to="/contact" class="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition text-lg">Контакты</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Metrics -->
    <section class="w-full px-12 sm:px-16 md:px-20">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">📊 Ключевые метрики</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border-l-4 border-blue-600 hover:scale-105 duration-300 text-center">
            <div class="text-5xl font-bold text-blue-600 mb-2">{{ store.wells }}</div>
            <p class="text-gray-700 font-medium">скважин в мониторинге</p>
            <p class="text-sm text-gray-600 mt-2">📍 Все НГДУ Татнефти</p>
          </div>
          
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border-l-4 border-yellow-500 hover:scale-105 duration-300 text-center">
            <div class="text-5xl font-bold text-yellow-600 mb-2">{{ store.wellsWithDeviations }}</div>
            <p class="text-gray-700 font-medium">выявлено отклонений</p>
            <p class="text-sm text-gray-600 mt-2">{{ deviationShare }}% от общего фонда</p>
          </div>
          
          <div class="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border-l-4 border-red-600 hover:scale-105 duration-300 text-center">
            <div class="text-5xl font-bold text-red-600 mb-2">{{ store.downtimeFound }}</div>
            <p class="text-gray-700 font-medium">простоев обнаружено</p>
            <p class="text-sm text-gray-600 mt-2">398 привод + 445 ГНО</p>
          </div>
          
          <div class="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border-l-4 border-green-600 hover:scale-105 duration-300 text-center">
            <div class="text-5xl font-bold text-green-600 mb-2">{{ store.currentCompleteness }}%</div>
            <p class="text-gray-700 font-medium">текущая полнота</p>
            <p class="text-sm text-gray-600 mt-2">Цель: ≥ 90%</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Progress Chart -->
    <section class="w-full px-12 sm:px-16 md:px-20 bg-gray-50 py-16">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">📈 Прогресс полноты обнаружения</h2>
        <div class="bg-white p-8 rounded-2xl shadow-xl">
          <div class="space-y-8">
            <div>
              <div class="flex justify-between mb-3">
                <span class="font-bold text-gray-700 text-lg">Полнота после корректировки эталонов</span>
                <span class="font-bold text-blue-600 text-lg">{{ store.currentCompleteness }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-6">
                <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 h-6 rounded-full transition-all duration-500" :style="{ width: store.currentCompleteness + '%' }"></div>
              </div>
              <p class="text-center text-gray-600 mt-3">Было: 61.7% → Стало: 63.9% (+2.2%)</p>
            </div>
            
            <div>
              <div class="flex justify-between mb-3">
                <span class="font-bold text-gray-700 text-lg">Целевой ориентир</span>
                <span class="font-bold text-green-600 text-lg">≥ {{ store.targetCompleteness }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-6">
                <div class="bg-gradient-to-r from-green-400 to-green-600 h-6 rounded-full" :style="{ width: store.targetCompleteness + '%' }"></div>
              </div>
              <p class="text-center text-gray-600 mt-3">Ожидается достигнуть к концу октября 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Breakdown Chart -->
    <section class="w-full px-12 sm:px-16 md:px-20">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">🔧 Типы выявленных неисправностей</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-xl">
            <h3 class="text-2xl font-bold mb-8 text-center text-gray-800">Распределение по типам</h3>
            <div class="space-y-6">
              <div class="flex flex-col items-center">
                <span class="font-bold text-blue-600 mb-2 text-lg">Наземный привод</span>
                <div class="w-full bg-gray-200 rounded-full h-4">
                  <div class="bg-blue-600 h-4 rounded-full" style="width: 47%"></div>
                </div>
                <span class="font-bold text-gray-800 mt-2">398 (47%)</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="font-bold text-purple-600 mb-2 text-lg">ГНО и технология</span>
                <div class="w-full bg-gray-200 rounded-full h-4">
                  <div class="bg-purple-600 h-4 rounded-full" style="width: 53%"></div>
                </div>
                <span class="font-bold text-gray-800 mt-2">445 (53%)</span>
              </div>
            </div>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-xl">
            <h3 class="text-2xl font-bold mb-8 text-center text-gray-800">Эффективность по типам</h3>
            <div class="space-y-4">
              <div class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-600 text-center">
                <p class="font-bold text-blue-800 mb-2">Механика привода</p>
                <p class="text-3xl font-bold text-blue-600">78.3%</p>
                <p class="text-sm text-gray-700 mt-2">Хорошо обнаруживается</p>
              </div>
              <div class="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-l-4 border-orange-600 text-center">
                <p class="font-bold text-orange-800 mb-2">Скважинное оборудование</p>
                <p class="text-3xl font-bold text-orange-600">48.1%</p>
                <p class="text-sm text-gray-700 mt-2">Требует доработки</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics by NGDU -->
    <section class="w-full px-12 sm:px-16 md:px-20 bg-gray-50 py-16">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">🗺️ Охват по НГДУ (%)</h2>
        <div class="bg-white p-8 rounded-2xl shadow-xl">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(percent, ngdu) in ngduData" :key="ngdu" class="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <p class="font-bold text-gray-800 mb-4 text-lg">{{ ngdu }}</p>
              <div class="w-20 h-40 bg-gray-300 rounded-lg flex items-end overflow-hidden">
                <div class="w-full rounded-lg" :style="{ height: percent + '%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)' }"></div>
              </div>
              <div class="mt-3 font-bold text-2xl text-gray-800">{{ percent }}%</div>
            </div>
          </div>
          <p class="text-center text-gray-600 mt-8 text-base">Разброс небольшой (54-69%), дело не в конкретном цехе, а в самом пороге</p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="w-full px-12 sm:px-16 md:px-20">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">✨ Возможности системы</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition group hover:scale-105 duration-300 text-center">
            <div class="text-6xl mb-4 group-hover:scale-125 transition duration-300">📊</div>
            <h3 class="text-2xl font-bold mb-3 text-gray-800">Мониторинг в реальном времени</h3>
            <p class="text-gray-600 leading-relaxed">Анализ электротока и выявление аномалий в работе оборудования скважин</p>
          </div>
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition group hover:scale-105 duration-300 text-center">
            <div class="text-6xl mb-4 group-hover:scale-125 transition duration-300">🎯</div>
            <h3 class="text-2xl font-bold mb-3 text-gray-800">Точная диагностика</h3>
            <p class="text-gray-600 leading-relaxed">Разделение сигналов по типам неисправностей: наземный привод vs ГНО</p>
          </div>
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition group hover:scale-105 duration-300 text-center">
            <div class="text-6xl mb-4 group-hover:scale-125 transition duration-300">⚡</div>
            <h3 class="text-2xl font-bold mb-3 text-gray-800">Оптимизация процессов</h3>
            <p class="text-gray-600 leading-relaxed">Снижение внеплановых простоев и затрат на аварийный ремонт</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="w-full px-12 sm:px-16 md:px-20">
      <div class="max-w-6xl mx-auto">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-12 rounded-2xl shadow-2xl text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Готовы узнать больше?</h2>
          <p class="text-lg mb-8 opacity-90 max-w-2xl mx-auto">Изучите результаты опытно-промышленной эксплуатации и технологию</p>
          <div class="flex gap-4 justify-center flex-wrap">
            <router-link to="/about" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition">О проекте</router-link>
            <router-link to="/results" class="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition">Результаты</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLightStore } from '../stores/lightStore'

const store = useLightStore()

const deviationShare = computed(() =>
  Math.round((store.wellsWithDeviations / store.wells) * 100)
)

const ngduData = {
  'НГДУ №1': 67,
  'НГДУ №2': 63,
  'НГДУ №3': 69,
  'НГДУ №4': 65,
  'НГДУ №5': 54,
  'НГДУ №6': 62,
}
</script>