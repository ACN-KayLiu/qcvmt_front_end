import { describe, expect, it } from 'vitest'
import { __testing__ } from '@/api/terminal'

describe('terminal bay layout transform', () => {
  it('keeps every backend bay cell when queue data exists', () => {
    const result = __testing__.transformTerminalData(
      {
        data: {
          bay: '01',
          vessels: [{ vesselId: 'V1', bay: '01', rowEnd: '10', tierEnd: '84' }],
          cells: [
            { row: '01', tier: '82', active: '1' },
            { row: '03', tier: '82', active: '1' },
            { row: '01', tier: '84', active: '1' },
            { row: '03', tier: '84', active: '1' },
          ],
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

    expect(result.cells).toEqual([
      { row: '01', tier: '82', active: true },
      { row: '03', tier: '82', active: true },
      { row: '01', tier: '84', active: true },
      { row: '03', tier: '84', active: true },
    ])
  })
})
