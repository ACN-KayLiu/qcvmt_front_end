import { describe, expect, it } from 'vitest'
import { __testing__ } from '@/api/terminal'

describe('terminal transform tier source', () => {
  it('uses queue slot tiers and ignores matrix tier when queue exists', () => {
    const result = __testing__.transformTerminalData(
      {
        data: {
          bay: '01',
          vessels: [{ vesselId: 'V1', bay: '01', rowEnd: '10', tierEnd: '84' }],
          cellMatrix: [{ id: 1, row: '01', tier: '11', active: '1' }],
          workQueue: {
            qType: 'DISCH',
            vesselId: 'V1',
            sequences: [
              { currentPosSlot: '010184', qtype: 'DISCH', status: 'PLANNED' },
              { currentPosSlot: '010182', qtype: 'DISCH', status: 'NONE' },
            ],
          },
        },
        message: 'qcid=QC16',
        success: true,
      },
      'QC16',
    )

    const tiers = Array.from(new Set(result.sequences.map((s) => s.tier))).sort()
    expect(tiers).toEqual(['82', '84'])
  })
})
