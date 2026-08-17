import { create } from 'zustand'
import { terminalApi } from '@/api/terminal'
import type { PollingState, SignalStatus, TerminalView } from '@/types/terminal'

interface TerminalState {
  data: TerminalView | null
  signalStatus: SignalStatus
  polling: PollingState
  loading: boolean
  error: string | null
  setData: (data: TerminalView) => void
  clearData: () => void
  setPolling: (next: Partial<PollingState>) => void
  fetchTerminalData: (qcNum: string, signal?: AbortSignal) => Promise<void>
}

let requestGeneration = 0

export const useTerminalStore = create<TerminalState>((set) => ({
  data: null,
  signalStatus: 'red',
  polling: { intervalMs: 15_000, timeoutCount: 0, running: false },
  loading: false,
  error: null,
  setData: (data) => set({ data, signalStatus: 'green', loading: false, error: null }),
  clearData: () => {
    requestGeneration += 1
    set({ data: null, signalStatus: 'red', loading: false, error: null })
  },
  setPolling: (next) =>
    set((state) => ({
      polling: {
        ...state.polling,
        ...next,
      },
    })),
  fetchTerminalData: async (qcNum, signal) => {
    if (!qcNum.trim()) {
      set((state) => ({
        ...state,
        loading: false,
      }))
      return
    }

    const generation = ++requestGeneration
    set((state) => ({ ...state, loading: true, error: null }))
    try {
      const response = await terminalApi.query(qcNum, signal)
      if (generation !== requestGeneration) {
        return
      }
      set((state) => ({
        ...state,
        data: response.data,
        signalStatus: 'green',
        loading: false,
      }))
    } catch (error) {
      if (generation !== requestGeneration) {
        return
      }
      if ((error as Error).name === 'CanceledError') {
        return
      }
      set((state) => ({
        ...state,
        signalStatus: 'red',
        loading: false,
        error: 'Failed to sync terminal data',
      }))
    }
  },
}))
