export interface Vessel {
  id: number
  vesselId: string
  vesselName: string
  deckHold: 'DECK' | 'HOLD'
  bayStart: number
  bayEnd: number
  rowStart: number
  rowEnd: number
  tierStart: number
  tierEnd: number
}

export type CreateVesselRequest = Omit<Vessel, 'id'>
export type UpdateVesselRequest = Omit<Vessel, 'id'>
