import Card from '@/components/Card';
import api from '@/utils/http';
import { ICartao } from './models/ICartao';

export default async function Cartoes() {
  const buscarCartoes = async () => {
    try {
      const reponse = await api.get<ICartao[]>('/cartao', {
        headers: {
          Authorization: 'valid_token',
        },
      });

      return reponse.data;
    } catch (error) {
      console.log(error);
    }
  };
  const data = await buscarCartoes();
  return (
    <>
      {data?.map((cartao) => (
        <Card
          key={cartao.id}
          descricao={cartao.descricao}
          disponivel={cartao.limite}
          limite={cartao.limite}
        />
      ))}
    </>
  );
}
