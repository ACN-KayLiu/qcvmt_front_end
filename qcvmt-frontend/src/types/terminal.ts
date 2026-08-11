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

export interface TerminalView {
  bayName: string
  vesselName: string
  voyage: string
  qcAct: string
  reful: string
  rows: number
  tiers: number
  serverDateTime: string
  sequences: SequenceVO[]
}

export interface PollingState {
  intervalMs: number
  timeoutCount: number
  running: boolean
}
