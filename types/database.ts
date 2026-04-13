export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          stripe_account_id: string | null;
          stripe_customer_id: string | null;
          subscription_status: string;
          charge_late_fee: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          stripe_account_id?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: string;
          charge_late_fee?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          stripe_account_id?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: string;
          charge_late_fee?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
