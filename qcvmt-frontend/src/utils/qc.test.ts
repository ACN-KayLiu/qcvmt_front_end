import { describe, expect, it } from 'vitest'
import { normalizeQcDigits, toQcId } from '@/utils/qc'

describe('QC identifier normalization', () => {
  it('keeps only the numeric login value', () => {
    expect(normalizeQcDigits('QC16')).toBe('16')
    expect(normalizeQcDigits(' 5a8 ')).toBe('58')
  })

  it('adds the QC prefix exactly once', () => {
    expect(toQcId('16')).toBe('QC16')
    expect(toQcId('qc16')).toBe('QC16')
    expect(toQcId('')).toBe('')
  })
})