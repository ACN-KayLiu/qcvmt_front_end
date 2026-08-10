export interface BayConfig {
  holdTiers: number
  deckTiers: number
}

export interface VesselRefuelItem {
  id: number
  vesselId: string
  isRefuel: boolean
}

export interface VesselColorItem {
  id: number
  vesselId: string
  bayStart: number
  bayEnd: number
  rowStart: number
  rowEnd: number
  tierStart: number
  tierEnd: number
  color: string
}
