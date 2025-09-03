import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const Main: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Vitamin C",
        description: "Boosts immunity and skin health.",
        price: 12.99,
        image:
          ""
      },
      {
        id: 2,
        name: "Omega-3 Capsules",
        description: "Supports heart and brain health.",
        price: 19.99,
        image:
          ""
      },
      {
        id: 3,
        name: "Calcium Tablets",
        description: "Strengthens bones and teeth.",
        price: 9.99,
        image:
          ""
      }
    ];
    setProducts(mockProducts);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow p-4 bg-white"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-base font-bold mt-2">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
