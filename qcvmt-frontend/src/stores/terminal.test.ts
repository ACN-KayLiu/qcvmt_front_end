import { beforeEach, describe, expect, it, vi } from 'vitest'
import { terminalApi } from '@/api/terminal'
import { useTerminalStore } from '@/stores/terminal'
import type { ApiResponse } from '@/api/types'
import type { TerminalView } from '@/types/terminal'

vi.mock('@/api/terminal', () => ({
  terminalApi: { query: vi.fn() },
}))

const terminalView = (qcAct: string, text: string): TerminalView => ({
  bayName: '17',
  vesselName: 'VESSEL-1',
  voyage: 'VISIT-1',
  qcAct,
  reful: 'No',
  serverDateTime: '2026-08-17T00:00:00Z',
  cells: [
    {
      row: '01',
      tier: '82',
      active: true,
      status: 'load',
      text,
      dg: false,
      rowHighlighted: true,
    },
  ],
  remainingContainers: 1,
  colors: {},
})

const deferred = () => {
  let resolve!: (value: ApiResponse<TerminalView>) => void
  const promise = new Promise<ApiResponse<TerminalView>>((next) => {
    resolve = next
  })
  return { promise, resolve }
}

describe('terminal QC request ownership', () => {
  beforeEach(() => {
    useTerminalStore.getState().clearData()
    vi.clearAllMocks()
  })

  it('does not let a late QC58 response replace QC16 cells', async () => {
    const qc58 = deferred()
    const qc16 = deferred()
    vi.mocked(terminalApi.query)
      .mockReturnValueOnce(qc58.promise)
      .mockReturnValueOnce(qc16.promise)

    const oldRequest = useTerminalStore.getState().fetchTerminalData('QC58')
    useTerminalStore.getState().clearData()
    const currentRequest = useTerminalStore.getState().fetchTerminalData('QC16')

    qc16.resolve({ code: 200, message: 'OK', timestamp: Date.now(), data: terminalView('QC16', '16') })
    await currentRequest
    qc58.resolve({ code: 200, message: 'OK', timestamp: Date.now(), data: terminalView('QC58', '58') })
    await oldRequest

    expect(useTerminalStore.getState().data?.qcAct).toBe('QC16')
    expect(useTerminalStore.getState().data?.cells[0]?.text).toBe('16')
  })
})