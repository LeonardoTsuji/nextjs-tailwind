export interface ICartao {
  id: number;
  descricao: string;
  limite: number;
  dataFechamento: number;
  dataVencimento: number;
  ativo: boolean;
}
