import { z } from 'zod';

export const criarClienteSchema = z.object({
  nome: z
    .string({ required_error: 'nome e obrigatorio' })
    .min(1, 'nome nao pode ser vazio'),
  cpf_cnpj: z
    .string({ required_error: 'cpf_cnpj e obrigatorio' })
    .min(11, 'cpf_cnpj invalido')
    .max(14, 'cpf_cnpj invalido'),
  email: z.string().email('email invalido').optional(),
  cidade: z.string().optional(),
});

export type CriarClienteInput = z.infer<typeof criarClienteSchema>;
