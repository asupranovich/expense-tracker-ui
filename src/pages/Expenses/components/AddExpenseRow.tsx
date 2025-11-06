import React, {useState, useEffect} from "react";
import {ExpenseForm, Household} from "@/types";
import {validateExpense} from "../../../utils/validationUtils";

type Props = {
  household: Household | null,
  onAdd: (expense: ExpenseForm) => void,
  disabled: boolean,
}

function AddExpenseRow({household, onAdd, disabled}: Props) {
  const [payDate, setPayDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState<string>('');
  const [payerId, setPayerId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [remark, setRemark] = useState<string>('');

  const resetForm = () => {
    setCategoryId('');
    setAmount('');
    setDescription('');
    setRemark('');
  };

  const handleAddExpense = async () => {
    const expense = {
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
    const validationError = validateExpense(expense);
    if (validationError) {
      alert(validationError);
      return;
    }
    onAdd(expense);
    resetForm();
  };

  useEffect(() => {
    if (household && household.members && household.members.length === 1) {
      setPayerId(String(household.members[0].id));
    }
  }, [household]);

  return (
      <tr className="new-expense-row">
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
          <button onClick={handleAddExpense} disabled={disabled} className="add-button"/>
        </td>
      </tr>
  );
}

export default AddExpenseRow;