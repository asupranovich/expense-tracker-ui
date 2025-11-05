import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService } from '../../services/expenseService';
import { authService } from '../../services/authService';
import { useHousehold } from '../../context/HouseholdContext';
import './Expenses.css';

function formatMonthKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`; // YYYY-MM
}

function readableMonth(monthKey) {
    const [y, m] = monthKey.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

function toMonthKeyFromDateString(dateStr) {
    // expects YYYY-MM-DD
    if (!dateStr) return formatMonthKey(new Date());
    const [y, m] = dateStr.split('-').map(Number);
    return `${y}-${String(m).padStart(2, '0')}`;
}

function Expenses() {
    const { data: household, loading: householdLoading, error: householdError } = useHousehold();

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeMonth, setActiveMonth] = useState(() => formatMonthKey(new Date()));

    // Inline new-expense form state
    const todayStr = new Date().toISOString().slice(0, 10);
    const [payDate, setPayDate] = useState(todayStr);
    const [categoryId, setCategoryId] = useState('');
    const [payerId, setPayerId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [remark, setRemark] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Edit row state
    const [editingId, setEditingId] = useState(null);
    const [editPayDate, setEditPayDate] = useState('');
    const [editCategoryId, setEditCategoryId] = useState('');
    const [editPayerId, setEditPayerId] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editRemark, setEditRemark] = useState('');
    const [editError, setEditError] = useState('');
    const [editSubmitting, setEditSubmitting] = useState(false);

    const navigate = useNavigate();

    const months = useMemo(() => {
        const list = [];
        const now = new Date();
        for (let i = 0; i < 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = formatMonthKey(d);
            list.push({ key, label: readableMonth(key) });
        }
        return list;
    }, []);

    // Preselect payer if only one household member
    useEffect(() => {
        if (household && household.payers && household.payers.length === 1) {
            setPayerId(String(household.payers[0].id));
        }
    }, [household]);

    useEffect(() => {
        fetchExpenses(activeMonth);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeMonth]);

    const fetchExpenses = async (month) => {
        try {
            setLoading(true);
            setError('');
            resetForm();
            const data = await expenseService.getExpensesByMonth(month);
            setExpenses(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Failed to load expenses');
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleDeleteExpense = async (id) => {
        try {
            await expenseService.deleteExpense(id);
            await fetchExpenses(activeMonth);
        } catch (err) {
            setError(err.message || 'Failed to delete expense');
        }
    };

    const resetForm = () => {
        setPayDate(todayStr);
        setAmount('');
        setDescription('');
        setRemark('');
    };

    const validate = () => {
        if (!payDate) return 'Pay Date is required';
        if (!categoryId) return 'Category is required';
        if (!payerId) return 'Payer is required';
        if (!description) return 'Description is required';
        const amt = parseFloat(String(amount).replace(',', '.'));
        if (Number.isNaN(amt) || amt <= 0) return 'Amount must be a positive number';
        return '';
    };

    const handleAddExpense = async () => {
        setSubmitError('');
        const validationError = validate();
        if (validationError) {
            setSubmitError(validationError);
            return;
        }
        try {
            setSubmitting(true);
            await expenseService.addExpense({
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
            });

            // After success: navigate to the month of the new expense and refresh
            const newMonthKey = toMonthKeyFromDateString(payDate);
            setActiveMonth(newMonthKey);
            await fetchExpenses(newMonthKey);
            resetForm();
        } catch (e) {
            setSubmitError(e?.message || 'Failed to add expense');
        } finally {
            setSubmitting(false);
        }
    };

    // ----- Edit handlers -----
    const startEdit = (exp) => {
        setEditError('');
        setEditingId(exp.id);
        const dateStr = String(exp.payDate || '').slice(0, 10);
        setEditPayDate(dateStr);
        setEditCategoryId(exp.category?.id ? String(exp.category.id) : '');
        setEditPayerId(exp.payer?.id ? String(exp.payer.id) : '');
        setEditAmount(typeof exp.amount === 'number' ? String(exp.amount) : String(exp.amount || ''));
        setEditDescription(exp.description || '');
        setEditRemark(exp.remark || '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditError('');
    };

    const validateEdit = () => {
        if (!editPayDate) return 'Pay Date is required';
        if (!editCategoryId) return 'Category is required';
        if (!editPayerId) return 'Payer is required';
        if (!editDescription) return 'Description is required';
        const amt = parseFloat(String(editAmount).replace(',', '.'));
        if (Number.isNaN(amt) || amt <= 0) return 'Amount must be a positive number';
        return '';
    };

    const saveEdit = async () => {
        setEditError('');
        const validationError = validateEdit();
        if (validationError) {
            setEditError(validationError);
            return;
        }
        try {
            setEditSubmitting(true);
            await expenseService.updateExpense(Number(editingId), {
                payDate: editPayDate,
                category: { id: Number(editCategoryId) },
                payer: { id: Number(editPayerId) },
                amount: parseFloat(String(editAmount).replace(',', '.')),
                description: editDescription || undefined,
                remark: editRemark || undefined,
            });
            const newMonthKey = toMonthKeyFromDateString(editPayDate);
            setActiveMonth(newMonthKey);
            await fetchExpenses(newMonthKey);
            cancelEdit();
        } catch (e) {
            setEditError(e?.message || 'Failed to update expense');
        } finally {
            setEditSubmitting(false);
        }
    };

    const disableForm = submitting || loading || householdLoading;

    return (
        <div className="expenses-container">
            <div className="expenses-header">
                <h2>Expense Tracker</h2>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>

            {/* Tabs for months */}
            <div className="tabs">
                {months.map((m) => (
                    <button
                        key={m.key}
                        className={`tab ${activeMonth === m.key ? 'active' : ''}`}
                        onClick={() => setActiveMonth(m.key)}
                        disabled={loading && activeMonth === m.key}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            {(loading || householdLoading) && (
                <div className="loading">Loading expenses...</div>
            )}

            {(error || householdError) && (
                <div className="error-message">
                    {error || householdError}
                    <button onClick={() => fetchExpenses(activeMonth)} className="retry-button">
                        Retry
                    </button>
                </div>
            )}

            {!loading && !householdLoading && (
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
                            {/* Inline New Expense Row */}
                            <tr className="new-expense-row">
                                <td>
                                    <input
                                        type="date"
                                        value={payDate}
                                        onChange={(e) => setPayDate(e.target.value)}
                                        disabled={disableForm}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        disabled={disableForm || !household?.categories?.length}
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
                                        disabled={disableForm || !household?.members?.length}
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
                                        disabled={disableForm}
                                        placeholder="0.00"
                                        className="amount-input"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={disableForm}
                                        placeholder="Description"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        disabled={disableForm}
                                        placeholder="Remark"
                                    />
                                </td>
                                <td>
                                    <button onClick={handleAddExpense} disabled={disableForm} className="add-button"/>
                                </td>
                            </tr>

                            {/* Existing expenses */}
                            {expenses.map((expense) => (
                                editingId === expense.id ? (
                                    <>
                                        <tr key={expense.id} className="new-expense-row">
                                            <td>
                                                <input
                                                    type="date"
                                                    value={editPayDate}
                                                    onChange={(e) => setEditPayDate(e.target.value)}
                                                    disabled={editSubmitting}
                                                />
                                            </td>
                                            <td>
            
                                                <select
                                                    value={editCategoryId}
                                                    onChange={(e) => setEditCategoryId(e.target.value)}
                                                    disabled={editSubmitting || !household?.categories?.length}
                                                >
                                                    <option value="">Select…</option>
                                                    {household?.categories?.map((c) => (
                                                        <option key={c.id} value={String(c.id)}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    value={editPayerId}
                                                    onChange={(e) => setEditPayerId(e.target.value)}
                                                    disabled={editSubmitting || !household?.members?.length}
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
                                                    value={editAmount}
                                                    onChange={(e) => setEditAmount(e.target.value)}
                                                    disabled={editSubmitting}
                                                    placeholder="0.00"
                                                    className="amount-input"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    disabled={editSubmitting}
                                                    placeholder="Description"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editRemark}
                                                    onChange={(e) => setEditRemark(e.target.value)}
                                                    disabled={editSubmitting}
                                                    placeholder="Remark"
                                                />
                                            </td>
                                            <td>
                                                <button onClick={saveEdit} disabled={editSubmitting} className="save-button"/>
                                                <button onClick={cancelEdit} disabled={editSubmitting} className="cancel-button"/>
                                            </td>
                                        </tr>
                                        {editError && (
                                            <tr>
                                                <td colSpan="7" className="error-message">{editError}</td>
                                            </tr>
                                        )}
                                    </>
                                ) : (
                                    <tr key={expense.id}>
                                        <td>{new Date(expense.payDate).toLocaleDateString()}</td>
                                        <td>{expense.category?.name}</td>
                                        <td>{expense.payer?.name}</td>
                                        <td className="amount">${expense.amount.toFixed(2)}</td>
                                        <td>{expense.description}</td>
                                        <td>{expense.remark}</td>
                                        <td>
                                            <button className="edit-button" onClick={() => startEdit(expense)} aria-label="Edit" />
                                            <button className="delete-button" onClick={() => handleDeleteExpense(expense.id)} aria-label="Delete" />
                                        </td>
                                    </tr>
                                )
                            ))}

                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="no-expenses">No expenses found</td>
                                </tr>
                            )}

                            {submitError && (
                                <tr>
                                    <td colSpan="7" className="error-message">{submitError}</td>
                                </tr>
                            )}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="3" className="total-label">Total</td>
                                <td className="amount total-amount">
                                    ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Expenses;