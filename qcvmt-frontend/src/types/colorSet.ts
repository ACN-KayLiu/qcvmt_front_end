export interface ColorSet {
  id: number
  boxcase: string
  color: string
  version?: number
}

export type CreateColorSetRequest = Pick<ColorSet, 'boxcase' | 'color'>
export type UpdateColorSetRequest = Pick<ColorSet, 'color'>
