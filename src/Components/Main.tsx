import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Plus, Heart, Star, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  oldPrice?: number; // Added oldPrice property
}

const Main: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isGridView, setIsGridView] = useState(true);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Hydrating Face Serum",
        description:
          "Deeply hydrating serum for daily use, suitable for all skin types.",
        price: 29.99,
        category: "Skin Care",
        brand: "AquaGlow",
        rating: 4.8,
        image:
          "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80", // serum bottle
        isBestSeller: true,
      },
      {
        id: 2,
        name: "Gentle Cleansing Foam",
        description: "Mild foaming cleanser for sensitive skin.",
        price: 19.99,
        category: "Cleansers",
        brand: "PureSkin",
        rating: 4.7,
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", // foam bottle
        isNew: true,
      },
      {
        id: 3,
        name: "SPF 50+ Sun Cream",
        description: "High protection sunscreen for face and body.",
        price: 24.99,
        category: "Sun Care",
        brand: "SunGuard",
        rating: 4.9,
        image:
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", // sunscreen tube
      },
      {
        id: 4,
        name: "Nourishing Night Cream",
        description: "Rich night cream for skin regeneration.",
        price: 34.99,
        category: "Skin Care",
        brand: "DermaLux",
        rating: 4.8,
        image:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80", // cream jar
      },
      {
        id: 5,
        name: "Micellar Water",
        description: "Gentle makeup remover and cleanser.",
        price: 15.99,
        category: "Cleansers",
        brand: "BioClean",
        rating: 4.7,
        image:
          "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80", // clear bottle
      },
      {
        id: 6,
        name: "Baby Moisturizing Lotion",
        description: "Hypoallergenic lotion for delicate baby skin.",
        price: 12.99,
        category: "Baby Care",
        brand: "BabySoft",
        rating: 4.9,
        image:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", // baby lotion bottle
      },
      {
        id: 7,
        name: "Anti-Aging Eye Cream",
        description: "Reduces puffiness and dark circles.",
        price: 27.99,
        category: "Skin Care",
        brand: "YouthfulEyes",
        rating: 4.6,
        image:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80", // eye cream tube
      },
      {
        id: 8,
        name: "Thermal Spring Water Spray",
        description: "Soothes and refreshes sensitive skin.",
        price: 18.99,
        category: "Skin Care",
        brand: "Avene",
        rating: 4.7,
        image:
          "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80", // spray bottle
      },
    ];
    setProducts(mockProducts);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Your Health & Beauty
            <span className="text-blue-600"> Destination</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium skincare, baby care, and wellness products curated
            just for you.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {["all", "skincare", "babycare", "wellness"].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div
          className={`grid ${
            isGridView
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          } gap-8`}
        >
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="product-card-hover"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden">
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="glass-effect px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Sparkles className="w-4 h-4" /> New
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="glass-effect px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" /> Best Seller
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 right-4 p-2 rounded-full glass-effect"
                      title={`Mark ${product.name} as favorite`}
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${
                          favorites.includes(product.id)
                            ? "fill-rose-500 stroke-rose-500"
                            : "stroke-gray-700"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-600 animated-underline">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                        <span className="text-sm font-medium">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Button
                        onClick={() => addToCart({ ...product, quantity: 1 })}
                        className="group hover:scale-105 transition-transform"
                      >
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Main;
