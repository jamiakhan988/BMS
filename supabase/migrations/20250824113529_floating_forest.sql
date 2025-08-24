/*
  # Complete Business Management System Database Schema

  1. New Tables
    - `users` - User profiles with business relationship
    - `businesses` - Business information
    - `branches` - Business branches
    - `products` - Inventory products
    - `employees` - Employee management
    - `sales` - Sales transactions
    - `sale_items` - Individual sale items
    - `notifications` - System notifications
    - `messages` - Employee messaging system
    - `employee_profiles` - Extended employee profiles

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Secure user data isolation

  3. Functions
    - Updated timestamp triggers
    - Notification triggers
    - Stock update triggers
*/

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  avatar_url text,
  is_business_owner boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  logo text,
  address text,
  phone text,
  email text,
  website text,
  tax_number text,
  currency text DEFAULT 'INR',
  timezone text DEFAULT 'Asia/Kolkata',
  is_setup_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  phone text,
  manager_name text,
  manager_id uuid REFERENCES users(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  category text,
  description text,
  price numeric(10,2) DEFAULT 0,
  cost_price numeric(10,2) DEFAULT 0,
  stock_quantity integer DEFAULT 0,
  min_stock_level integer DEFAULT 0,
  max_stock_level integer DEFAULT 1000,
  unit text DEFAULT 'pcs',
  barcode text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text,
  role text NOT NULL,
  salary numeric(10,2) DEFAULT 0,
  hire_date date DEFAULT CURRENT_DATE,
  address text,
  emergency_contact text,
  employee_id text,
  department text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  customer_name text,
  customer_phone text,
  customer_email text,
  subtotal numeric(10,2) DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) DEFAULT 0,
  payment_method text DEFAULT 'cash',
  payment_status text DEFAULT 'completed',
  notes text,
  receipt_number text,
  sale_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  unit_price numeric(10,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  total_price numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info', -- info, warning, error, success
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject text,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create employee_profiles table
CREATE TABLE IF NOT EXISTS employee_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  bio text,
  skills text[],
  certifications text[],
  performance_rating numeric(3,2) DEFAULT 0,
  last_review_date date,
  next_review_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_branches_business_id ON branches(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business_id ON products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_branch_id ON products(branch_id);
CREATE INDEX IF NOT EXISTS idx_employees_business_id ON employees(business_id);
CREATE INDEX IF NOT EXISTS idx_employees_branch_id ON employees(branch_id);
CREATE INDEX IF NOT EXISTS idx_sales_business_id ON sales(business_id);
CREATE INDEX IF NOT EXISTS idx_sales_branch_id ON sales(branch_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER employee_profiles_updated_at BEFORE UPDATE ON employee_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create notification trigger for low stock
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_quantity <= NEW.min_stock_level AND OLD.stock_quantity > OLD.min_stock_level THEN
    INSERT INTO notifications (business_id, user_id, title, message, type)
    SELECT 
      NEW.business_id,
      b.owner_id,
      'Low Stock Alert',
      'Product "' || NEW.name || '" is running low on stock. Current quantity: ' || NEW.stock_quantity,
      'warning'
    FROM businesses b WHERE b.id = NEW.business_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_low_stock_trigger 
  AFTER UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION check_low_stock();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can read own profile" ON users FOR SELECT TO authenticated USING (auth_user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth_user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON users FOR INSERT TO authenticated WITH CHECK (auth_user_id = auth.uid());

-- Create RLS policies for businesses
CREATE POLICY "Users can read own business" ON businesses FOR SELECT TO authenticated USING (owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update own business" ON businesses FOR UPDATE TO authenticated USING (owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can insert own business" ON businesses FOR INSERT TO authenticated WITH CHECK (owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create RLS policies for branches
CREATE POLICY "Users can access branches of their business" ON branches FOR ALL TO authenticated 
USING (business_id IN (SELECT id FROM businesses WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));

-- Create RLS policies for products
CREATE POLICY "Users can access products of their business" ON products FOR ALL TO authenticated 
USING (business_id IN (SELECT id FROM businesses WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));

-- Create RLS policies for employees
CREATE POLICY "Users can access employees of their business" ON employees FOR ALL TO authenticated 
USING (business_id IN (SELECT id FROM businesses WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));

-- Create RLS policies for sales
CREATE POLICY "Users can access sales of their business" ON sales FOR ALL TO authenticated 
USING (business_id IN (SELECT id FROM businesses WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));

-- Create RLS policies for sale_items
CREATE POLICY "Users can access sale items of their business" ON sale_items FOR ALL TO authenticated 
USING (sale_id IN (SELECT id FROM sales WHERE business_id IN (SELECT id FROM businesses WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()))));

-- Create RLS policies for notifications
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT TO authenticated 
USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated 
USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create RLS policies for messages
CREATE POLICY "Users can read their messages" ON messages FOR SELECT TO authenticated 
USING (sender_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR recipient_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can send messages" ON messages FOR INSERT TO authenticated 
WITH CHECK (sender_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update their messages" ON messages FOR UPDATE TO authenticated 
USING (sender_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR recipient_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create RLS policies for employee_profiles
CREATE POLICY "Users can access employee profiles of their business" ON employee_profiles FOR ALL TO authenticated 
USING (employee_id IN (SELECT id FROM employees WHERE business_id IN (SELECT id FROM businesses WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()))));