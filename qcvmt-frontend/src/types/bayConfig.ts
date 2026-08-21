export interface BayConfig {
  id: number
  type: string
  row: string
  tier: string
  tierStart: string
  tierEnd: string
  active: string
}

export interface VesselRefuelItem {
  id: number
  vesselId: string
  isRefuel: string
  version?: number
}

export interface VesselColorItem {
  id: number
  vesselId: string
  deckHold: string
  bay: string
  rowStart: string
  rowEnd: string
  tierStart: string
  tierEnd: string
  version?: number
}
