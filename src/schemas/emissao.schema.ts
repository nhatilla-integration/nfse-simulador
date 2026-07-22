import { z } from 'zod';

export const criarEmissaoSchema = z.object({
  clienteId: z
    .number({ required_error: 'clienteId e obrigatorio', invalid_type_error: 'clienteId deve ser um numero' })
    .int('clienteId deve ser um numero inteiro')
    .positive('clienteId deve ser positivo'),
  valor: z
    .number({ required_error: 'valor e obrigatorio', invalid_type_error: 'valor deve ser um numero' })
    .positive('valor deve ser maior que zero'),
});

export type CriarEmissaoInput = z.infer<typeof criarEmissaoSchema>;
