import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BayPlanGrid } from '@/components/bay/BayPlanGrid'
import type { TerminalView } from '@/types/terminal'

describe('BayPlanGrid', () => {
  it('renders row and tier headers only from backend cells', () => {
    const data: TerminalView = {
      bayName: '17',
      vesselName: 'VESSEL-1',
      voyage: '',
      qcAct: 'QC01',
      reful: '',
      serverDateTime: '',
      cells: [
        { row: '02', tier: '82', active: true },
        { row: '03', tier: '82', active: true },
        { row: '02', tier: '84', active: true },
        { row: '03', tier: '84', active: true },
      ],
      sequences: [
        { id: 'one', bay: '17', row: '02', tier: '82', type: 'load' },
      ],
    }

    render(<BayPlanGrid data={data} />)

    const headers = within(screen.getAllByRole('rowgroup')[0]).getAllByRole('columnheader')
    expect(headers.map((header) => header.textContent)).toEqual(['Tier', '02', '03'])
    expect(screen.getByText('84')).toBeInTheDocument()
    expect(screen.queryByText('00')).not.toBeInTheDocument()
  })
})
