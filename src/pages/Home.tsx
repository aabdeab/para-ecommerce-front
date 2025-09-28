import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Button } from '../Components/ui/button';

const Home: React.FC = () => {
    const featuredProducts = [
        {
            id: 1,
            name: "Hydrating Face Serum",
            price: 29.99,
            image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center"
        },
        {
            id: 2,
            name: "Vitamin C Supplements",
            price: 15.99,
            image: "https://images.unsplash.com/photo-1584308666744-24d5c4742ae?w=300&h=300&fit=crop&crop=center"
        },
        {
            id: 3,
            name: "Sunscreen SPF 50+",
            price: 18.99,
            image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop&crop=center"
        }
    ];

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            
            {/* Hero Section */}
            <main className="flex-grow">
                <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Welcome to <span className="text-yellow-300">ParaPharmacy</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
                            Your trusted parapharmacy for health, beauty, and wellness products. Quality care for your whole family.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/products">
                                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold flex items-center gap-2">
                                    <ShoppingBag size={20} />
                                    Shop Now
                                    <ArrowRight size={20} />
                                </Button>
                            </Link>
                            <Link to="/Auth">
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold">
                                    Sign Up & Save 20%
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="text-blue-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Health & Beauty</h3>
                                <p className="text-gray-600">Premium skincare, vitamins, and wellness products</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="text-green-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Pharmacy Quality</h3>
                                <p className="text-gray-600">Professional-grade products from trusted brands</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="text-purple-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Family Care</h3>
                                <p className="text-gray-600">Products for the whole family's health and wellness</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Products Preview */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
                            <p className="text-gray-600 text-lg">Check out our most popular items</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8 mb-8">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                        <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center">
                            <Link to="/products">
                                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold flex items-center gap-2 mx-auto">
                                    View All Products
                                    <ArrowRight size={20} />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gray-900 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
                        <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers today!</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/products">
                                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold">
                                    Browse Products
                                </Button>
                            </Link>
                            <Link to="/Signup">
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold">
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
};

export default Home;