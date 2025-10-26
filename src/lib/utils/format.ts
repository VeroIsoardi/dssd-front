/**
 * Formats a date string to a localized format
 */
export function formatDate(dateString: string, locale: string = 'es-ES'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Status configuration for projects
 */
export const PROJECT_STATUS_CONFIG = {
  draft: {
    label: 'Borrador',
    className: 'bg-gray-100 text-gray-800'
  },
  active: {
    label: 'Activo',
    className: 'bg-green-100 text-green-800'
  },
  completed: {
    label: 'Completado',
    className: 'bg-blue-100 text-blue-800'
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800'
  }
} as const

export type ProjectStatusKey = keyof typeof PROJECT_STATUS_CONFIG

/**
 * Gets status badge configuration
 */
export function getProjectStatus(status: string) {
  return PROJECT_STATUS_CONFIG[status as ProjectStatusKey] || PROJECT_STATUS_CONFIG.draft
}

