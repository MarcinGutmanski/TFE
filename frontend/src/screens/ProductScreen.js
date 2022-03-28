import { useParams } from 'react-router-dom';

function ProductScreen() {
  const params = useParams();
  const { name } = params;
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
}

export default ProductScreen;
