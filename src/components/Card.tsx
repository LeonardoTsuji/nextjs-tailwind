interface ICard {
  descricao: string;
  limite: number;
  disponivel: number;
}

export default function Card({ descricao, limite, disponivel }: ICard) {
  return (
    <>
      <h3>{descricao}</h3>
      <div>
        <span>Limite</span>
        <p>{limite}</p>
      </div>
      <div>
        <span>Disponível</span>
        <p>{disponivel}</p>
      </div>
    </>
  );
}
