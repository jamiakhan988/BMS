import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, CreditCard, Smartphone, Banknote, Search, X, FileText, Printer } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useBusiness } from '../../hooks/useBusiness';
import { generateReceiptPDF } from '../Reports/PDFGenerator';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  category: string | null;
  sku: string | null;
}

interface Branch {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export function POSSystem() {
  const { business } = useBusiness();
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(18);
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);

  useEffect(() => {
    if (business) {
      fetchBranches();
      fetchEmployees();
    }
  }, [business]);

  useEffect(() => {
    if (selectedBranch) {
      fetchProducts();
    }
  }, [selectedBranch]);

  const fetchBranches = async () => {
    if (!business) return;

    const { data } = await supabase
      .from('branches')
      .select('id, name')
      .eq('business_id', business.id)
      .eq('is_active', true);

    setBranches(data || []);
    if (data && data.length > 0) {
      setSelectedBranch(data[0].id);
    }
  };

  const fetchEmployees = async () => {
    if (!business) return;

    const { data } = await supabase
      .from('employees')
      .select('id, name')
      .eq('business_id', business.id)
      .eq('is_active', true);

    setEmployees(data || []);
  };

  const fetchProducts = async () => {
    if (!business || !selectedBranch) return;

    const { data } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, category, sku')
      .eq('business_id', business.id)
      .or(`branch_id.eq.${selectedBranch},branch_id.is.null`)
      .eq('is_active', true)
      .gt('stock_quantity', 0);

    setProducts(data || []);
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock_quantity) {
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
    if (product && quantity <= product.stock_quantity) {
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

  const processSale = async () => {
    if (cart.length === 0 || !selectedBranch) return;

    setLoading(true);

    try {
      const subtotal = calculateSubtotal();
      const globalDiscount = (subtotal * discount) / 100;
      const afterDiscount = subtotal - globalDiscount;
      const taxAmount = (afterDiscount * tax) / 100;
      const total = afterDiscount + taxAmount;

      // Create sale record
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([
          {
            business_id: business!.id,
            branch_id: selectedBranch,
            employee_id: selectedEmployee || null,
            customer_name: customerName || null,
            customer_phone: customerPhone || null,
            subtotal,
            tax_amount: taxAmount,
            discount_amount: globalDiscount,
            total_amount: total,
            payment_method: paymentMethod,
            payment_status: 'completed',
          }
        ])
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      const saleItems = cart.map(item => ({
        sale_id: saleData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        discount_amount: (item.product.price * item.quantity * item.discount) / 100,
        total_price: (item.product.price * item.quantity) - ((item.product.price * item.quantity * item.discount) / 100),
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of cart) {
        await supabase
          .from('products')
          .update({
            stock_quantity: item.product.stock_quantity - item.quantity
          })
          .eq('id', item.product.id);
      }

      setLastSale({
        ...saleData,
        items: cart.map(item => ({
          ...item,
          total_price: (item.product.price * item.quantity) - ((item.product.price * item.quantity * item.discount) / 100)
        })),
        tax_amount: taxAmount,
        discount_amount: globalDiscount,
      });

      setShowReceipt(true);
      clearCart();
      fetchProducts(); // Refresh products to show updated stock
      toast.success('Sale completed successfully!');

    } catch (error) {
      console.error('Error processing sale:', error);
      toast.error('Failed to process sale');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const downloadReceiptPDF = async () => {
    if (!lastSale) return;
    
    try {
      await generateReceiptPDF(lastSale, business);
      toast.success('Receipt PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate receipt PDF');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>

            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Employee (Optional)</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              {product.sku && (
                <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
              </div>
              {product.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {product.category}
                </span>
              )}
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
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
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
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold">₹{item.product.price * item.quantity}</span>
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
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount ({discount}%):</span>
                  <span>-₹{((calculateSubtotal() * discount) / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax ({tax}%):</span>
                <span>₹{(((calculateSubtotal() - (calculateSubtotal() * discount) / 100) * tax) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
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
                disabled={loading || !selectedBranch}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Complete Sale'}
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
                <h3 className="font-bold text-lg">{business?.name}</h3>
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
                      <p className="text-gray-500">{item.quantity} × ₹{item.product.price}</p>
                    </div>
                    <p>₹{item.total_price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{lastSale.subtotal.toFixed(2)}</span>
                </div>
                {lastSale.discount_amount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-₹{lastSale.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{lastSale.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{lastSale.total_amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-gray-500 border-t pt-4">
                <p>Payment Method: {lastSale.payment_method.toUpperCase()}</p>
                <p className="mt-2">Thank you for your business!</p>
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <button
                onClick={printReceipt}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Printer className="h-4 w-4 mr-2 inline" />
                Print
              </button>
              <button
                onClick={downloadReceiptPDF}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <FileText className="h-4 w-4 mr-2 inline" />
                PDF
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