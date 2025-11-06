import React, {useState} from "react";
import {Expense, ExpenseForm, Household} from "@/types";
import {validateExpense} from "../../../utils/validationUtils";

type Props = {
  household: Household | null,
  expense: Expense,
  editingId: number | null,
  onDelete: (id: number) => void,
  onSave: (expense: ExpenseForm) => void,
  onStartEdit: (id: number) => void,
  onCancelEdit: () => void,
  disabled: boolean,
}

function ExpenseRow({
                      household,
                      expense,
                      editingId,
                      onDelete,
                      onStartEdit,
                      onCancelEdit,
                      onSave,
                      disabled
                    }: Props) {
  if (editingId === expense.id) {
    const [payDate, setPayDate] = useState<string>(expense.payDate);
    const [categoryId, setCategoryId] = useState<string>(expense.category?.id ? String(expense.category.id) : '');
    const [payerId, setPayerId] = useState<string>(expense.payer?.id ? String(expense.payer.id) : '');
    const [amount, setAmount] = useState<string>(expense.amount.toString());
    const [description, setDescription] = useState<string>(expense.description || '');
    const [remark, setRemark] = useState<string>(expense.remark || '');

    const saveEdit = () => {
      const updatedExpense = {
        id: expense.id,
        payDate,
        category: {
          id: Number(categoryId)
        },
        payer: {
          id: Number(payerId)
        },
        amount: parseFloat(String(amount).replace(',', '.')),
        description: description,
        remark: remark,
      };
      const validationError = validateExpense(updatedExpense);
      if (validationError) {
        alert(validationError);
        return;
      }
      onSave(updatedExpense);
    };

    return (
        <tr key={expense.id} className="new-expense-row">
          <td>
            <input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                disabled={disabled}
            />
          </td>
          <td>
            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={disabled || !household?.categories?.length}
            >
              <option value="">Select…</option>
              {household?.categories?.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          </td>
          <td>
            <select
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                disabled={disabled || !household?.members?.length}
            >
              <option value="">Select…</option>
              {household?.members?.map((p) => (
                  <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>
          </td>
          <td>
            <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={disabled}
                placeholder="0.00"
                className="amount-input"
            />
          </td>
          <td>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={disabled}
                placeholder="Description"
            />
          </td>
          <td>
            <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                disabled={disabled}
                placeholder="Remark"
            />
          </td>
          <td>
            <button onClick={saveEdit} disabled={disabled} className="save-button"/>
            <button onClick={onCancelEdit} disabled={disabled} className="cancel-button"/>
          </td>
        </tr>
    );
  } else {
    const deleteExpense = (id: number) => {
      if (window.confirm('Are you sure you want to delete this expense?')) {
        onDelete(id);
      }
    }

    return (
        <tr key={expense.id}>
          <td>{new Date(expense.payDate).toLocaleDateString()}</td>
          <td>{expense.category?.name}</td>
          <td>{expense.payer?.name}</td>
          <td className="amount">${expense.amount.toFixed(2)}</td>
          <td>{expense.description}</td>
          <td>{expense.remark}</td>
          <td>
            <button className="edit-button" onClick={() => onStartEdit(expense.id)}
                    aria-label="Edit"/>
            <button className="delete-button" onClick={() => deleteExpense(expense.id)}
                    aria-label="Delete"/>
          </td>
        </tr>
    );
  }
}

export default ExpenseRow;