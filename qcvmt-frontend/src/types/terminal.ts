export type SignalStatus = 'green' | 'red'

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
}

export interface TerminalView {
  bayName: string
  vesselName: string
  voyage: string
  qcAct: string
  reful: string
  serverDateTime: string
  cells: BayCell[]
  sequences: SequenceVO[]
}

export interface PollingState {
  intervalMs: number
  timeoutCount: number
  running: boolean
}
