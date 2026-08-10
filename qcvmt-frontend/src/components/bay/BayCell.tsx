import { memo } from 'react'
import styles from '@/styles/bay-plan.module.css'
import type { SequenceVO } from '@/types/terminal'

interface BayCellProps {
  item?: SequenceVO
  type?: SequenceVO['type']
  text?: string
  isDg?: boolean
}

const BayCellRaw = ({ item, type, text, isDg }: BayCellProps) => {
  const resolvedType = item?.type || type || 'empty'
  const resolvedText = text ?? item?.text ?? (item ? `${item.row}/${item.tier}` : '')
  const resolvedIsDg = isDg ?? item?.isDg ?? false
  const cssClass = `${styles.cell} ${styles[resolvedType] || ''}`
  const ariaLabel = item
    ? `Bay ${item.bay}, row ${item.row}, tier ${item.tier}`
    : `Bay cell ${resolvedType}`

  return (
    <div className={cssClass} aria-label={ariaLabel}>
      <span>{resolvedText}</span>
      {resolvedIsDg ? <span className={styles.dg}>DG</span> : null}
    </div>
  )
}

export const BayCell = memo(BayCellRaw)
