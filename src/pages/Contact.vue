<template>
  <div class="max-w-6xl mx-auto px-6 py-12 space-y-8">
    <h1 class="text-4xl font-bold">Контакты</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Contact Form -->
      <section class="bg-white p-8 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-6">Отправить сообщение</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="contact-name" class="block text-gray-700 font-bold mb-2">Имя</label>
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
              required
            />
          </div>
          <div>
            <label for="contact-email" class="block text-gray-700 font-bold mb-2">Email</label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
              required
            />
          </div>
          <div>
            <label for="contact-message" class="block text-gray-700 font-bold mb-2">Сообщение</label>
            <textarea
              id="contact-message"
              v-model="form.message"
              rows="5"
              class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            Отправить
          </button>
        </form>
      </section>

      <!-- Info -->
      <section class="bg-white p-8 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-6">Информация</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-bold text-gray-700 mb-2">Компания</h3>
            <p class="text-gray-600">ПАО "Татнефть"</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-700 mb-2">Проект</h3>
            <p class="text-gray-600">Светофор УШГН - Система мониторинга скважин</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-700 mb-2">Статус</h3>
            <p class="text-gray-600">Опытно-промышленная эксплуатация</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-700 mb-2">Email</h3>
            <p class="text-gray-600">info@tatneft.ru</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Messages -->
    <section class="bg-white p-8 rounded-lg shadow" v-if="store.userMessages.length > 0">
      <h2 class="text-2xl font-bold mb-6">
        Полученные сообщения ({{ store.messageCount }})
      </h2>
      <div class="space-y-4">
        <div
          v-for="msg in store.userMessages"
          :key="msg.id"
          class="bg-gray-50 p-4 rounded border-l-4 border-blue-600"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-700"><strong>{{ msg.text }}</strong></p>
              <p class="text-sm text-gray-500 mt-2">{{ msg.timestamp }}</p>
            </div>
            <button
              type="button"
              @click="store.removeMessage(msg.id)"
              class="text-red-600 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
      <button
        type="button"
        @click="store.clearMessages"
        class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Очистить все сообщения
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLightStore } from '../stores/lightStore'

const store = useLightStore()
const form = ref({
  name: '',
  email: '',
  message: '',
})

const submitForm = () => {
  const message = `${form.value.name} (${form.value.email}): ${form.value.message}`
  store.addMessage(message)
  form.value = { name: '', email: '', message: '' }
}
</script>
