import type { TerminalView } from '@/types/terminal'

/** Realistic 6-row × 10-tier bay plan exercising all cell types. */
export const MOCK_TERMINAL_DATA: TerminalView = {
  bayName: '0001',
  vesselName: 'EVER AZURE',
  voyage: 'EA-0234W',
  qcAct: 'QC01',
  reful: '',
  rows: 6,
  tiers: 6,
  serverDateTime: new Date().toISOString(),
  sequences: [
    // ── Hold tier 02 (bottom — fully loaded) ──────────────────────────────
    { id: 'h02-02', bay: '0001', row: '02', tier: '02', type: 'discharge', text: 'D001' },
    { id: 'h04-02', bay: '0001', row: '04', tier: '02', type: 'discharge', text: 'D002' },
    { id: 'h06-02', bay: '0001', row: '06', tier: '02', type: 'discharge', text: 'D003' },
    { id: 'h08-02', bay: '0001', row: '08', tier: '02', type: 'load',      text: 'L001' },
    { id: 'h10-02', bay: '0001', row: '10', tier: '02', type: 'load',      text: 'L002' },
    { id: 'h12-02', bay: '0001', row: '12', tier: '02', type: 'load',      text: 'L003' },

    // ── Hold tier 04 ──────────────────────────────────────────────────────
    { id: 'h02-04', bay: '0001', row: '02', tier: '04', type: 'discharge', text: 'D004' },
    { id: 'h04-04', bay: '0001', row: '04', tier: '04', type: 'discharge', text: 'D005', isDg: true, isCurrent: true },
    { id: 'h06-04', bay: '0001', row: '06', tier: '04', type: 'load',      text: 'L004' },
    { id: 'h08-04', bay: '0001', row: '08', tier: '04', type: 'load',      text: 'L005' },
    { id: 'h10-04', bay: '0001', row: '10', tier: '04', type: 'empty',     text: '' },
    { id: 'h12-04', bay: '0001', row: '12', tier: '04', type: 'inactive',  text: '' },

    // ── Hold tier 06 ──────────────────────────────────────────────────────
    { id: 'h02-06', bay: '0001', row: '02', tier: '06', type: 'discharge',   text: 'D006' },
    { id: 'h04-06', bay: '0001', row: '04', tier: '06', type: 'complexunit', text: 'CX01' },
    { id: 'h06-06', bay: '0001', row: '06', tier: '06', type: 'twenty',      text: '20FT' },
    { id: 'h08-06', bay: '0001', row: '08', tier: '06', type: 'load',        text: 'L006' },
    { id: 'h10-06', bay: '0001', row: '10', tier: '06', type: 'unable',      text: '' },
    { id: 'h12-06', bay: '0001', row: '12', tier: '06', type: 'inactive',    text: '' },

    // ── Hold tier 08 ──────────────────────────────────────────────────────
    { id: 'h02-08', bay: '0001', row: '02', tier: '08', type: 'load',     text: 'L007' },
    { id: 'h04-08', bay: '0001', row: '04', tier: '08', type: 'load',     text: 'L008' },
    { id: 'h06-08', bay: '0001', row: '06', tier: '08', type: 'empty',    text: '' },
    { id: 'h08-08', bay: '0001', row: '08', tier: '08', type: 'unable',   text: '' },
    { id: 'h10-08', bay: '0001', row: '10', tier: '08', type: 'inactive', text: '' },
    { id: 'h12-08', bay: '0001', row: '12', tier: '08', type: 'inactive', text: '' },

    // ── Hold tier 10 ──────────────────────────────────────────────────────
    { id: 'h02-10', bay: '0001', row: '02', tier: '10', type: 'discharge', text: 'D007' },
    { id: 'h04-10', bay: '0001', row: '04', tier: '10', type: 'empty',     text: '' },
    { id: 'h06-10', bay: '0001', row: '06', tier: '10', type: 'inactive',  text: '' },
    { id: 'h08-10', bay: '0001', row: '08', tier: '10', type: 'inactive',  text: '' },
    { id: 'h10-10', bay: '0001', row: '10', tier: '10', type: 'inactive',  text: '' },
    { id: 'h12-10', bay: '0001', row: '12', tier: '10', type: 'inactive',  text: '' },

    // ── Hold tier 12 (top hold — sparse) ─────────────────────────────────
    { id: 'h02-12', bay: '0001', row: '02', tier: '12', type: 'load',     text: 'L009' },
    { id: 'h04-12', bay: '0001', row: '04', tier: '12', type: 'inactive', text: '' },
    { id: 'h06-12', bay: '0001', row: '06', tier: '12', type: 'inactive', text: '' },
    { id: 'h08-12', bay: '0001', row: '08', tier: '12', type: 'inactive', text: '' },
    { id: 'h10-12', bay: '0001', row: '10', tier: '12', type: 'inactive', text: '' },
    { id: 'h12-12', bay: '0001', row: '12', tier: '12', type: 'inactive', text: '' },

    // ── Deck tier 82 ─────────────────────────────────────────────────────
    { id: 'd02-82', bay: '0001', row: '02', tier: '82', type: 'discharge', text: 'D008' },
    { id: 'd04-82', bay: '0001', row: '04', tier: '82', type: 'discharge', text: 'D009' },
    { id: 'd06-82', bay: '0001', row: '06', tier: '82', type: 'load',      text: 'L010' },
    { id: 'd08-82', bay: '0001', row: '08', tier: '82', type: 'load',      text: 'L011' },
    { id: 'd10-82', bay: '0001', row: '10', tier: '82', type: 'refuel',    text: 'RF01' },
    { id: 'd12-82', bay: '0001', row: '12', tier: '82', type: 'empty',     text: '' },

    // ── Deck tier 84 ─────────────────────────────────────────────────────
    { id: 'd02-84', bay: '0001', row: '02', tier: '84', type: 'load',      text: 'L012' },
    { id: 'd04-84', bay: '0001', row: '04', tier: '84', type: 'discharge', text: 'D010', isDg: true },
    { id: 'd06-84', bay: '0001', row: '06', tier: '84', type: 'load',      text: 'L013' },
    { id: 'd08-84', bay: '0001', row: '08', tier: '84', type: 'empty',     text: '' },
    { id: 'd10-84', bay: '0001', row: '10', tier: '84', type: 'inactive',  text: '' },
    { id: 'd12-84', bay: '0001', row: '12', tier: '84', type: 'inactive',  text: '' },

    // ── Deck tier 86 ─────────────────────────────────────────────────────
    { id: 'd02-86', bay: '0001', row: '02', tier: '86', type: 'discharge', text: 'D011' },
    { id: 'd04-86', bay: '0001', row: '04', tier: '86', type: 'empty',     text: '' },
    { id: 'd06-86', bay: '0001', row: '06', tier: '86', type: 'inactive',  text: '' },
    { id: 'd08-86', bay: '0001', row: '08', tier: '86', type: 'inactive',  text: '' },

    // ── Deck tier 88 (top — minimal) ─────────────────────────────────────
    { id: 'd02-88', bay: '0001', row: '02', tier: '88', type: 'load',  text: 'L014' },
    { id: 'd04-88', bay: '0001', row: '04', tier: '88', type: 'empty', text: '' },
  ],
}
