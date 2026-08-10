export interface ColorSet {
  id: number
  boxCase: string
  color: string
  description?: string
}

export type CreateColorSetRequest = Omit<ColorSet, 'id'>
export type UpdateColorSetRequest = Omit<ColorSet, 'id'>
