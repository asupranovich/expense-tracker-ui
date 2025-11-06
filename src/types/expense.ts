export interface Entity {
  id: number;
}

export interface Category extends Entity {
  name: string;
}

export interface Person extends Entity {
  name: string;
  email: string;
}

export interface Household extends Entity {
  name: string;
  categories: Category[];
  members: Person[];
}

export interface Expense extends Entity {
  payDate: string;
  category: Category;
  payer: Person;
  amount: number;
  description: string;
  remark: string | null;
}

export interface ExpenseForm {
  id?: number;
  payDate: string;
  category: Entity;
  payer: Entity;
  amount: number;
  description: string;
  remark: string | null;
}