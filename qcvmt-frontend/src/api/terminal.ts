import { apiClient, requestWithRetry } from '@/lib/axios'
import type { ApiResponse } from '@/api/types'
import type { BayCellStatus, TerminalView } from '@/types/terminal'

interface BackendVessel {
  vesselId?: string
  bay?: string
}

interface BackendWorkQueueItem {
  currentPosSlot?: string
  plannedPosSlot?: string
  qtype?: string
  qrow?: string
  bay?: string | null
  dg?: boolean
  status?: string
}

interface BackendWorkQueue {
  qType?: string
  vesselId?: string
  deckHold?: string
  sequences?: BackendWorkQueueItem[]
}

interface BackendBayCell {
  row?: string
  tier?: string
  active?: string
  status?: string
  text?: string
  dg?: boolean
  rowHighlighted?: boolean
}

interface BackendColorSet {
  boxcase?: string
  color?: string
}

interface BackendTerminalData {
  vessels?: BackendVessel[]
  workQueue?: BackendWorkQueue
  cells?: BackendBayCell[]
  colorSets?: BackendColorSet[]
  remainContainers?: number
  refueling?: boolean
  vesselId?: string
  bay?: string | null
}

interface BackendTerminalResponse {
  success?: boolean
  message?: string
  data?: BackendTerminalData
  timestamp?: string | number
}

const CELL_STATUSES: BayCellStatus[] = [
  'inactive',
  'empty',
  'discharge',
  'load',
  'complexunit',
  'twenty',
  'refuel',
]

const parseCellStatus = (status?: string): BayCellStatus => {
  if (CELL_STATUSES.includes(status as BayCellStatus)) {
    return status as BayCellStatus
  }
  throw new Error(`Invalid bay cell status returned by backend: ${status || '<empty>'}`)
}

const extractQcFromMessage = (message?: string): string => {
  if (!message) {
    return ''
  }
  const match = message.match(/qcid\s*=\s*([A-Za-z0-9_-]+)/i)
  return match?.[1]?.toUpperCase() || ''
}

const transformTerminalData = (payload: BackendTerminalResponse, qcNum: string): TerminalView => {
  const data = payload.data || {}
  const vessels = data.vessels || []
  const workQueue = data.workQueue || {}
  const cells = (data.cells || [])
    .filter((cell): cell is Required<Pick<BackendBayCell, 'row' | 'tier'>> & BackendBayCell =>
      Boolean(cell.row && cell.tier),
    )
    .map((cell) => ({
      row: cell.row,
      tier: cell.tier,
      active: cell.active === '1',
      status: parseCellStatus(cell.status),
      text: cell.text || '',
      dg: Boolean(cell.dg),
      rowHighlighted: Boolean(cell.rowHighlighted),
    }))
  const colors = Object.fromEntries(
    (data.colorSets || [])
      .filter((item): item is Required<Pick<BackendColorSet, 'boxcase' | 'color'>> & BackendColorSet =>
        Boolean(item.boxcase && item.color),
      )
      .map((item) => [item.boxcase.toLowerCase(), item.color]),
  ) as Partial<Record<BayCellStatus, string>>

  const vesselName = vessels[0]?.vesselId || data.vesselId || ''
  const bayName = data.bay || vessels[0]?.bay || '-'
  const voyage = workQueue.vesselId || ''
  const qcFromMessage = extractQcFromMessage(payload.message)

  return {
    bayName,
    vesselName,
    voyage,
    qcAct: qcFromMessage || qcNum,
    reful: data.refueling ? 'Yes' : 'No',
    serverDateTime: String(payload.timestamp || new Date().toISOString()),
    cells,
    remainingContainers: data.remainContainers || 0,
    colors,
  }
}

export const __testing__ = {
  transformTerminalData,
}

export const terminalApi = {
  query: async (qcNum: string, signal?: AbortSignal): Promise<ApiResponse<TerminalView>> => {
    const normalizedQc = qcNum.trim().toUpperCase()
    if (!normalizedQc) {
      return Promise.reject(new Error('QC number is required'))
    }

    const response = await requestWithRetry<BackendTerminalResponse>(() =>
      apiClient.get('/terminal/query', {
        params: { qcNum: normalizedQc },
        signal,
      }),
    )

    if (response.success === false) {
      throw new Error(response.message || 'Failed to query terminal data')
    }

    return {
      code: 200,
      message: response.message || 'OK',
      data: transformTerminalData(response, normalizedQc),
      timestamp: Date.now(),
    }
  },
}
