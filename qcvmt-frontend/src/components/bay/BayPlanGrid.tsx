import type { CSSProperties } from 'react'
import styles from '@/styles/bay-plan.module.css'
import { BayCell } from '@/components/bay/BayCell'
import type { TerminalView } from '@/types/terminal'

interface BayPlanGridProps {
  data: TerminalView
}

/**
 * Literal replica of CellDaoImpl#buildBay / #getFirstLine: a single flat
 * table, tiers descending top-to-bottom, one header row (Tier + row
 * numbers). With Hold/Deck divider rows, legend, and crane icon.
 * A row's header cell gets the same "load" (orange) class the JSP applies 
 * when that row is under the active crane lane.
 */
export const BayPlanGrid = ({ data }: BayPlanGridProps) => {
  const cellMap = new Map<string, (typeof data.cells)[number]>()

  for (const cell of data.cells) {
    cellMap.set(`${cell.row}-${cell.tier}`, cell)
  }

  const rows = Array.from(new Set(data.cells.map((item) => item.row)))
  const tiers = Array.from(new Set(data.cells.map((item) => item.tier)))

  const renderTierRows = () => {
    return tiers.map((tier) => (
        <tr key={`tier-${tier}`}>
          <td className={styles.tierCell}>{tier}</td>
          {rows.map((row) => {
            const key = `${row}-${tier}`
            const cell = cellMap.get(key)
            if (!cell) {
              return <td key={key} className={styles.empty}>&nbsp;</td>
            }
            return <BayCell key={key} cell={cell} bay={data.bayName} />
          })}
        </tr>
      ))
  }

  return (
    <div
      className={styles.wrapper}
      role="grid"
      aria-label="Bay plan grid"
      style={{
        '--bay-inactive-color': data.colors.inactive,
        '--bay-empty-color': data.colors.empty,
        '--bay-discharge-color': data.colors.discharge,
        '--bay-load-color': data.colors.load,
        '--bay-complexunit-color': data.colors.complexunit,
      } as CSSProperties}
    >
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headCell}>Tier</th>
            {rows.map((row) => (
              <th
                key={`row-${row}`}
                className={
                  data.cells.some((cell) => cell.row === row && cell.rowHighlighted)
                    ? styles.load
                    : styles.headCell
                }
              >
                {row}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {renderTierRows()}
        </tbody>
      </table>
    </div>
  )
}
