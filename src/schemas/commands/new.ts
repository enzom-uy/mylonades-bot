import { z, ZodError, ZodSchema } from 'zod'

interface Inputs {
  título: string
  descripción?: string | null
  gfycat_url: string
}

export const cmdNewSchema: ZodSchema<Inputs> = z.object({
  título: z.string(),
  descripcion: z.string().optional().nullish(),
  gfycat_url: z.string().url().startsWith('https://gfycat.com/')
})

export const validateInputs = (
  inputs: Inputs
): { errorMessage: string[] | undefined; success: boolean } => {
  let errorMessage
  let success
  try {
    cmdNewSchema.parse(inputs)
    success = true
  } catch (error) {
    const zodError = error as ZodError
    errorMessage = zodError.errors.map(e => e.message)
    success = false
  }

  return { errorMessage, success }
}
