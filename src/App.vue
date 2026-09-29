<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Navigation -->
    <nav class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl sticky top-0 z-50">
      <div class="px-6 py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <router-link to="/" class="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition">
            🚨 Светофор УШГН
          </router-link>
          <ul class="flex flex-wrap gap-4 md:gap-8 items-center">
            <li><router-link to="/" class="hover:text-blue-200 transition font-medium">Главная</router-link></li>
            <li><router-link to="/about" class="hover:text-blue-200 transition font-medium">О проекте</router-link></li>
            <li><router-link to="/results" class="hover:text-blue-200 transition font-medium">Результаты</router-link></li>
            <li><router-link to="/contact" class="hover:text-blue-200 transition font-medium">Контакты</router-link></li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="w-full flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-16">
      <div class="px-6 py-4 text-center">
        <p class="text-gray-300">© 2026 Светофор УШГН - Система мониторинга скважин Татнефть</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
nav a.router-link-exact-active:not(:first-child) {
  text-decoration: underline;
  text-underline-offset: 6px;
}
</style>
