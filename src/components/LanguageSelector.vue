<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
      aria-expanded="false"
      aria-haspopup="true"
    >
      <img 
        :src="currentLanguageFlag" 
        :alt="currentLanguageName"
        class="mr-2 h-4 w-5 object-cover rounded-sm"
      />
      <span class="mr-1">{{ currentLanguageName }}</span>
      <svg
        class="h-4 w-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      v-show="isOpen"
      class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
    >
      <div class="py-1" role="none">
        <a
          v-for="language in languages"
          :key="language.code"
          :href="getLanguageUrl(language.code)"
          class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          :class="{ 'bg-gray-50 text-primary': language.code === currentLanguage }"
          role="menuitem"
        >
          <img 
            :src="language.flag" 
            :alt="language.name"
            class="mr-3 h-4 w-5 object-cover rounded-sm"
          />
          <span>{{ language.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  currentPath?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentPath: '/'
})

const isOpen = ref(false)
const currentLanguage = ref('en')

const languages = [
  { code: 'en', name: 'English', flag: '/flag-gb.svg' },
  { code: 'sv', name: 'Svenska', flag: '/flag-sv.svg' },
]

const currentLanguageData = computed(() => {
  return languages.find(lang => lang.code === currentLanguage.value) || languages[0]
})

const currentLanguageFlag = computed(() => currentLanguageData.value.flag)
const currentLanguageName = computed(() => currentLanguageData.value.name)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}


const getLanguageUrl = (langCode: string) => {
  // Use the current path from props to ensure server/client consistency
  let currentPath = props.currentPath
  
  // If client-side, get current path from window
  if (typeof window !== 'undefined') {
    const currentUrl = new URL(window.location.href)
    currentPath = currentUrl.pathname
  }
  
  const pathSegments = currentPath.split('/').filter(segment => segment)
  
  // Remove current language from path if it exists
  const languages = ['en', 'sv']
  if (pathSegments.length > 0 && languages.includes(pathSegments[0])) {
    pathSegments.shift()
  }
  
  // Reconstruct path
  const remainingPath = pathSegments.join('/')
  
  // For English (default), don't add language prefix
  if (langCode === 'en') {
    const path = remainingPath ? `/${remainingPath}` : '/'
    // Add hash only if we're on client side
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    return path + hash
  }
  
  // For other languages, add language prefix
  const path = remainingPath ? `/${langCode}/${remainingPath}` : `/${langCode}/`
  // Add hash only if we're on client side
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  return path + hash
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

// Detect current language from URL
const detectCurrentLanguage = () => {
  if (typeof window === 'undefined') return
  
  const pathSegments = window.location.pathname.split('/').filter(segment => segment)
  const possibleLang = pathSegments[0]
  const languages = ['en', 'sv']
  
  if (languages.includes(possibleLang)) {
    currentLanguage.value = possibleLang
  } else {
    currentLanguage.value = 'en'
  }
}

// Detect browser language preference
const detectBrowserLanguage = () => {
  if (typeof window === 'undefined') return 'en'
  
  const browserLang = navigator.language.slice(0, 2)
  const supportedLanguages = ['en', 'sv']
  
  return supportedLanguages.includes(browserLang) ? browserLang : 'en'
}

onMounted(() => {
  detectCurrentLanguage()
  document.addEventListener('click', handleClickOutside)
  
  // If on homepage and no language detected, check browser preference
  if (window.location.pathname === '/' && currentLanguage.value === 'en') {
    const preferredLang = detectBrowserLanguage()
    if (preferredLang !== 'en') {
      // Check if user has already been redirected (to avoid infinite redirects)
      const hasBeenRedirected = sessionStorage.getItem('language-detected')
      if (!hasBeenRedirected) {
        sessionStorage.setItem('language-detected', 'true')
        window.location.href = `/${preferredLang}/`
      }
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>