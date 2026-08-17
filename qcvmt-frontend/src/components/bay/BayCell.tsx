import { memo } from 'react'
import styles from '@/styles/bay-plan.module.css'
import type { BayCell } from '@/types/terminal'

interface BayCellProps {
  cell: BayCell
  bay: string
}

/**
 * Literal replica of a single <td> emitted by CellDaoImpl#buildBay:
 *   <td class="{status}">{cellInfo}</td>
 *   <td class="refuel">&nbsp;</td>
 *   cellInfo + <span class="dgind|infodgind">*</span> when is_dg
 */
const BayCellRaw = ({ cell, bay }: BayCellProps) => {
  const cssClass = styles[cell.status] ?? ''
  const markerClass = cell.text ? styles.infodgind : styles.dgind

  return (
    <td className={cssClass} aria-label={`Bay ${bay}, row ${cell.row}, tier ${cell.tier}`}>
      {cell.text || '\u00A0'}
      {cell.dg ? <span className={markerClass}>*</span> : null}
    </td>
  )
}

export const BayCell = memo(BayCellRaw)
