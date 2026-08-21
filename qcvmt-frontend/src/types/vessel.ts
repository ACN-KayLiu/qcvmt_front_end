export interface Vessel {
  id: number
  vesselId: string
  deckHold: 'DECK' | 'HOLD'
  bay: string
  rowStart: string
  rowEnd: string
  tierStart: string
  tierEnd: string
  version?: number
}

export type CreateVesselRequest = Omit<Vessel, 'id'>
export type UpdateVesselRequest = Pick<Vessel, 'rowStart' | 'rowEnd' | 'tierStart' | 'tierEnd'>
