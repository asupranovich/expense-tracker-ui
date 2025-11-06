import {ExpenseForm} from "@/types";

export function validateExpense(expense: ExpenseForm) {
  if (!expense.payDate) return 'Pay Date is required';
  if (!expense.category?.id) return 'Category is required';
  if (!expense.payer?.id) return 'Payer is required';
  if (!expense.description) return 'Description is required';
  const amt = parseFloat(String(expense.amount).replace(',', '.'));
  if (Number.isNaN(amt) || amt <= 0) return 'Amount must be a positive number';
  return '';
}