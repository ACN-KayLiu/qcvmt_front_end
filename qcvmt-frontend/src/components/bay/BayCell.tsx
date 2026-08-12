import { memo } from 'react'
import styles from '@/styles/bay-plan.module.css'
import type { SequenceVO } from '@/types/terminal'

interface BayCellProps {
  item?: SequenceVO
  type?: SequenceVO['type']
  text?: string
  isDg?: boolean
}

/**
 * Literal replica of a single <td> emitted by CellDaoImpl#buildBay:
 *   <td class="{status}">{cellInfo}</td>
 *   <td class="refuel">&nbsp;</td>
 *   cellInfo + <span class="dgind|infodgind">*</span> when is_dg
 */
const BayCellRaw = ({ item, type, text, isDg }: BayCellProps) => {
  const resolvedType = item?.type || type || 'blank'
  const resolvedText = resolvedType === 'refuel' ? '' : text ?? item?.text ?? ''
  void isDg

  const cssClass = [styles[resolvedType] ?? ''].filter(Boolean).join(' ')

  const ariaLabel = item
    ? `Bay ${item.bay}, row ${item.row}, tier ${item.tier}`
    : `Bay cell ${resolvedType}`

  return (
    <td className={cssClass} aria-label={ariaLabel}>
      {resolvedType === 'blank' ? '\u00A0' : resolvedText}
    </td>
  )
}

export const BayCell = memo(BayCellRaw)
