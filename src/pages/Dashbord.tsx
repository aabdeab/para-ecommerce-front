import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { productAPI, categoryAPI } from '../api/products';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { 
  Plus, 
  Package, 
  Tags, 
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import type { Product, ProductCategory, ProductRequest } from '../types/api';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { executeAsync, isLoading, error } = useErrorHandler();

  // Dashboard data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0,
    lowStockProducts: 0
  });

  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories'>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  // Form data
  const [productForm, setProductForm] = useState<ProductRequest>({
    name: '',
    description: '',
    brand: '',
    price: 0,
    withDiscount: false,
    discountPrice: 0,
    sku: '',
    isVisible: true,
    productStatus: 'ACTIVE',
    imageUrl: '',
    category: '',
    initialStock: 0
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    isActive: true
  });

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/Auth');
      return;
    }

    // Check if user has admin role (you might need to adjust this based on your JWT structure)
    const hasAdminRole = user?.roles?.includes('ADMIN') || user?.role === 'ADMIN';
    if (!hasAdminRole) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          executeAsync(() => productAPI.getAllProducts({ page: 0, size: 100 })),
          executeAsync(() => categoryAPI.getAllCategories())
        ]);

        if (productsResponse) {
          setProducts(productsResponse.content);
          setStats(prev => ({
            ...prev,
            totalProducts: productsResponse.content.length,
            activeProducts: productsResponse.content.filter(p => p.productStatus === 'ACTIVE').length
          }));
        }

        if (categoriesResponse) {
          setCategories(categoriesResponse);
          setStats(prev => ({
            ...prev,
            totalCategories: categoriesResponse.length
          }));
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, executeAsync]);

  // Form validation
  const validateProductForm = () => {
    const errors = [];
    if (!productForm.name.trim()) errors.push('Product name is required');
    if (!productForm.category) errors.push('Category is required');
    if (!productForm.sku.trim()) errors.push('SKU is required');
    if (productForm.price <= 0) errors.push('Price must be greater than 0');
    if (productForm.withDiscount && productForm.discountPrice && productForm.discountPrice >= productForm.price) {
      errors.push('Discount price must be less than regular price');
    }
    return errors;
  };

  // Product form handlers
  const handleCreateProduct = async () => {
    const validationErrors = validateProductForm();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n• ' + validationErrors.join('\n• '));
      return;
    }

    console.log('Creating product with data:', productForm);

    try {
      await executeAsync(
        () => productAPI.createProduct(productForm),
        (newProduct) => {
          console.log('Product created successfully:', newProduct);
          setProducts(prev => [...prev, newProduct]);
          setShowProductForm(false);
          resetProductForm();
          setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
          alert('Product created successfully!');
        }
      );
    } catch (err) {
      console.error('Failed to create product:', err);
      alert('Failed to create product. Please check the console for more details.');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    const validationErrors = validateProductForm();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n• ' + validationErrors.join('\n• '));
      return;
    }

    console.log('Updating product with data:', productForm);

    try {
      await executeAsync(
        () => productAPI.updateProduct(editingProduct.productId, productForm),
        (updatedProduct) => {
          console.log('Product updated successfully:', updatedProduct);
          setProducts(prev => prev.map(p => p.productId === updatedProduct.productId ? updatedProduct : p));
          setEditingProduct(null);
          setShowProductForm(false);
          resetProductForm();
          alert('Product updated successfully!');
        }
      );
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product. Please check the console for more details.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    await executeAsync(
      () => productAPI.deleteProduct(productId),
      () => {
        setProducts(prev => prev.filter(p => p.productId !== productId));
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
      }
    );
  };

  // Category form handlers
  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) return;

    await executeAsync(
      () => categoryAPI.createCategory(categoryForm),
      (newCategory) => {
        setCategories(prev => [...prev, newCategory]);
        setShowCategoryForm(false);
        resetCategoryForm();
        setStats(prev => ({ ...prev, totalCategories: prev.totalCategories + 1 }));
      }
    );
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !categoryForm.name.trim()) return;

    await executeAsync(
      () => categoryAPI.updateCategory(editingCategory.id, categoryForm),
      (updatedCategory) => {
        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
        setEditingCategory(null);
        setShowCategoryForm(false);
        resetCategoryForm();
      }
    );
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    await executeAsync(
      () => categoryAPI.deleteCategory(categoryId),
      () => {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        setStats(prev => ({ ...prev, totalCategories: prev.totalCategories - 1 }));
      }
    );
  };

  // Form reset functions
  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      brand: '',
      price: 0,
      withDiscount: false,
      discountPrice: 0,
      sku: '',
      isVisible: true,
      productStatus: 'ACTIVE',
      imageUrl: '',
      category: '',
      initialStock: 0
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      isActive: true
    });
  };

  // Start editing functions
  const startEditingProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      brand: product.brand || '',
      price: product.price,
      withDiscount: product.withDiscount,
      discountPrice: product.discountPrice || 0,
      sku: product.sku,
      isVisible: product.isVisible,
      productStatus: product.productStatus,
      imageUrl: product.imageUrl || '',
      category: product.category?.name || '',
      initialStock: 0
    });
    setShowProductForm(true);
  };

  const startEditingCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      isActive: true // Default since ProductCategory doesn't have isActive in our type
    });
    setShowCategoryForm(true);
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg opacity-90">Manage your parapharmacy products and categories</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 mb-8 w-fit shadow-md border border-gray-100">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'overview' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Package className="inline mr-2" size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'products' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Package className="inline mr-2" size={16} />
            Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'categories' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Tags className="inline mr-2" size={16} />
            Categories
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-red-800 font-semibold">Error</h4>
                <p className="text-red-700 text-sm mt-1">{typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        )}



        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
                    </div>
                    <Package className="text-blue-500" size={40} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Categories</p>
                      <p className="text-3xl font-bold text-green-600">{stats.totalCategories}</p>
                    </div>
                    <Tags className="text-green-500" size={40} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Products</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.activeProducts}</p>
                    </div>
                    <TrendingUp className="text-purple-500" size={40} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Low Stock</p>
                      <p className="text-3xl font-bold text-orange-600">{stats.lowStockProducts}</p>
                    </div>
                    <AlertCircle className="text-orange-500" size={40} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => {
                      setActiveTab('products');
                      setShowProductForm(true);
                      resetProductForm();
                    }}
                    variant="default"
                    size="lg"
                  >
                    <Plus size={20} className="mr-2" />
                    Add New Product
                  </Button>
                  <Button 
                    onClick={() => {
                      setActiveTab('categories');
                      setShowCategoryForm(true);
                      resetCategoryForm();
                    }}
                    variant="success"
                    size="lg"
                  >
                    <Plus size={20} className="mr-2" />
                    Add New Category
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/products')}
                  >
                    <Eye size={20} className="mr-2" />
                    View Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products Management</h2>
              <Button 
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                  resetProductForm();
                }}
                variant="default"
                size="lg"
              >
                <Plus size={20} className="mr-2" />
                Add Product
              </Button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center justify-between">
                    {editingProduct ? 'Edit Product' : 'Create New Product'}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        resetProductForm();
                      }}
                    >
                      <X size={18} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName" className="text-gray-700 font-medium">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="productName"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Hydrating Face Serum"
                        className={`mt-1 ${!productForm.name.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productBrand">Brand</Label>
                      <Input
                        id="productBrand"
                        value={productForm.brand}
                        onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                        placeholder="e.g., CeraVe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productPrice" className="text-gray-700 font-medium">
                        Price <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="productPrice"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="29.99"
                        className={`mt-1 ${productForm.price <= 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productSku" className="text-gray-700 font-medium">
                        SKU <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="productSku"
                        value={productForm.sku}
                        onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="CER-001"
                        className={`mt-1 ${!productForm.sku.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productCategory" className="text-gray-700 font-medium">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="productCategory"
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 mt-1 ${
                          !productForm.category 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                        aria-label="Product Category"
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="productStock">Initial Stock</Label>
                      <Input
                        id="productStock"
                        type="number"
                        value={productForm.initialStock}
                        onChange={(e) => setProductForm(prev => ({ ...prev, initialStock: parseInt(e.target.value) || 0 }))}
                        placeholder="100"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="productDescription">Description</Label>
                      <textarea
                        id="productDescription"
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Anti-aging hyaluronic acid serum for deep hydration..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="productImage">Image URL</Label>
                      <Input
                        id="productImage"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="productDiscount"
                        checked={productForm.withDiscount}
                        onChange={(e) => setProductForm(prev => ({ ...prev, withDiscount: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label="Has Discount"
                      />
                      <Label htmlFor="productDiscount">Has Discount</Label>
                    </div>
                    {productForm.withDiscount && (
                      <div>
                        <Label htmlFor="discountPrice">Discount Price</Label>
                        <Input
                          id="discountPrice"
                          type="number"
                          step="0.01"
                          value={productForm.discountPrice}
                          onChange={(e) => setProductForm(prev => ({ ...prev, discountPrice: parseFloat(e.target.value) || 0 }))}
                          placeholder="24.99"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        resetProductForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                      disabled={isLoading}
                      variant="default"
                    >
                      <Save size={18} className="mr-2" />
                      {editingProduct ? 'Update' : 'Create'} Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.productId}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&h=80&fit=crop&crop=center"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-gray-600">{product.brand} • {product.category?.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-blue-600">
                              ${product.withDiscount && product.discountPrice ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                            </span>
                            {product.withDiscount && product.discountPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.productStatus === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.productStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingProduct(product)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.productId)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Categories Management</h2>
              <Button 
                onClick={() => {
                  setShowCategoryForm(true);
                  setEditingCategory(null);
                  resetCategoryForm();
                }}
                variant="success"
                size="lg"
              >
                <Plus size={20} className="mr-2" />
                Add Category
              </Button>
            </div>

            {/* Category Form Modal */}
            {showCategoryForm && (
              <Card className="border-2 border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center justify-between">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                        resetCategoryForm();
                      }}
                    >
                      <X size={18} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name *</Label>
                      <Input
                        id="categoryName"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Skin Care"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryDescription">Description</Label>
                      <textarea
                        id="categoryDescription"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        placeholder="Face and body skincare products"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                        resetCategoryForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                      disabled={isLoading}
                      variant="success"
                    >
                      <Save size={18} className="mr-2" />
                      {editingCategory ? 'Update' : 'Create'} Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories List */}
            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-gray-600">{category.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Created: {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingCategory(category)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
