export interface AdminProfile {
  id: string
  username: string
  name: string
  role: string
  phone?: string
  avatar_url?: string
}

export const useAdminAuth = () => {
  const router = useRouter()
  const route = useRoute()
  
  // Cookie for SSR & persistence
  const authCookie = useCookie<string | null>('spu_admin_auth', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  const userCookie = useCookie<AdminProfile | null>('spu_admin_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  // Shared state across components
  const isAuthenticated = useState<boolean>('spu_is_admin_authenticated', () => {
    return Boolean(authCookie.value === 'true')
  })

  const adminProfile = useState<AdminProfile | null>('spu_admin_profile', () => {
    return userCookie.value || (isAuthenticated.value ? {
      id: 'admin-01',
      username: 'admin',
      name: 'Praew Suksom',
      role: 'Operations Director'
    } : null)
  })

  const isLoginModalOpen = useState<boolean>('spu_admin_login_modal_open', () => false)
  const loginRedirectUrl = useState<string>('spu_admin_login_redirect_url', () => '/admin')
  const loginPromptReason = useState<string>('spu_admin_login_prompt_reason', () => 'เข้าสู่ระบบผู้ดูแลระบบ (Admin Portal)')
  const loginErrorMsg = useState<string>('spu_admin_login_error', () => '')

  // Sync with client-side localStorage on mount
  const checkAuth = () => {
    if (import.meta.client) {
      const local = localStorage.getItem('spu_admin_auth')
      if (local === 'true' || authCookie.value === 'true') {
        isAuthenticated.value = true
        authCookie.value = 'true'
        
        try {
          const storedUser = localStorage.getItem('spu_admin_user')
          if (storedUser) {
            adminProfile.value = JSON.parse(storedUser)
            userCookie.value = adminProfile.value
          }
        } catch {
          // ignore
        }

        if (!adminProfile.value) {
          adminProfile.value = {
            id: 'admin-01',
            username: 'admin',
            name: 'Praew Suksom',
            role: 'Operations Director'
          }
        }
      } else {
        isAuthenticated.value = false
        adminProfile.value = null
      }
    }
  }

  const openLoginModal = (redirectUrl: string = '/admin', reason: string = 'เข้าสู่ระบบผู้ดูแลระบบ (Admin Portal)') => {
    loginRedirectUrl.value = redirectUrl
    loginPromptReason.value = reason
    loginErrorMsg.value = ''
    isLoginModalOpen.value = true
  }

  const closeLoginModal = () => {
    isLoginModalOpen.value = false
    loginErrorMsg.value = ''
  }

  const login = async (usernameOrPassword: string, maybePassword?: string): Promise<{ success: boolean; message?: string }> => {
    loginErrorMsg.value = ''
    let payload: { username?: string; password?: string } = {}
    if (maybePassword !== undefined) {
      payload = { username: usernameOrPassword, password: maybePassword }
    } else {
      payload = { password: usernameOrPassword }
    }

    try {
      const res = await $fetch<any>('/api/admin/auth', {
        method: 'POST',
        body: payload
      })

      if (res && res.success) {
        isAuthenticated.value = true
        authCookie.value = 'true'
        adminProfile.value = res.user
        userCookie.value = res.user
        
        if (import.meta.client) {
          localStorage.setItem('spu_admin_auth', 'true')
          localStorage.setItem('spu_admin_user', JSON.stringify(res.user))
          localStorage.setItem('spu_admin_login_time', Date.now().toString())
        }

        isLoginModalOpen.value = false

        // Navigate to target if specified and not currently there
        if (loginRedirectUrl.value && route.fullPath !== loginRedirectUrl.value) {
          router.push(loginRedirectUrl.value)
        }

        return { success: true, message: res.message }
      }
      return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
      loginErrorMsg.value = msg
      return { success: false, message: msg }
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    authCookie.value = null
    userCookie.value = null
    adminProfile.value = null

    if (import.meta.client) {
      localStorage.removeItem('spu_admin_auth')
      localStorage.removeItem('spu_admin_user')
      localStorage.removeItem('spu_admin_login_time')
    }

    if (route.path.startsWith('/admin')) {
      router.push('/')
    }
  }

  return {
    isAdmin: isAuthenticated,
    adminProfile,
    isLoginModalOpen,
    loginRedirectUrl,
    loginPromptReason,
    loginErrorMsg,
    checkAuth,
    openLoginModal,
    closeLoginModal,
    login,
    logout
  }
}
