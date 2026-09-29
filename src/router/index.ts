import { createRouter, createWebHistory } from 'vue-router'

const homeViewPath: string = '../views/HomeView.vue'
const catalogViewPath: string = '../views/CatalogView.vue'
const productDetailViewPath: string = '../views/ProductDetailView.vue'
const wishlistViewPath: string = '../views/WishlistView.vue'
const cartViewPath: string = '../views/CartView.vue'
const checkoutViewPath: string = '../views/CheckoutView.vue'
const aboutViewPath: string = '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(homeViewPath),
    },
    {
      path: '/products',
      name: 'catalog',
      component: () => import(catalogViewPath),
    },
    {
      path: '/categories/:categoryId',
      name: 'category',
      component: () => import(catalogViewPath),
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import(productDetailViewPath),
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import(wishlistViewPath),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import(cartViewPath),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import(checkoutViewPath),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(aboutViewPath),
    },
  ],
})

export default router
