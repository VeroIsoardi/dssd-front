import { fetchWithAuth } from '@/lib/api-client'
import { KPIData } from '@/types/kpi'
import { API_CONFIG } from '@/lib/constants'

export class KPIApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'KPIApiError'
  }
}

/**
 * Fetch KPI data from the API
 */
export async function getKPIs(): Promise<KPIData> {
  try {
    const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}/kpis`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new KPIApiError('Endpoint de KPIs no encontrado', 404)
      }
      throw new KPIApiError(`Error al obtener KPIs: ${response.statusText}`, response.status)
    }

    const data = await response.json()
    return data as KPIData
  } catch (error) {
    if (error instanceof KPIApiError) {
      throw error
    }
    throw new KPIApiError('Error de red al obtener KPIs')
  }
}
