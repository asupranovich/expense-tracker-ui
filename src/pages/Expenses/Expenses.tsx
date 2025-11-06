import React, {useState, useEffect} from 'react';
import {expenseService} from '../../services/expenseService';
import {useHousehold} from '../../context/HouseholdContext';
import {Expense, ExpenseForm} from '@/types';
import Header from '../../components/Header';
import './Expenses.css';
import AddExpenseRow from "./components/AddExpenseRow";
import MonthTabs, {formatMonthKey} from "./components/MonthTabs";
import ExpenseRow from "./components/ExpenseRow";

function Expenses() {
  const {data: household, loading: householdLoading} = useHousehold();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeMonth, setActiveMonth] = useState<string>(() => formatMonthKey(new Date()));
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);

  useEffect(() => {
    fetchExpenses(activeMonth);
  }, [activeMonth]);

  const fetchExpenses = async (month: string) => {
    try {
      setLoading(true);
      const data = await expenseService.getExpensesByMonth(month);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      alert(err?.message || 'Failed to load expenses');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await expenseService.deleteExpense(id);
      await fetchExpenses(activeMonth);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete expense');
    }
  };

  const addExpense = async (expense: ExpenseForm) => {
    try {
      setLoading(true);
      await expenseService.addExpense(expense);
      await fetchExpenses(activeMonth);
    } catch (err: any) {
      alert(err?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (expense: ExpenseForm) => {
    try {
      setLoading(true);
      await expenseService.updateExpense(Number(editingExpenseId), expense);
      setEditingExpenseId(null);
      await fetchExpenses(activeMonth);
    } catch (err: any) {
      alert(err?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const disableForm = loading || householdLoading;

  return (
      <div className="expenses-container">
        <Header title="Expense Tracker"/>
        <MonthTabs activeMonth={activeMonth} setActiveMonth={setActiveMonth}/>

        <div className="expenses-content">
          <div className="table-container">
            <table className="expenses-table">
              <thead>
              <tr>
                <th>Pay Date</th>
                <th>Category</th>
                <th>Payer</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Remark</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <AddExpenseRow
                  household={household}
                  onAdd={addExpense}
                  disabled={disableForm}
              />

              {expenses.map((expense) => (
                      <ExpenseRow
                          key={expense.id}
                          editingId={editingExpenseId}
                          expense={expense}
                          household={household}
                          onDelete={deleteExpense}
                          onStartEdit={(id) => setEditingExpenseId(id)}
                          onCancelEdit={() => setEditingExpenseId(null)}
                          onSave={updateExpense}
                          disabled={loading}
                      />
                  )
              )}

              {expenses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="no-expenses">No expenses found</td>
                  </tr>
              )}
              </tbody>
              <tfoot>
              <tr>
                <td colSpan={3} className="total-label">Total</td>
                <td className="amount total-amount">
                  ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                </td>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
  );
}

export default Expenses;