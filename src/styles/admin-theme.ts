/**
 * Admin Theme Configuration
 * Consistent styling system for admin pages matching frontend design
 */

export const adminTheme = {
  // Card styles
  card: {
    base: 'bg-white dark:bg-gray-dark rounded-md border border-gray-200 dark:border-gray-700 shadow-sm',
    hover: 'hover:shadow-md transition-shadow duration-200',
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }
  },

  // Input styles
  input: {
    base: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm',
    error: 'border-red-500 focus:ring-red-500',
  },

  // Button styles
  button: {
    primary: 'px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm hover:shadow-md',
    secondary: 'px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm',
    danger: 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md',
    ghost: 'px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors font-medium text-sm',
  },

  // Typography
  typography: {
    h1: 'text-2xl font-bold text-gray-900 dark:text-white',
    h2: 'text-xl font-bold text-gray-900 dark:text-white',
    h3: 'text-lg font-semibold text-gray-900 dark:text-white',
    h4: 'text-base font-semibold text-gray-900 dark:text-white',
    body: 'text-sm text-gray-700 dark:text-gray-300',
    caption: 'text-xs text-gray-600 dark:text-gray-400',
    label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
  },

  // Badge styles
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
    danger: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800',
    info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
  },

  // Table styles
  table: {
    wrapper: 'overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700',
    base: 'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
    header: 'bg-gray-50 dark:bg-gray-800',
    headerCell: 'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
    body: 'bg-white dark:bg-gray-dark divide-y divide-gray-200 dark:divide-gray-700',
    row: 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
    cell: 'px-4 py-3 text-sm text-gray-900 dark:text-white',
  },

  // Form styles
  form: {
    group: 'space-y-2',
    row: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    section: 'space-y-4',
  },

  // Layout
  layout: {
    container: 'max-w-7xl mx-auto',
    section: 'space-y-6',
    grid: {
      cols2: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
      cols3: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
      cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    }
  },

  // Status colors
  status: {
    draft: 'text-gray-600 dark:text-gray-400',
    published: 'text-green-600 dark:text-green-400',
    archived: 'text-red-600 dark:text-red-400',
  },
}

// Helper function to combine classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
