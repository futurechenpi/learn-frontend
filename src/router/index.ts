import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { reportVisit } from '@/api/user'
import { checkAdmin } from '@/api/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: { title: '注册' }
    },
    {
      path: '/learn',
      name: 'learn',
      component: () => import('@/views/Learn.vue'),
      meta: { title: '学习中心', requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/learn/html'
        },
        {
          path: 'html',
          name: 'learn-html',
          component: () => import('@/views/learn/HTML.vue'),
          meta: { title: 'HTML学习' }
        },
        {
          path: 'css',
          name: 'learn-css',
          component: () => import('@/views/learn/CSS.vue'),
          meta: { title: 'CSS学习' }
        },
        {
          path: 'javascript',
          name: 'learn-javascript',
          component: () => import('@/views/learn/JavaScript.vue'),
          meta: { title: 'JavaScript学习' }
        },
        {
          path: 'vue3',
          name: 'learn-vue3',
          component: () => import('@/views/learn/Vue3.vue'),
          meta: { title: 'Vue3学习' }
        },
        {
          path: 'react',
          name: 'learn-react',
          component: () => import('@/views/learn/React.vue'),
          meta: { title: 'React学习' }
        },
        {
          path: 'typescript',
          name: 'learn-typescript',
          component: () => import('@/views/learn/TypeScript.vue'),
          meta: { title: 'TypeScript学习' }
        },
        {
          path: 'tailwindcss',
          name: 'learn-tailwindcss',
          component: () => import('@/views/learn/TailwindCSS.vue'),
          meta: { title: 'TailwindCSS学习' }
        },
        {
          path: 'ai-exercise/:course',
          name: 'ai-exercise',
          component: () => import('@/views/learn/AIExercise.vue'),
          meta: { title: 'AI出题练习' }
        }
      ]
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
      meta: { title: '个人资料', requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/Admin.vue'),
      meta: { title: '后台管理', requiresAuth: true }
    },
    {
      path: '/exercise-html/:step',
      name: 'exercise-html',
      component: () => import('@/views/ExerciseHTML.vue'),
      meta: { title: 'HTML 实战练习', requiresAuth: true }
    },
    {
      path: '/exercise-css/:step',
      name: 'exercise-css',
      component: () => import('@/views/ExerciseCSS.vue'),
      meta: { title: 'CSS 实战练习', requiresAuth: true }
    },
    {
      path: '/exercise-js/:step',
      name: 'exercise-js',
      component: () => import('@/views/ExerciseJS.vue'),
      meta: { title: 'JavaScript 实战练习', requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'my-favorites',
      component: () => import('@/views/MyFavorites.vue'),
      meta: { title: '我的收藏', requiresAuth: true }
    },
    {
      path: '/notes',
      name: 'my-notes',
      component: () => import('@/views/MyNotes.vue'),
      meta: { title: '我的笔记', requiresAuth: true }
    },
    {
      path: '/wrong-questions',
      name: 'wrong-questions',
      component: () => import('@/views/WrongQuestions.vue'),
      meta: { title: '错题本', requiresAuth: true }
    },
    {
      path: '/wrong-question-practice',
      name: 'wrong-question-practice',
      component: () => import('@/views/WrongQuestionPractice.vue'),
      meta: { title: '错题重做', requiresAuth: true }
    },
    {
      path: '/mastered',
      name: 'mastered-questions',
      component: () => import('@/views/MasteredQuestions.vue'),
      meta: { title: '已掌握的题', requiresAuth: true }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchResults.vue'),
      meta: { title: '搜索' }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 前端学习网站`
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
    return
  }
  
  // 如果已登录且访问登录/注册页面，重定向到首页
  if ((to.name === 'login' || to.name === 'register') && userStore.isLoggedIn) {
    next('/')
    return
  }
  
  // 访问后台管理页时，调用后端校验是否为ADMIN及以上
  if (to.name === 'admin') {
    if (!userStore.isLoggedIn) {
      next('/login')
      return
    }
    checkAdmin()
      .then((res) => {
        if (res.data?.hasPermission) {
          next()
        } else {
          next('/learn')
        }
      })
      .catch(() => {
        next('/learn')
      })
    return
  }

  next()
})

// 访问上报：在每次成功切换后上报路由name
router.afterEach((to) => {
  if (to.name) {
    try {
      reportVisit(String(to.name))
    } catch (e) {
      // 静默失败
    }
  }
})

export default router

