// Form configuration constants
export const FORM_CONFIG = {
  STEPS: {
    1: { title: "Paso 1", subtitle: "Datos Generales" },
    2: { title: "Paso 2", subtitle: "Plan de Trabajo" },
  } as const,

  VALIDATION: {
    MIN_TASKS: 1,
    MAX_TASKS: 20,
    MIN_PROJECT_NAME_LENGTH: 1,
    MIN_DESCRIPTION_LENGTH: 1,
  },

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
} as const

// API configuration
export const API_CONFIG = {
  BASE_URL: 'https://635ef33402f94fb3183e89424006b93b.loophole.site/api/v1',
  ENDPOINTS: {
    PROJECTS: '/projects',
    COUNTRIES: 'https://restcountries.com/v3.1/all?fields=name,cca2,translations',
  },
  TIMEOUT: 30000, // 30 seconds
} as const

// UI Messages
export const MESSAGES = {
  SUCCESS: {
    PROJECT_CREATED: '¡Proyecto creado exitosamente!',
    PROJECT_UPDATED: '¡Proyecto actualizado exitosamente!',
    PROJECT_DELETED: '¡Proyecto eliminado exitosamente!',
  },
  
  ERROR: {
    PROJECT_CREATE_FAILED: 'Error al crear el proyecto',
    PROJECT_UPDATE_FAILED: 'Error al actualizar el proyecto',
    PROJECT_DELETE_FAILED: 'Error al eliminar el proyecto',
    PROJECT_FETCH_FAILED: 'Error al obtener los proyectos',
    NETWORK_ERROR: 'No se pudo conectar con el servidor. Verifique su conexión a internet.',
    UNEXPECTED_ERROR: 'Ocurrió un error inesperado. Inténtelo nuevamente.',
    COUNTRIES_FETCH_FAILED: 'Error al obtener la lista de países',
  },
  
  PLACEHOLDERS: {
    ONG_NAME: 'Ingrese el nombre de la ONG',
    ONG_MAIL: 'Ingrese el email de la ONG',
    PROJECT_NAME: 'Ingrese el nombre del proyecto',
    PROJECT_DESCRIPTION: 'Describe los objetivos y alcance del proyecto',
    TASK_NAME: 'Nombre de la tarea',
    TASK_DESCRIPTION: 'Descripción de la tarea',
    SELECT_COUNTRY: 'Seleccione un país',
    SELECT_START_DATE: 'Seleccionar fecha de inicio',
    SELECT_END_DATE: 'Seleccionar fecha de fin',
  },
} as const

// Project status configuration
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS]