export interface KPIData {
  finishedCases: number
  ongoingCases: number
  totalCases: number
  unTakenTasks: number
  pendingTasks: number
  finishedTasks: number
  topCountries: Array<{ country: string; count: string | number }>
}
