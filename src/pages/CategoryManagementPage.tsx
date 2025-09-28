import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../api/products';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import type { ProductCategory, CreateCategoryRequest } from '../types/api';

const CategoryManagementPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { executeAsync, isLoading, error, showErrorToast } = useErrorHandler();
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    isActive: true
  });

  // Load categories on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadCategories();
    }
  }, [isAuthenticated]);

  const loadCategories = async () => {
    await executeAsync(
      () => categoryAPI.getAllCategories(),
      (data) => setCategories(data)
    );
  };

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      showErrorToast('Category name is required');
      return;
    }

    await executeAsync(
      () => categoryAPI.createCategory(formData),
      (newCategory) => {
        setCategories([...categories, newCategory]);
        setFormData({ name: '', description: '', isActive: true });
        setIsCreating(false);
        showErrorToast('Category created successfully', 'SUCCESS' as any);
      }
    );
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !formData.name.trim()) {
      showErrorToast('Category name is required');
      return;
    }

    await executeAsync(
      () => categoryAPI.updateCategory(editingCategory.id, formData),
      (updatedCategory) => {
        setCategories(categories.map(cat => 
          cat.id === updatedCategory.id ? updatedCategory : cat
        ));
        setEditingCategory(null);
        setFormData({ name: '', description: '', isActive: true });
        showErrorToast('Category updated successfully', 'SUCCESS' as any);
      }
    );
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    await executeAsync(
      () => categoryAPI.deleteCategory(categoryId),
      () => {
        setCategories(categories.filter(cat => cat.id !== categoryId));
        showErrorToast('Category deleted successfully', 'SUCCESS' as any);
      }
    );
  };

  const startEditing = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: true // Default value since ProductCategory doesn't have isActive
    });
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({ name: '', description: '', isActive: true });
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setFormData({ name: '', description: '', isActive: true });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-gray-600">You need to be logged in to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <Button onClick={startCreating} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error.message}</p>
          </div>
        )}

        {/* Create/Edit Form */}
        {(isCreating || editingCategory) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {isCreating ? 'Create New Category' : 'Edit Category'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Category Name *</Label>
                <Input
                  id="categoryName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              
              <div>
                <Label htmlFor="categoryDescription">Description</Label>
                <Input
                  id="categoryDescription"
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="categoryActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                  title="Set category as active"
                />
                <Label htmlFor="categoryActive">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={isCreating ? handleCreateCategory : handleUpdateCategory}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isCreating ? 'Create' : 'Update'}
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEditing}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories List */}
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(category)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No categories */}
        {categories.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first category.</p>
            <Button onClick={startCreating} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLoading && categories.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagementPage;