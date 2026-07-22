import { z } from 'zod';

export const criarEmissaoSchema = z.object({
  clienteId: z.number().int('clienteId deve ser um numero inteiro').positive('clienteId deve ser positivo'),
  valor: z.number().positive('valor deve ser maior que zero'),
});

export type CriarEmissaoInput = z.infer<typeof criarEmissaoSchema>;
