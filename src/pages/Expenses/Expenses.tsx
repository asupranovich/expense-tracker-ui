import React, {useState, useEffect} from 'react';
import {expenseService} from '../../services/expenseService';
import {useHousehold} from '../../context/HouseholdContext';
import {Expense, ExpenseForm} from '@/types';
import Header from './components/Header';
import './Expenses.css';
import AddExpenseRow from "./components/AddExpenseRow";
import MonthTabs from "./components/MonthTabs";
import ExpenseRow from "./components/ExpenseRow";
import Statistics from "./components/Statistics";

function Expenses() {
  const {data: household, loading: householdLoading} = useHousehold();

  const now = new Date();
  const [activeMonth, setActiveMonth] = useState<string>(`${now.getFullYear()}-${now.getMonth() + 1}`);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, [activeMonth]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const [year, month] = activeMonth.split('-').map(Number);
      const data = await expenseService.getMonthExpenses(month, year);
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
      await fetchExpenses();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete expense');
    }
  };

  const addExpense = async (expense: ExpenseForm) => {
    try {
      setLoading(true);
      await expenseService.addExpense(expense);
      await fetchExpenses();
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
      await fetchExpenses();
    } catch (err: any) {
      alert(err?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const disableForm = loading || householdLoading;

  return (
      <div className="page-container">
        <Header/>
        <MonthTabs activeMonth={activeMonth} setActiveMonth={setActiveMonth}/>

        <div className="page-content">
          <div className="content-row">
            <fieldset>
              <legend>Expenses</legend>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                  <tr>
                    <th>Date</th>
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
                      activeMonth={activeMonth}
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
                </table>
              </div>
            </fieldset>

            <Statistics expenses={expenses}/>
          </div>
        </div>
      </div>
  );
}

export default Expenses;