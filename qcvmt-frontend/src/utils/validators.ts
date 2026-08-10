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
    vesselName: z.string().min(1),
    bayStart: z.number().int().nonnegative(),
    bayEnd: z.number().int().nonnegative(),
  })
  .refine((input) => input.bayStart <= input.bayEnd, {
    message: 'bayStart must not exceed bayEnd',
    path: ['bayEnd'],
  })

const deckHoldSchema = z.enum(['DECK', 'HOLD'])

export const vesselFormSchema = z
  .object({
    vesselId: z.string().min(1, 'Vessel ID is required'),
    vesselName: z.string().min(1, 'Vessel name is required'),
    deckHold: deckHoldSchema,
    bayStart: z.number().int().nonnegative(),
    bayEnd: z.number().int().nonnegative(),
    rowStart: z.number().int().nonnegative(),
    rowEnd: z.number().int().nonnegative(),
    tierStart: z.number().int().nonnegative(),
    tierEnd: z.number().int().nonnegative(),
  })
  .superRefine((input, context) => {
    if (input.bayStart > input.bayEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'bayStart must not exceed bayEnd',
        path: ['bayEnd'],
      })
    }

    if (input.rowStart > input.rowEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'rowStart must not exceed rowEnd',
        path: ['rowEnd'],
      })
    }

    if (input.tierStart > input.tierEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'tierStart must not exceed tierEnd',
        path: ['tierEnd'],
      })
    }

    if (input.rowStart % 2 !== input.rowEnd % 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'rowStart and rowEnd must have the same odd-even parity',
        path: ['rowEnd'],
      })
    }
  })

const roleSchema = z.enum(['qcvmt-admin', 'qcvmt-user', 'qcvmt-limited'])

export const createUserSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  qcid: z.string().min(1, 'QCID is required'),
  name: z.string().min(1, 'Name is required'),
  role: roleSchema,
})

export const updateUserSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  qcid: z.string().min(1, 'QCID is required'),
  name: z.string().min(1, 'Name is required'),
  role: roleSchema,
})

export const colorSetFormSchema = z.object({
  boxCase: z.string().min(1, 'Box case is required'),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, 'Color must be a valid hex value like #12ABEF'),
  description: z.string().optional(),
})

export const vesselColorFormSchema = z
  .object({
    vesselId: z.string().min(1, 'Vessel ID is required'),
    bayStart: z.number().int().nonnegative(),
    bayEnd: z.number().int().nonnegative(),
    rowStart: z.number().int().nonnegative(),
    rowEnd: z.number().int().nonnegative(),
    tierStart: z.number().int().nonnegative(),
    tierEnd: z.number().int().nonnegative(),
    color: z
      .string()
      .regex(/^#([0-9a-fA-F]{6})$/, 'Color must be a valid hex value like #12ABEF'),
  })
  .superRefine((input, context) => {
    if (input.bayStart > input.bayEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'bayStart must not exceed bayEnd',
        path: ['bayEnd'],
      })
    }

    if (input.rowStart > input.rowEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'rowStart must not exceed rowEnd',
        path: ['rowEnd'],
      })
    }

    if (input.tierStart > input.tierEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'tierStart must not exceed tierEnd',
        path: ['tierEnd'],
      })
    }

    if (input.rowStart % 2 !== input.rowEnd % 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'rowStart and rowEnd must have the same odd-even parity',
        path: ['rowEnd'],
      })
    }
  })

export const vesselRefuelFormSchema = z.object({
  vesselId: z.string().min(1, 'Vessel ID is required'),
  isRefuel: z.boolean(),
})

export const bayConfigFormSchema = z
  .object({
    holdTiers: z.number().int().min(0, 'Hold tiers must be 0 or greater'),
    deckTiers: z.number().int().min(0, 'Deck tiers must be 0 or greater'),
  })
  .superRefine((input, context) => {
    if (input.deckTiers < input.holdTiers) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Deck tiers should be greater than or equal to hold tiers',
        path: ['deckTiers'],
      })
    }
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
