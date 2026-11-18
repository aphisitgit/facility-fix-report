import { ref, onMounted } from 'vue'

const isSidebarOpen = ref(true)
const isInitialized = ref(false)

export function useAdminSidebar() {
  function initSidebar() {
    if (typeof window !== 'undefined' && !isInitialized.value) {
      // Default open on Desktop (>= 1024px), closed on Mobile/Tablet (< 1024px)
      isSidebarOpen.value = window.innerWidth >= 1024
      isInitialized.value = true
    }
  }

  function toggle() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function open() {
    isSidebarOpen.value = true
  }

  function close() {
    isSidebarOpen.value = false
  }

  return {
    isSidebarOpen,
    initSidebar,
    toggle,
    open,
    close
  }
}

