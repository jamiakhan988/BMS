/*
# Business Management System Database Schema

## Overview
Complete database schema for the Business Management System including all core tables and security policies.

## Tables Created
1. **businesses** - Core business information
2. **branches** - Business branch locations  
3. **products** - Inventory items by branch
4. **employees** - Staff management
5. **sales** - Transaction records
6. **sale_items** - Individual sale line items

## Security Features
- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only access their own business data
- Proper foreign key relationships and constraints
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  logo text,
  address text,
  phone text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  address text,
  phone text,
  manager_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  category text,
  description text,
  price decimal(10,2) NOT NULL DEFAULT 0,
  cost_price decimal(10,2) DEFAULT 0,
  stock_quantity integer DEFAULT 0,
  min_stock_level integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Employees table  
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text,
  role text NOT NULL,
  salary decimal(10,2) DEFAULT 0,
  hire_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
  employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  customer_name text,
  customer_phone text,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash',
  payment_status text DEFAULT 'completed',
  notes text,
  sale_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Sale items table
CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;  
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses
CREATE POLICY "Users can read own business" ON businesses
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own business" ON businesses
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own business" ON businesses
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- RLS Policies for branches
CREATE POLICY "Users can access branches of their business" ON branches
  FOR ALL TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  ));

-- RLS Policies for products
CREATE POLICY "Users can access products of their business" ON products
  FOR ALL TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  ));

-- RLS Policies for employees
CREATE POLICY "Users can access employees of their business" ON employees
  FOR ALL TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  ));

-- RLS Policies for sales
CREATE POLICY "Users can access sales of their business" ON sales
  FOR ALL TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  ));

-- RLS Policies for sale_items
CREATE POLICY "Users can access sale items of their business" ON sale_items
  FOR ALL TO authenticated
  USING (sale_id IN (
    SELECT id FROM sales WHERE business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  ))
  WITH CHECK (sale_id IN (
    SELECT id FROM sales WHERE business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  ));

-- Indexes for better performance
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER branches_updated_at
  BEFORE UPDATE ON branches  
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();