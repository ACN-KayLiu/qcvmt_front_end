import { describe, expect, it } from 'vitest'
import { __testing__ } from '@/api/terminal'

describe('terminal bay layout transform', () => {
  it('uses backend-rendered cell status and text without inferring from the queue', () => {
    const result = __testing__.transformTerminalData(
      {
        data: {
          bay: '01',
          vessels: [{ vesselId: 'V1', bay: '01', rowEnd: '10', tierEnd: '84' }],
          cells: [
            { row: '01', tier: '82', active: '1', status: 'complexunit', text: 'ORX', dg: false },
            { row: '03', tier: '82', active: '1', status: 'twenty', text: '20', dg: false },
            { row: '01', tier: '84', active: '1', status: 'refuel', text: '', dg: false },
            { row: '03', tier: '84', active: '1', status: 'empty', text: '', dg: false },
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
      { row: '01', tier: '82', active: true, status: 'complexunit', text: 'ORX', dg: false, rowHighlighted: false },
      { row: '03', tier: '82', active: true, status: 'twenty', text: '20', dg: false, rowHighlighted: false },
      { row: '01', tier: '84', active: true, status: 'refuel', text: '', dg: false, rowHighlighted: false },
      { row: '03', tier: '84', active: true, status: 'empty', text: '', dg: false, rowHighlighted: false },
    ])
    expect(result.cells.map((cell) => cell.text)).not.toContain('010184')
  })
})
