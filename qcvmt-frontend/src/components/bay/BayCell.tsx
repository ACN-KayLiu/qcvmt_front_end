import { memo } from 'react'
import styles from '@/styles/bay-plan.module.css'
import type { SequenceVO } from '@/types/terminal'

interface BayCellProps {
  item?: SequenceVO
  type?: SequenceVO['type']
  text?: string
  isDg?: boolean
  isCurrent?: boolean
}

const BayCellRaw = ({ item, type, text, isDg, isCurrent }: BayCellProps) => {
  const resolvedType = item?.type || type || 'empty'
  const resolvedText = text ?? item?.text ?? ''
  const resolvedIsDg = isDg ?? item?.isDg ?? false
  const resolvedIsCurrent = isCurrent ?? item?.isCurrent ?? false

  const cssClass = [
    styles.cell,
    styles[resolvedType] ?? '',
    resolvedIsCurrent ? styles.current : '',
  ]
    .filter(Boolean)
    .join(' ')

  const ariaLabel = item
    ? `Bay ${item.bay}, row ${item.row}, tier ${item.tier}${resolvedIsCurrent ? ', active' : ''}`
    : `Bay cell ${resolvedType}`

  return (
    <div className={cssClass} aria-label={ariaLabel}>
      {resolvedIsCurrent ? <span className={styles.currentDot} aria-hidden="true" /> : null}
      <span className={styles.cellText}>{resolvedText}</span>
      {resolvedIsDg ? (
        <span className={styles.dg} aria-label="Dangerous goods">
          DG
        </span>
      ) : null}
    </div>
  )
}

export const BayCell = memo(BayCellRaw)

