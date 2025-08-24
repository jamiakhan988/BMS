export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_user_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          is_business_owner: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_business_owner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_business_owner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          logo: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          tax_number: string | null;
          currency: string;
          timezone: string;
          is_setup_complete: boolean;
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
          website?: string | null;
          tax_number?: string | null;
          currency?: string;
          timezone?: string;
          is_setup_complete?: boolean;
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
          website?: string | null;
          tax_number?: string | null;
          currency?: string;
          timezone?: string;
          is_setup_complete?: boolean;
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
          manager_id: string | null;
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
          manager_id?: string | null;
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
          manager_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          business_id: string;
          branch_id: string;
          name: string;
          sku: string | null;
          category: string | null;
          description: string | null;
          price: number;
          cost_price: number;
          stock_quantity: number;
          min_stock_level: number;
          max_stock_level: number;
          unit: string;
          barcode: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          branch_id: string;
          name: string;
          sku?: string | null;
          category?: string | null;
          description?: string | null;
          price: number;
          cost_price?: number;
          stock_quantity?: number;
          min_stock_level?: number;
          max_stock_level?: number;
          unit?: string;
          barcode?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          branch_id?: string;
          name?: string;
          sku?: string | null;
          category?: string | null;
          description?: string | null;
          price?: number;
          cost_price?: number;
          stock_quantity?: number;
          min_stock_level?: number;
          max_stock_level?: number;
          unit?: string;
          barcode?: string | null;
          image_url?: string | null;
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
          user_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          role: string;
          salary: number;
          hire_date: string;
          address: string | null;
          emergency_contact: string | null;
          employee_id: string | null;
          department: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          branch_id?: string | null;
          user_id?: string | null;
          name: string;
          email?: string | null;
          phone?: string | null;
          role: string;
          salary?: number;
          hire_date?: string;
          address?: string | null;
          emergency_contact?: string | null;
          employee_id?: string | null;
          department?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          branch_id?: string | null;
          user_id?: string | null;
          name?: string;
          email?: string | null;
          phone?: string | null;
          role?: string;
          salary?: number;
          hire_date?: string;
          address?: string | null;
          emergency_contact?: string | null;
          employee_id?: string | null;
          department?: string | null;
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
          customer_email: string | null;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total_amount: number;
          payment_method: string;
          payment_status: string;
          notes: string | null;
          receipt_number: string | null;
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
          customer_email?: string | null;
          subtotal: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount: number;
          payment_method?: string;
          payment_status?: string;
          notes?: string | null;
          receipt_number?: string | null;
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
          customer_email?: string | null;
          subtotal?: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          payment_method?: string;
          payment_status?: string;
          notes?: string | null;
          receipt_number?: string | null;
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
      notifications: {
        Row: {
          id: string;
          business_id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          business_id: string;
          sender_id: string;
          recipient_id: string;
          subject: string | null;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          sender_id: string;
          recipient_id: string;
          subject?: string | null;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          sender_id?: string;
          recipient_id?: string;
          subject?: string | null;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      employee_profiles: {
        Row: {
          id: string;
          employee_id: string;
          bio: string | null;
          skills: string[] | null;
          certifications: string[] | null;
          performance_rating: number;
          last_review_date: string | null;
          next_review_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          bio?: string | null;
          skills?: string[] | null;
          certifications?: string[] | null;
          performance_rating?: number;
          last_review_date?: string | null;
          next_review_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          bio?: string | null;
          skills?: string[] | null;
          certifications?: string[] | null;
          performance_rating?: number;
          last_review_date?: string | null;
          next_review_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}