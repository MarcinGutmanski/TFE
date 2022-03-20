import data from './data';

function App() {
  return (
    <div>
      <header className="App-header">
        <a href="/">Creamates</a>
      </header>
      <main>
        <h1>List of Products</h1>
        <div className="products">
          {data.products.map((product) => (
            <div className="product" key={product.name}>
              <a href={`/product/${product.name}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <div className="product-info">
                <a href={`/product/${product.name}`}>
                  <p>{product.name}</p>
                </a>
                <p>
                  <strong>{product.price}€</strong>
                </p>
                <button>Add to basket</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
