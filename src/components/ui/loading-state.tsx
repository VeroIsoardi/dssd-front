import { Spinner } from './spinner'

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = 'Cargando...', className }: LoadingStateProps) {
  return (
    <div className={`text-center py-8 ${className || ''}`}>
      <Spinner size="md" />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  )
}

