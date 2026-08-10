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
        .filter((value) => Number.isFinite(value) && value > 0)
        .sort((a, b) => a - b),
    ),
  )

  const rows =
    rowValues.length > 0
      ? rowValues
      : Array.from({ length: Math.max(data.rows, 1) }, (_, index) => (index + 1) * 2)

  const tierValues = Array.from(
    new Set(
      data.sequences
        .map((item) => toInt(item.tier))
        .filter((value) => Number.isFinite(value) && value >= 0)
        .sort((a, b) => a - b),
    ),
  )

  const holdTiers = tierValues.filter((tier) => tier <= 70)
  const deckTiers = tierValues.filter((tier) => tier > 70)

  const fallbackTierCount = Math.max(data.tiers, 1)
  const fallbackHold = Array.from({ length: fallbackTierCount }, (_, index) => index * 2)
  const tiersForHold = holdTiers.length > 0 ? holdTiers : fallbackHold
  const tiersForDeck = deckTiers

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
            return (
              <td key={key}>
                <BayCell item={sequence} type={sequence?.type || 'empty'} text={sequence?.text || ''} />
              </td>
            )
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
          <tr className={styles.sectionRow}>
            <td colSpan={rows.length + 1}>Hold</td>
          </tr>
          {renderTierRows(tiersForHold)}

          {tiersForDeck.length > 0 ? (
            <>
              <tr className={styles.sectionRow}>
                <td colSpan={rows.length + 1}>Deck</td>
              </tr>
              {renderTierRows(tiersForDeck)}
            </>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
