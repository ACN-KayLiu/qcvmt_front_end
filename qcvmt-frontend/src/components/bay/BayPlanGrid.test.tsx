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
        { row: '02', tier: '84', active: true, status: 'empty', text: '', dg: false, rowHighlighted: true },
        { row: '03', tier: '84', active: true, status: 'refuel', text: '', dg: false, rowHighlighted: false },
        { row: '02', tier: '82', active: true, status: 'load', text: 'OR', dg: false, rowHighlighted: true },
        { row: '03', tier: '82', active: true, status: 'twenty', text: '20', dg: false, rowHighlighted: false },
      ],
      remainingContainers: 1,
      colors: { load: '#123456', inactive: '#eeeeee' },
    }

    render(<BayPlanGrid data={data} />)

    const headers = within(screen.getAllByRole('rowgroup')[0]).getAllByRole('columnheader')
    expect(headers.map((header) => header.textContent)).toEqual(['Tier', '02', '03'])
    expect(screen.getByText('84')).toBeInTheDocument()
    expect(screen.queryByText('00')).not.toBeInTheDocument()
    expect(screen.getByText('OR').closest('td')?.className).toContain('load')
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByRole('grid')).toHaveStyle('--bay-load-color: #123456')
  })
})
