import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Pinia
import { createPinia } from 'pinia'

// Vue Router
import router from './router'
import App from './App.vue'

// Icons
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#0B0F19',
          surface: '#111827',
          'surface-variant': '#1F2937',
          primary: '#6366F1',
          'primary-darken-1': '#4F46E5',
          secondary: '#06B6D4',
          accent: '#F59E0B',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      light: {
        dark: false,
        colors: {
          background: '#F8FAFC',
          surface: '#FFFFFF',
          'surface-variant': '#F1F5F9',
          primary: '#4F46E5',
          'primary-darken-1': '#4338CA',
          secondary: '#0891B2',
          accent: '#D97706',
          success: '#059669',
          warning: '#D97706',
          error: '#DC2626',
          info: '#2563EB',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
