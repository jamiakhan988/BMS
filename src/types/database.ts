export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          logo: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          logo?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          logo?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      branches: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          address: string | null;
          phone: string | null;
          manager_name: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          manager_name?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          manager_name?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          business_id: string;
          branch_id: string | null;
          name: string;
          sku: string | null;
          category: string | null;
          description: string | null;
          price: number;
          cost_price: number;
          stock_quantity: number;
          min_stock_level: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          branch_id?: string | null;
          name: string;
          sku?: string | null;
          category?: string | null;
          description?: string | null;
          price: number;
          cost_price?: number;
          stock_quantity?: number;
          min_stock_level?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          branch_id?: string | null;
          name?: string;
          sku?: string | null;
          category?: string | null;
          description?: string | null;
          price?: number;
          cost_price?: number;
          stock_quantity?: number;
          min_stock_level?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          business_id: string;
          branch_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          role: string;
          salary: number;
          hire_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          branch_id?: string | null;
          name: string;
          email?: string | null;
          phone?: string | null;
          role: string;
          salary?: number;
          hire_date?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          branch_id?: string | null;
          name?: string;
          email?: string | null;
          phone?: string | null;
          role?: string;
          salary?: number;
          hire_date?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          business_id: string;
          branch_id: string;
          employee_id: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total_amount: number;
          payment_method: string;
          payment_status: string;
          notes: string | null;
          sale_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          branch_id: string;
          employee_id?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          subtotal: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount: number;
          payment_method?: string;
          payment_status?: string;
          notes?: string | null;
          sale_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          branch_id?: string;
          employee_id?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          subtotal?: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          payment_method?: string;
          payment_status?: string;
          notes?: string | null;
          sale_date?: string;
          created_at?: string;
        };
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          discount_amount: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          discount_amount?: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sale_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          discount_amount?: number;
          total_price?: number;
          created_at?: string;
        };
      };
    };
  };
}