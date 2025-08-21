import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/MainPage.vue'),
    },
    {
      path: '/gallery/:name',
      name: 'gallery',
      component: () => import('@/pages/GalleryPage.vue'),
    },
    {
      path: '/menu/:name',
      name: 'menu',
      component: () => import('@/pages/SubMenuPage.vue'),
    },
  ],
})

export default router
