import { apiClient, requestWithRetry } from '@/lib/axios'
import type { ApiResponse } from '@/api/types'
import type { TerminalView } from '@/types/terminal'

type CellType = TerminalView['sequences'][number]['type']

interface BackendVessel {
  vesselId?: string
  bay?: string
  rowEnd?: string
  tierEnd?: string
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

interface BackendCellMatrixItem {
  id?: number
  row?: string
  tier?: string
  active?: string
}

interface BackendTerminalData {
  vessels?: BackendVessel[]
  workQueue?: BackendWorkQueue
  cellMatrix?: BackendCellMatrixItem[]
  vesselId?: string
  bay?: string | null
}

interface BackendTerminalResponse {
  success?: boolean
  message?: string
  data?: BackendTerminalData
  timestamp?: string | number
}

const toInt = (value?: string): number => {
  if (!value) {
    return 0
  }
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

const inferRows = (vessels: BackendVessel[]): number => {
  const maxRow = vessels.reduce((acc, vessel) => Math.max(acc, toInt(vessel.rowEnd)), 0)
  return Math.max(1, Math.floor(maxRow / 2) + 1)
}

const inferTiers = (vessels: BackendVessel[]): number => {
  const maxTier = vessels.reduce((acc, vessel) => Math.max(acc, toInt(vessel.tierEnd)), 0)
  return maxTier > 70 ? 8 : Math.max(1, Math.floor(maxTier / 2) + 1)
}

const mapQTypeToCellType = (qtype?: string): CellType => {
  const normalized = (qtype || '').toUpperCase()
  if (normalized === 'DISCH') {
    return 'discharge'
  }
  if (normalized === 'LOAD') {
    return 'load'
  }
  return 'empty'
}

const extractTierFromSlot = (slot?: string): string => {
  if (!slot) {
    return '82'
  }

  const normalized = slot.trim().toUpperCase()
  const match = normalized.match(/(\d{6})(?:\.\d+)?$/)
  if (!match) {
    return '82'
  }

  const sixDigits = match[1]
  return sixDigits.slice(-2)
}

// pos_slot is BBRRTT: chars 0-1 = bay, 2-3 = row, 4-5 = tier. This mirrors the
// legacy CellDaoImpl parsing (current_pos_slot.substring(2, 4)). Note that
// qrow (a work-queue ordering field) is NOT the physical row and must not be
// used for grid placement.
const extractRowFromSlot = (slot?: string): string => {
  if (!slot) {
    return '0'
  }

  const normalized = slot.trim().toUpperCase()
  const match = normalized.match(/(\d{6})(?:\.\d+)?$/)
  if (!match) {
    return '0'
  }

  const sixDigits = match[1]
  return sixDigits.slice(2, 4)
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
  const workQueueItems = workQueue.sequences || []
  const cellMatrix = data.cellMatrix || []

  const queueSequences = workQueueItems.map((item, index) => ({
    id: `queue-${index}-${item.currentPosSlot || item.plannedPosSlot || 'cell'}`,
    bay: item.bay || data.bay || '',
    row: extractRowFromSlot(item.currentPosSlot || item.plannedPosSlot),
    tier: extractTierFromSlot(item.currentPosSlot || item.plannedPosSlot),
    type: mapQTypeToCellType(item.qtype || workQueue.qType),
    text: item.currentPosSlot || item.plannedPosSlot || '',
    isDg: Boolean(item.dg),
    isCurrent: (item.status || '').toUpperCase() === 'PLANNED' && index === 0,
  }))

  const vesselName = vessels[0]?.vesselId || data.vesselId || ''
  const bayName = data.bay || vessels[0]?.bay || '-'
  const voyage = workQueue.vesselId || ''
  const qcFromMessage = extractQcFromMessage(payload.message)

  const hasQueueSequences = queueSequences.length > 0

  const matrixFallbackSequences = hasQueueSequences
    ? []
    : cellMatrix.map((item) => ({
        id: `matrix-${item.id || `${item.row || '0'}-${item.tier || '0'}`}`,
        bay: data.bay || '',
        row: item.row || '0',
        tier: item.tier || '0',
        type: (item.active === '1' ? 'empty' : 'inactive') as CellType,
        text: '',
      }))

  return {
    bayName,
    vesselName,
    voyage,
    qcAct: qcFromMessage || qcNum,
    reful: '',
    rows: inferRows(vessels),
    tiers: hasQueueSequences ? 0 : inferTiers(vessels),
    serverDateTime: String(payload.timestamp || new Date().toISOString()),
    sequences: hasQueueSequences ? queueSequences : matrixFallbackSequences,
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
