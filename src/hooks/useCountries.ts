import { useState, useEffect } from "react"
import { Country, CountryOption } from "@/types/project"
import { API_CONFIG } from "@/lib/constants"

const FALLBACK_COUNTRIES = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "uy", label: "Uruguay" },
  { value: "es", label: "España" },
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "pe", label: "Perú" },
]

export function useCountries() {
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(API_CONFIG.ENDPOINTS.COUNTRIES)
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries')
        }
        
        const data: Country[] = await response.json()
        
        const formattedCountries = data
          .map(country => ({
            value: country.cca2.toLowerCase(),
            label: country.translations?.spa?.common || country.name.common
          }))
          .sort((a, b) => a.label.localeCompare(b.label, 'es'))
        
        setCountries(formattedCountries)
      } catch (error) {
        console.error('Error fetching countries:', error)
        setCountries(FALLBACK_COUNTRIES)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountries()
  }, [])

  return { countries, isLoading }
}