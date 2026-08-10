import { describe, expect, it } from 'vitest'
import {
  bayConfigFormSchema,
  colorSetFormSchema,
  createUserSchema,
  exportLogsSchema,
  oddEvenPairSchema,
  updateUserSchema,
  vesselColorFormSchema,
  vesselFormSchema,
  vesselRefuelFormSchema,
  vesselSchema,
} from '@/utils/validators'

describe('validators', () => {
  it('accepts same parity rows', () => {
    const result = oddEvenPairSchema.safeParse({ rowStart: 1, rowEnd: 3 })
    expect(result.success).toBe(true)
  })

  it('rejects different parity rows', () => {
    const result = oddEvenPairSchema.safeParse({ rowStart: 1, rowEnd: 4 })
    expect(result.success).toBe(false)
  })

  it('rejects invalid bay range', () => {
    const result = vesselSchema.safeParse({
      vesselId: 'V1',
      vesselName: 'Test',
      bayStart: 10,
      bayEnd: 9,
    })
    expect(result.success).toBe(false)
  })

  it('rejects too short user password on create', () => {
    const result = createUserSchema.safeParse({
      username: 'admin',
      password: '123',
      qcid: 'QC01',
      name: 'Admin',
      role: 'qcvmt-admin',
    })
    expect(result.success).toBe(false)
  })

  it('accepts blank password on update', () => {
    const result = updateUserSchema.safeParse({
      username: 'user1',
      password: '',
      qcid: 'QC01',
      name: 'User 1',
      role: 'qcvmt-user',
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid vessel form', () => {
    const result = vesselFormSchema.safeParse({
      vesselId: 'V001',
      vesselName: 'Demo Vessel',
      deckHold: 'DECK',
      bayStart: 1,
      bayEnd: 3,
      rowStart: 2,
      rowEnd: 6,
      tierStart: 80,
      tierEnd: 90,
    })
    expect(result.success).toBe(true)
  })

  it('rejects vessel form with row parity mismatch', () => {
    const result = vesselFormSchema.safeParse({
      vesselId: 'V001',
      vesselName: 'Demo Vessel',
      deckHold: 'DECK',
      bayStart: 1,
      bayEnd: 3,
      rowStart: 1,
      rowEnd: 4,
      tierStart: 80,
      tierEnd: 90,
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid color set payload', () => {
    const result = colorSetFormSchema.safeParse({
      boxCase: 'inactive',
      color: '#12ABEF',
      description: 'Inactive color',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid color set hex value', () => {
    const result = colorSetFormSchema.safeParse({
      boxCase: 'inactive',
      color: 'blue',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid vessel color payload', () => {
    const result = vesselColorFormSchema.safeParse({
      vesselId: 'V001',
      bayStart: 1,
      bayEnd: 3,
      rowStart: 2,
      rowEnd: 6,
      tierStart: 80,
      tierEnd: 90,
      color: '#abcdef',
    })
    expect(result.success).toBe(true)
  })

  it('rejects vessel color with invalid ranges', () => {
    const result = vesselColorFormSchema.safeParse({
      vesselId: 'V001',
      bayStart: 4,
      bayEnd: 2,
      rowStart: 1,
      rowEnd: 4,
      tierStart: 90,
      tierEnd: 80,
      color: '#abcdef',
    })
    expect(result.success).toBe(false)
  })

  it('accepts vessel refuel payload', () => {
    const result = vesselRefuelFormSchema.safeParse({
      vesselId: 'V001',
      isRefuel: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects bay config where deck tiers are less than hold tiers', () => {
    const result = bayConfigFormSchema.safeParse({
      holdTiers: 12,
      deckTiers: 10,
    })
    expect(result.success).toBe(false)
  })

  it('accepts export log date range', () => {
    const result = exportLogsSchema.safeParse({
      from: '2026-08-01',
      to: '2026-08-10',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid export log date range', () => {
    const result = exportLogsSchema.safeParse({
      from: '2026-08-10',
      to: '2026-08-01',
    })
    expect(result.success).toBe(false)
  })
})
