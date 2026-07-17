import mongoose, { Schema } from 'mongoose';

// Aqui esta o motivo pratico de usar MongoDB nesse projeto:
// cada emissao pode ter um formato de retorno diferente.
// Uma nota autorizada tem uns campos, uma rejeitada tem outros
// (codigo de erro, motivo, campo que causou o problema).
// Forcar isso numa tabela relacional rigida geraria muitas colunas
// vazias ou um monte de tabelas extras. Documento resolve melhor.

const EmissaoSchema = new Schema(
  {
    clienteId: { type: Number, required: true }, // referencia ao id do Postgres
    status: {
      type: String,
      enum: ['autorizada', 'rejeitada', 'cancelada', 'denegada'],
      required: true,
    },
    valor: { type: Number, required: true },
    detalhes: { type: Schema.Types.Mixed }, // formato livre: motivo de erro, codigo, etc.
  },
  { timestamps: true } // cria createdAt/updatedAt automaticamente
);

export const Emissao = mongoose.model('Emissao', EmissaoSchema);
