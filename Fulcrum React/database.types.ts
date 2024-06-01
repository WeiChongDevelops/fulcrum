import {
  BlacklistedExpenseItemEntity,
  BudgetItemEntity,
  ExpenseItemEntity,
  GroupItemEntity,
  RecurringExpenseItemEntity,
  UserPreferences,
} from "@/utility/types.ts";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      budgets: {
        Row: BudgetItemEntity & { userId: string };
        // Row: {
        //   amount: number;
        //   category: string;
        //   group: string;
        //   iconPath: string;
        //   id: number;
        //   timestamp: string;
        //   userId: string;
        // };
        Insert: {
          amount?: number;
          category: string;
          group: string;
          iconPath?: string;
          id: number;
          timestamp?: string;
          userId?: string;
        };
        Update: {
          amount?: number;
          category?: string;
          group?: string;
          iconPath?: string;
          id?: number;
          timestamp?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_budgets_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "userid_group_fkey";
            columns: ["userId", "group"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["userId", "group"];
          },
        ];
      };
      expenses: {
        Row: ExpenseItemEntity & { userId: string };
        // Row: {
        //   amount: number | null;
        //   category: string;
        //   expenseId: string;
        //   recurringExpenseId: string | null;
        //   timestamp: Date | null;
        //   userId: string | null;
        // };
        Insert: {
          amount?: number | null;
          category: string;
          expenseId?: string;
          recurringExpenseId?: string | null;
          timestamp?: Date | null;
          userId?: string | null;
        };
        Update: {
          amount?: number | null;
          category?: string;
          expenseId?: string;
          recurringExpenseId?: string | null;
          timestamp?: Date | null;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fkey_composite_uid_and_category";
            columns: ["userId", "category"];
            isOneToOne: false;
            referencedRelation: "budgets";
            referencedColumns: ["userId", "category"];
          },
        ];
      };
      groups: {
        Row: GroupItemEntity & { userId: string };
        // Row: {
        //   colour: string;
        //   group: string;
        //   id: number;
        //   timestamp: string | null;
        //   userId: string;
        // };
        Insert: {
          colour?: string;
          group: string;
          id?: number;
          timestamp?: string | null;
          userId?: string;
        };
        Update: {
          colour?: string;
          group?: string;
          id?: number;
          timestamp?: string | null;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_groups_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      recurring_expenses: {
        Row: RecurringExpenseItemEntity & { userId: string };
        // Row: {
        //   amount: number;
        //   category: string;
        //   frequency: string;
        //   recurringExpenseId: string;
        //   timestamp: string;
        //   userId: string;
        // };
        Insert: {
          amount: number;
          category: string;
          frequency: string;
          recurringExpenseId?: string;
          timestamp?: string;
          userId?: string;
        };
        Update: {
          amount?: number;
          category?: string;
          frequency?: string;
          recurringExpenseId?: string;
          timestamp?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fkey_composite_uid_and_category";
            columns: ["userId", "category"];
            isOneToOne: false;
            referencedRelation: "budgets";
            referencedColumns: ["userId", "category"];
          },
        ];
      };
      removed_recurring_expenses: {
        Row: BlacklistedExpenseItemEntity & { userId: string };
        // Row: {
        //   recurringExpenseId: string;
        //   timestampOfRemovedInstance: string;
        //   userId: string;
        // };
        Insert: {
          recurringExpenseId: string;
          timestampOfRemovedInstance: string;
          userId?: string | null;
        };
        Update: {
          recurringExpenseId?: string;
          timestampOfRemovedInstance?: string;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_removed_recurring_expenses_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      total_income: {
        Row: {
          totalIncome: number;
          userId: string;
        };
        Insert: {
          totalIncome: number;
          userId?: string;
        };
        Update: {
          totalIncome?: number;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_total_income_userId_fkey";
            columns: ["userId"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_preferences: {
        user_preferences: {
          Row: UserPreferences;
          // {
          //   accessibilityEnabled: boolean | null
          //   createdAt: string
          //   currency: string
          //   darkModeEnabled: boolean | null
          //   prefersDefaultAvatar: boolean
          //   profileIconFileName: string
          //   userId: string
          // }
          Insert: {
            accessibilityEnabled?: boolean | null;
            createdAt?: string;
            currency?: string;
            darkModeEnabled?: boolean | null;
            prefersDefaultAvatar?: boolean;
            profileIconFileName?: string;
            userId?: string;
          };
          Update: {
            accessibilityEnabled?: boolean | null;
            createdAt?: string;
            currency?: string;
            darkModeEnabled?: boolean | null;
            prefersDefaultAvatar?: boolean;
            profileIconFileName?: string;
            userId?: string;
          };
          Relationships: [
            {
              foreignKeyName: "public_public_user_data_userId_fkey";
              columns: ["userId"];
              isOneToOne: true;
              referencedRelation: "users";
              referencedColumns: ["id"];
            },
          ];
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_created_at_timestamp:
        | {
            Args: Record<PropertyKey, never>;
            Returns: string;
          }
        | {
            Args: {
              userid: string;
            };
            Returns: string;
          };
      random_color: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      totalbudgetted: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
