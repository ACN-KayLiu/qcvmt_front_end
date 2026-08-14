import type { TerminalView } from '@/types/terminal'

const DEMO_ROWS = ['10', '08', '06', '04', '02', '00', '01', '03', '05', '07', '09']
const DEMO_TIERS = ['88', '84', '82', '12', '10', '08', '06', '04', '02']

/** Rich demo data for visual review: multiple bays active with mixed statuses. */
export const MOCK_TERMINAL_DATA: TerminalView = {
  bayName: '0001',
  vesselName: 'EVER AZURE',
  voyage: 'EA-0234W',
  qcAct: 'QC01',
  reful: 'No',
  serverDateTime: new Date().toISOString(),
  cells: DEMO_ROWS.flatMap((row) =>
    DEMO_TIERS.map((tier) => ({ row, tier, active: true })),
  ),
  sequences: [
    // Keep row headers deterministic: 10 08 06 04 02 00 01 03 05 07 09
    { id: 'seed-10', bay: '0001', row: '10', tier: '88', type: 'empty', text: '' },
    { id: 'seed-08', bay: '0001', row: '08', tier: '88', type: 'empty', text: '' },
    { id: 'seed-06', bay: '0001', row: '06', tier: '88', type: 'empty', text: '' },
    { id: 'seed-04', bay: '0001', row: '04', tier: '88', type: 'empty', text: '' },
    { id: 'seed-02', bay: '0001', row: '02', tier: '88', type: 'empty', text: '' },
    { id: 'seed-00', bay: '0001', row: '00', tier: '88', type: 'empty', text: '' },
    { id: 'seed-01', bay: '0001', row: '01', tier: '88', type: 'empty', text: '' },
    { id: 'seed-03', bay: '0001', row: '03', tier: '88', type: 'empty', text: '' },
    { id: 'seed-05', bay: '0001', row: '05', tier: '88', type: 'empty', text: '' },
    { id: 'seed-07', bay: '0001', row: '07', tier: '88', type: 'empty', text: '' },
    { id: 'seed-09', bay: '0001', row: '09', tier: '88', type: 'empty', text: '' },

    // Active working blocks across both even and odd sides (no DG markers)
    { id: 'w-84-06', bay: '0001', row: '06', tier: '84', type: 'load', text: 'L013' },
    { id: 'w-84-04', bay: '0001', row: '04', tier: '84', type: 'discharge', text: 'D010' },
    { id: 'w-84-02', bay: '0001', row: '02', tier: '84', type: 'load', text: 'L012' },
    { id: 'w-84-01', bay: '0001', row: '01', tier: '84', type: 'discharge', text: 'D014' },

    { id: 'w-82-10', bay: '0001', row: '10', tier: '82', type: 'discharge', text: 'D012' },
    { id: 'w-82-08', bay: '0001', row: '08', tier: '82', type: 'load', text: 'L011' },
    { id: 'w-82-06', bay: '0001', row: '06', tier: '82', type: 'load', text: 'L010' },
    { id: 'w-82-04', bay: '0001', row: '04', tier: '82', type: 'discharge', text: 'D009' },
    { id: 'w-82-02', bay: '0001', row: '02', tier: '82', type: 'discharge', text: 'D008' },
    { id: 'w-82-03', bay: '0001', row: '03', tier: '82', type: 'load', text: 'L020' },

    { id: 'w-12-02', bay: '0001', row: '02', tier: '12', type: 'load', text: 'L009' },
    { id: 'w-10-02', bay: '0001', row: '02', tier: '10', type: 'discharge', text: 'D007' },
    { id: 'w-08-04', bay: '0001', row: '04', tier: '08', type: 'load', text: 'L008' },
    { id: 'w-08-02', bay: '0001', row: '02', tier: '08', type: 'load', text: 'L007' },

    { id: 'w-06-05', bay: '0001', row: '05', tier: '06', type: 'complexunit', text: 'CX01' },
    { id: 'w-06-06', bay: '0001', row: '06', tier: '06', type: 'twenty', text: '20FT' },
    { id: 'w-06-08', bay: '0001', row: '08', tier: '06', type: 'load', text: 'L006' },
    { id: 'w-06-04', bay: '0001', row: '04', tier: '06', type: 'discharge', text: 'D006' },

    { id: 'w-04-08', bay: '0001', row: '08', tier: '04', type: 'load', text: 'L005' },
    { id: 'w-04-06', bay: '0001', row: '06', tier: '04', type: 'load', text: 'L004' },
    { id: 'w-04-04', bay: '0001', row: '04', tier: '04', type: 'discharge', text: 'D005' },
    { id: 'w-04-02', bay: '0001', row: '02', tier: '04', type: 'discharge', text: 'D004' },

    { id: 'w-02-10', bay: '0001', row: '10', tier: '02', type: 'load', text: 'L002' },
    { id: 'w-02-08', bay: '0001', row: '08', tier: '02', type: 'load', text: 'L001' },
    { id: 'w-02-06', bay: '0001', row: '06', tier: '02', type: 'discharge', text: 'D003' },
    { id: 'w-02-04', bay: '0001', row: '04', tier: '02', type: 'discharge', text: 'D002' },
    { id: 'w-02-02', bay: '0001', row: '02', tier: '02', type: 'discharge', text: 'D001' },

    // One refuel status block (renders as status cell without text)
    { id: 'w-10-03', bay: '0001', row: '03', tier: '10', type: 'refuel', text: '' },
  ],
}
