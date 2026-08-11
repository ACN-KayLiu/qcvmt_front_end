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

const LEGEND = [
  { type: 'discharge', label: 'Discharge' },
  { type: 'load', label: 'Load' },
  { type: 'empty', label: 'Empty' },
  { type: 'inactive', label: 'Inactive' },
  { type: 'unable', label: 'Unable' },
  { type: 'complexunit', label: 'Complex' },
  { type: 'twenty', label: '20 FT' },
  { type: 'refuel', label: 'Refuel' },
] as const

/** Spreader beam icon — bobs above the active crane column. */
const CraneIndicator = () => (
  <span className={styles.craneIndicator} title="QC crane position">
    <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="17" y1="0" x2="17" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="2" y="10" width="30" height="5" rx="2" fill="currentColor" />
      <line x1="7"  y1="15" x2="7"  y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="15" x2="17" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="27" y1="15" x2="27" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </span>
)

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

  const currentSequence = data.sequences.find((s) => s.isCurrent)
  const currentRow = currentSequence ? toInt(currentSequence.row) : null

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
                <BayCell item={sequence} type={sequence?.type ?? 'empty'} text={sequence?.text ?? ''} />
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
          {currentRow !== null ? (
            <tr className={styles.craneRow} aria-hidden="true">
              <td />
              {rows.map((row) => (
                <td key={`crane-${row}`}>{row === currentRow ? <CraneIndicator /> : null}</td>
              ))}
            </tr>
          ) : null}
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

      <div className={styles.legend} aria-label="Cell type legend">
        {LEGEND.map(({ type, label }) => (
          <div key={type} className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles[type]}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

