import { z } from 'zod'

export const oddEvenPairSchema = z
  .object({
    rowStart: z.number().int().nonnegative(),
    rowEnd: z.number().int().nonnegative(),
  })
  .refine((input) => input.rowStart % 2 === input.rowEnd % 2, {
    message: 'rowStart and rowEnd must have the same odd-even parity',
    path: ['rowEnd'],
  })

export const vesselSchema = z
  .object({
    vesselId: z.string().min(1),
    bay: z.string().min(1),
  })

const deckHoldSchema = z.enum(['DECK', 'HOLD'])

export const vesselFormSchema = z
  .object({
    vesselId: z.string().min(1, 'Vessel ID is required'),
    deckHold: deckHoldSchema,
    bay: z.string().min(1, 'Bay is required'),
    rowStart: z.string().min(1, 'Row start is required'),
    rowEnd: z.string().min(1, 'Row end is required'),
    tierStart: z.string().min(1, 'Tier start is required'),
    tierEnd: z.string().min(1, 'Tier end is required'),
  })

const roleSchema = z.enum(['qcvmt-admin', 'qcvmt-user', 'qcvmt-limited'])

export const createUserSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  qcid: z.string().min(1, 'QCID is required'),
  parent: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
})

export const updateUserSchema = z.object({
  qcid: z.string().min(1, 'QCID is required'),
  parent: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
})

export const colorSetFormSchema = z.object({
  boxcase: z.string().min(1, 'Box case is required'),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, 'Color must be a valid hex value like #12ABEF'),
})

export const vesselColorFormSchema = z
  .object({
    vesselId: z.string().min(1, 'Vessel ID is required'),
    deckHold: z.string().min(1, 'Deck/Hold is required'),
    bay: z.string().min(1, 'Bay is required'),
    rowStart: z.string().min(1, 'Row start is required'),
    rowEnd: z.string().min(1, 'Row end is required'),
    tierStart: z.string().min(1, 'Tier start is required'),
    tierEnd: z.string().min(1, 'Tier end is required'),
  })

export const vesselRefuelFormSchema = z.object({
  vesselId: z.string().min(1, 'Vessel ID is required'),
  isRefuel: z.enum(['Y', 'N']),
})

export const bayConfigFormSchema = z
  .object({
    id: z.number().int().nonnegative(),
    type: z.string().min(1),
    row: z.string().min(1),
    tier: z.string().min(1),
    tierStart: z.string().min(1, 'Tier start is required'),
    tierEnd: z.string().min(1, 'Tier end is required'),
    active: z.string().min(1),
  })

export const exportLogsSchema = z
  .object({
    from: z.string().min(1, 'From date is required'),
    to: z.string().min(1, 'To date is required'),
  })
  .superRefine((input, context) => {
    if (input.from > input.to) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'From date must be before or equal to to date',
        path: ['to'],
      })
    }
  })
