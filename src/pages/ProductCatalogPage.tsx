import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Search, ShoppingCart, Star, Heart, ArrowLeft, Grid, List } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { productAPI, categoryAPI } from '../api/products';
import { useErrorHandler } from '../hooks/useErrorHandler';
import type { Product, ProductCategory } from '../types/api';

const ProductCatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { executeAsync, isLoading, error } = useErrorHandler();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('category') ? parseInt(searchParams.get('category')!) : null
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState<number[]>([]);

  // Mock parapharmacy products with real images from Unsplash
  const mockProducts: Product[] = [
    {
      productId: 1,
      name: "Hydrating Face Serum",
      description: "Anti-aging hyaluronic acid serum for deep hydration and smooth skin",
      brand: "CeraVe",
      price: 29.99,
      withDiscount: false,
      sku: "CER-001",
      isVisible: true,
      productStatus: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop&crop=center",
      category: { id: 1, name: "Skin Care", description: "Face and body skincare products", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString()
    },
    {
      productId: 2,
      name: "Vitamin C Tablets",
      description: "High-potency vitamin C supplements for immune system support - 1000mg",
      brand: "Nature's Way",
      price: 15.99,
      withDiscount: true,
      discountPrice: 12.99,
      sku: "VIT-C-001",
      isVisible: true,
      productStatus: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&crop=center",
      category: { id: 2, name: "Vitamins & Supplements", description: "Health supplements and vitamins", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString()
    },
    {
      productId: 3,
      name: "Moisturizing Body Lotion",
      description: "Nourishing body lotion with shea butter for dry and sensitive skin",
      brand: "Nivea",
      price: 8.99,
      withDiscount: false,
      sku: "NIV-002",
      isVisible: true,
      productStatus: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop&crop=center",
      category: { id: 1, name: "Skin Care", description: "Face and body skincare products", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString()
    },
    {
      productId: 4,
      name: "Omega-3 Fish Oil",
      description: "Pure fish oil capsules rich in EPA and DHA for heart and brain health",
      brand: "Nordic Naturals",
      price: 24.99,
      withDiscount: false,
      sku: "OMG-001",
      isVisible: true,
      productStatus: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
      category: { id: 2, name: "Vitamins & Supplements", description: "Health supplements and vitamins", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString()
    },
    {
      productId: 5,
      name: "Anti-Dandruff Shampoo",
      description: "Therapeutic shampoo for dandruff control and scalp care",
      brand: "Head & Shoulders",
      price: 12.99,
      withDiscount: true,
      discountPrice: 9.99,
      sku: "HAS-001",
      isVisible: true,
      productStatus: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop&crop=center",
      category: { id: 3, name: "Hair Care", description: "Shampoos, conditioners and hair treatments", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString()
    },
    {
      productId: 6,
      name: "Sunscreen SPF 50+",
      description: "Broad-spectrum sunscreen for maximum UV protection",
      brand: "La Roche-Posay",
      price: 18.99,
      withDiscount: false,
      sku: "LRP-001",
      isVisible: true,
      productStatus: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop&crop=center",
      category: { id: 1, name: "Skin Care", description: "Face and body skincare products", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString()
    },
    {
      productId: 7,
      name: "Probiotic Supplements",
      description: "Multi-strain probiotics for digestive health and immune support",
      brand: "Garden of Life",
      price: 34.99,
      withDiscount: false,
      sku: "PRB-001",
      isVisible: true,
      productStatus: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop&crop=center",
      category: { id: 2, name: "Vitamins & Supplements", description: "Health supplements and vitamins", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString()
    },
    {
      productId: 8,
      name: "Baby Gentle Lotion",
      description: "Hypoallergenic baby lotion for sensitive skin, pediatrician tested",
      brand: "Johnson's",
      price: 6.99,
      withDiscount: false,
      sku: "JOH-001",
      isVisible: true,
      productStatus: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop&crop=center",
      category: { id: 4, name: "Baby Care", description: "Baby skincare and healthcare products", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString()
    }
  ];

  // Load products and categories from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from API first, fallback to mock data
        const [productsData, categoriesData] = await Promise.all([
          executeAsync(() => productAPI.getAllProducts({ page: 0, size: 50 })),
          executeAsync(() => categoryAPI.getAllCategories())
        ]);
        
        if (productsData) {
          // Normalize products to ensure they have categories
          const normalizedProducts = productsData.content.map(product => ({
            ...product,
            category: product.category || { id: 0, name: "Uncategorized", description: "No category assigned", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          }));
          setProducts(normalizedProducts);
        } else {
          // Fallback to mock data if API fails
          setProducts(mockProducts);
        }
        
        if (categoriesData) {
          setCategories(categoriesData);
        } else {
          // Fallback to mock categories
          const mockCategories: ProductCategory[] = [
            { id: 1, name: "Skin Care", description: "Face and body skincare products", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, name: "Vitamins & Supplements", description: "Health supplements and vitamins", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 3, name: "Hair Care", description: "Shampoos, conditioners and hair treatments", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 4, name: "Baby Care", description: "Baby skincare and healthcare products", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setCategories(mockCategories);
        }
      } catch (err) {
        // Fallback to mock data on error
        setProducts(mockProducts);
        const mockCategories: ProductCategory[] = [
          { id: 1, name: "Skin Care", description: "Face and body skincare products", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 2, name: "Vitamins & Supplements", description: "Health supplements and vitamins", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 3, name: "Hair Care", description: "Shampoos, conditioners and hair treatments", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 4, name: "Baby Care", description: "Baby skincare and healthcare products", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ];
        setCategories(mockCategories);
      }
    };

    loadData();
  }, [executeAsync]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || (product.category && product.category.id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link to="/" className="flex items-center text-white hover:text-gray-200 transition-colors mr-4">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Health & Beauty Products</h1>
          <p className="text-xl opacity-90">Quality parapharmacy products for your health and wellness</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="whitespace-nowrap"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Sort and View Options */}
            <div className="flex gap-2 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sort products"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
            {selectedCategory && (
              <span className="ml-2 text-blue-600">
                in {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error.message}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {sortedProducts.map((product) => (
              <Card key={product.productId} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={product.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop&crop=center"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => toggleFavorite(product.productId)}
                    >
                      <Heart 
                        size={16} 
                        className={favorites.includes(product.productId) ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    </Button>
                  </div>
                  {product.withDiscount && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                        Sale
                      </span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                  
                  {product.brand && (
                    <p className="text-sm text-blue-600 font-medium mb-1">{product.brand}</p>
                  )}
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      SKU: {product.sku}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.withDiscount && product.discountPrice ? (
                        <>
                          <div className="text-2xl font-bold text-green-600">
                            ${product.discountPrice.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </div>
                        </>
                      ) : (
                        <div className="text-2xl font-bold text-blue-600">
                          ${product.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                      <ShoppingCart size={16} />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Products Found */}
        {sortedProducts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductCatalogPage;