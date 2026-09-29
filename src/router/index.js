import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Results from '../pages/Results.vue'
import Contact from '../pages/Contact.vue'

const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/about', component: About, name: 'about' },
  { path: '/results', component: Results, name: 'results' },
  { path: '/contact', component: Contact, name: 'contact' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
