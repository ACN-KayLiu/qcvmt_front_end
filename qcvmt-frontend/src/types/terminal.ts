export type SignalStatus = 'green' | 'red'
export type BayCellStatus =
  | 'inactive'
  | 'empty'
  | 'discharge'
  | 'load'
  | 'complexunit'
  | 'twenty'
  | 'refuel'

export interface SequenceVO {
  id: string
  bay: string
  row: string
  tier: string
  type: 'inactive' | 'unable' | 'empty' | 'discharge' | 'load' | 'complexunit' | 'twenty' | 'refuel'
  isDg?: boolean
  isCurrent?: boolean
  text?: string
}

export interface BayCell {
  row: string
  tier: string
  active: boolean
  status: BayCellStatus
  text: string
  dg: boolean
  rowHighlighted: boolean
}

export interface TerminalView {
  bayName: string
  vesselName: string
  voyage: string
  qcAct: string
  reful: string
  serverDateTime: string
  cells: BayCell[]
  sequences?: SequenceVO[]
  remainingContainers: number
  colors: Partial<Record<BayCellStatus, string>>
}

export interface PollingState {
  intervalMs: number
  timeoutCount: number
  running: boolean
}
