import { router } from './main'

export const navigationService = {
 goToLogin: () => router.navigate({ to: '/login' }),
 goToUnauthorized: () => router.navigate({ to: '/unauthorized' })
}