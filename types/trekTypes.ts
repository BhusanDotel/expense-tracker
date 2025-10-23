export type Person = {
  name: string;
  contributionAmount: number;
  isActive: boolean;
};

export type Expense = {
  name: string;
  slug: string;
  amount: number;
  description: string;
  timestamp: string;
  isActive: boolean;
};

export type Trek = {
  trekName: string;
  trekSlug: string;
  trekExpenseData: {
    persons: Person[];
    expense: Expense[];
  };
};
