export default defineNuxtRouteMiddleware((to, from) => {
  // Only guard routes under /admin (exclude dedicated staff registration page)
  if (to.path.startsWith('/admin') && to.path !== '/admin/register') {
    const authCookie = useCookie('spu_admin_auth')
    
    let isAuthed = authCookie.value === 'true'
    
    if (import.meta.client && !isAuthed) {
      isAuthed = localStorage.getItem('spu_admin_auth') === 'true'
      if (isAuthed) {
        authCookie.value = 'true'
      }
    }

    if (!isAuthed) {
      // Intercept and redirect to home with prompt
      return navigateTo({
        path: '/',
        query: {
          login: 'admin',
          redirect: to.fullPath
        }
      })
    }
  }
})
