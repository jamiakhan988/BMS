import React, { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, CreditCard, Smartphone, Banknote, Search, X, FileText, Printer } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export function POSSystem() {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Laptop Dell XPS 13', price: 85000, stock: 15, category: 'Electronics' },
    { id: '2', name: 'iPhone 15 Pro', price: 134900, stock: 8, category: 'Electronics' },
    { id: '3', name: 'Samsung Galaxy S24', price: 79999, stock: 12, category: 'Electronics' },
    { id: '4', name: 'MacBook Air M2', price: 114900, stock: 6, category: 'Electronics' },
    { id: '5', name: 'iPad Pro 12.9"', price: 112900, stock: 10, category: 'Electronics' },
    { id: '6', name: 'AirPods Pro', price: 24900, stock: 25, category: 'Electronics' },
    { id: '7', name: 'Nike Air Max', price: 8999, stock: 30, category: 'Footwear' },
    { id: '8', name: 'Adidas Ultraboost', price: 12999, stock: 20, category: 'Footwear' },
    { id: '9', name: 'Coffee Beans 1kg', price: 899, stock: 50, category: 'Food' },
    { id: '10', name: 'Green Tea Pack', price: 299, stock: 100, category: 'Food' },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(18);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { product, quantity: 1, discount: 0 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && quantity <= product.stock) {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const updateItemDiscount = (productId: string, discount: number) => {
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, discount: Math.max(0, Math.min(100, discount)) }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.product.price * item.quantity;
      const itemDiscount = (itemTotal * item.discount) / 100;
      return sum + (itemTotal - itemDiscount);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const globalDiscount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - globalDiscount;
    const taxAmount = (afterDiscount * tax) / 100;
    return afterDiscount + taxAmount;
  };

  const processSale = () => {
    if (cart.length === 0) return;

    const subtotal = calculateSubtotal();
    const globalDiscount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - globalDiscount;
    const taxAmount = (afterDiscount * tax) / 100;
    const total = afterDiscount + taxAmount;

    const saleData = {
      id: Date.now().toString(),
      items: cart,
      subtotal,
      discount_amount: globalDiscount,
      tax_amount: taxAmount,
      total_amount: total,
      customer_name: customerName,
      customer_phone: customerPhone,
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
    };

    setLastSale(saleData);
    setShowReceipt(true);
    clearCart();
  };

  const paymentIcons = {
    cash: Banknote,
    card: CreditCard,
    upi: Smartphone,
  };

  return (
    <div className="h-full flex">
      {/* Products Section */}
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Point of Sale</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {product.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart ({cart.length})
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold text-sm">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-xs text-gray-600">Discount %:</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount}
                      onChange={(e) => updateItemDiscount(item.product.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Customer Info */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Customer Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="tel"
                placeholder="Customer Phone (Optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            {/* Discount and Tax */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Discount %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Tax %</label>
                <input
                  type="number"
                  min="0"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(['cash', 'card', 'upi'] as const).map(method => {
                  const Icon = paymentIcons[method];
                  return (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2 rounded-lg border-2 flex flex-col items-center space-y-1 transition-colors ${
                        paymentMethod === method
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs capitalize">{method}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount ({discount}%):</span>
                  <span>-₹{((calculateSubtotal() * discount) / 100).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax ({tax}%):</span>
                <span>₹{(((calculateSubtotal() - (calculateSubtotal() * discount) / 100) * tax) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={clearCart}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={processSale}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Complete Sale
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Receipt</h2>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="text-center border-b pb-4">
                <h3 className="font-bold text-lg">Your Business Name</h3>
                <p className="text-gray-600">Sale Receipt</p>
                <p className="text-gray-500">#{lastSale.id.slice(-8)}</p>
                <p className="text-gray-500">{new Date(lastSale.created_at).toLocaleString()}</p>
              </div>

              {lastSale.customer_name && (
                <div>
                  <p><strong>Customer:</strong> {lastSale.customer_name}</p>
                  {lastSale.customer_phone && (
                    <p><strong>Phone:</strong> {lastSale.customer_phone}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {lastSale.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-500">{item.quantity} × ₹{item.product.price.toLocaleString()}</p>
                    </div>
                    <p>₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{lastSale.subtotal.toLocaleString()}</span>
                </div>
                {lastSale.discount_amount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-₹{lastSale.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{lastSale.tax_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{lastSale.total_amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-center text-gray-500 border-t pt-4">
                <p>Payment Method: {lastSale.payment_method.toUpperCase()}</p>
                <p className="mt-2">Thank you for your business!</p>
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Printer className="h-4 w-4 mr-2 inline" />
                Print
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}