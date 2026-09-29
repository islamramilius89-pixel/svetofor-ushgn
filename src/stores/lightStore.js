import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLightStore = defineStore('light', () => {
  // State
  const wells = ref(2494)
  const wellsWithDeviations = ref(1570)
  const downtimeFound = ref(843)
  const targetCompleteness = ref(90)
  const currentCompleteness = ref(63.9)
  const userMessages = ref([])
  let nextMessageId = 1

  // Computed
  const completenessPercentage = computed(() => currentCompleteness.value)
  const messageCount = computed(() => userMessages.value.length)

  // Actions
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

  const clearMessages = () => {
    userMessages.value = []
  }

  return {
    wells,
    wellsWithDeviations,
    downtimeFound,
    targetCompleteness,
    currentCompleteness,
    userMessages,
    completenessPercentage,
    messageCount,
    addMessage,
    removeMessage,
    clearMessages,
  }
})
