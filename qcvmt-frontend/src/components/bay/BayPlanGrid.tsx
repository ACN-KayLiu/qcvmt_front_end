import styles from '@/styles/bay-plan.module.css'
import { BayCell } from '@/components/bay/BayCell'
import type { TerminalView } from '@/types/terminal'

interface BayPlanGridProps {
  data: TerminalView
}

const toInt = (value: string): number => {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

const formatTierLabel = (tier: number): string => String(tier).padStart(2, '0')

/**
 * 将行号按照中心对称排列：左侧偶数递减，右侧奇数递增。
 * 例：10 08 06 04 02 00 01 03 05 07 09
 */
const sortRowsAroundCenter = (rowValues: number[]): number[] => {
  const evenRows = rowValues.filter((row) => row % 2 === 0).sort((a, b) => b - a)
  const oddRows = rowValues.filter((row) => row % 2 !== 0).sort((a, b) => a - b)

  // 找到00列（偶数组中的最小值）
  const zeroIndex = evenRows.indexOf(0)

  if (zeroIndex === -1) {
    // 如果没有00列，返回原顺序
    return rowValues
  }

  // 00列左边的偶数（递减顺序已有）
  const leftEvens = evenRows.slice(0, zeroIndex)
  // 00列及右边（包括00和所有奇数）
  const rightPart = [...evenRows.slice(zeroIndex), ...oddRows]

  return [...leftEvens, ...rightPart]
}

const buildCenteredRows = (rowValues: number[], rowCount: number): number[] => {
  const hasZero = rowValues.includes(0)
  const hasOdd = rowValues.some((value) => value % 2 !== 0)

  if (hasZero || hasOdd) {
    return sortRowsAroundCenter(rowValues)
  }

  const normalizedCount = Math.max(rowCount, 1)
  if (normalizedCount === 1) {
    return [0]
  }

  const leftMaxEven = (normalizedCount - 1) * 2
  const leftEvens = Array.from({ length: normalizedCount - 1 }, (_, index) => leftMaxEven - index * 2)
  const rightOdds = Array.from({ length: normalizedCount - 1 }, (_, index) => index * 2 + 1)

  return [...leftEvens, 0, ...rightOdds]
}

/**
 * Literal replica of CellDaoImpl#buildBay / #getFirstLine: a single flat
 * table, tiers descending top-to-bottom, one header row (Tier + row
 * numbers). With Hold/Deck divider rows, legend, and crane icon.
 * A row's header cell gets the same "load" (orange) class the JSP applies 
 * when that row is under the active crane lane.
 */
export const BayPlanGrid = ({ data }: BayPlanGridProps) => {
  const sequenceMap = new Map<string, (typeof data.sequences)[number]>()

  for (const sequence of data.sequences) {
    const key = `${toInt(sequence.row)}-${toInt(sequence.tier)}`
    sequenceMap.set(key, sequence)
  }

  const rowValues = Array.from(
    new Set(
      data.sequences
        .map((item) => toInt(item.row))
        .filter((value) => Number.isFinite(value) && value >= 0)
        .sort((a, b) => a - b),
    ),
  )

  const rows =
    rowValues.length > 0
      ? buildCenteredRows(rowValues, Math.max(data.rows, 1))
      : buildCenteredRows(Array.from({ length: Math.max(data.rows, 1) }, (_, index) => index * 2), Math.max(data.rows, 1))

  const tierValues = Array.from(
    new Set(
      data.sequences
        .map((item) => toInt(item.tier))
        .filter((value) => Number.isFinite(value) && value >= 0)
        .sort((a, b) => a - b),
    ),
  )

  const fallbackTierCount = Math.max(data.tiers, 1)
  const fallbackTiers = Array.from({ length: fallbackTierCount }, (_, index) => index * 2)
  const tiers = tierValues.length > 0 ? tierValues : fallbackTiers

  const renderTierRows = (tiers: number[]) => {
    return tiers
      .slice()
      .sort((a, b) => b - a)
      .map((tier) => (
        <tr key={`tier-${tier}`}>
          <td className={styles.tierCell}>{formatTierLabel(tier)}</td>
          {rows.map((row) => {
            const key = `${row}-${tier}`
            const sequence = sequenceMap.get(key)
            return <BayCell key={key} item={sequence} type={sequence?.type} text={sequence?.text ?? ''} />
          })}
        </tr>
      ))
  }

  return (
    <div className={styles.wrapper} role="grid" aria-label="Bay plan grid">
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headCell}>Tier</th>
            {rows.map((row) => (
              <th key={`row-${row}`} className={styles.headCell}>
                {String(row).padStart(2, '0')}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {renderTierRows(tiers)}
        </tbody>
      </table>
    </div>
  )
}
