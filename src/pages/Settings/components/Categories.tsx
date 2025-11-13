import React, {useEffect, useState} from 'react';
import {categoryService} from '../../../services/categoryService';
import {householdService} from '../../../services/householdService';
import {Category, CategoryForm} from '@/types';

interface Props {
  disabled?: boolean;
}

interface SelectableCategory extends Category {
  enabled: boolean;
}

function Categories({disabled = false}: Props) {
  const [categories, setCategories] = useState<SelectableCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');

  const refresh = async () => {
    try {
      setLoading(true);
      const household = await householdService.getHousehold();
      const data = await categoryService.getCategories();
      //TODO: use householdContext
      setCategories(data.map(category => ({...category, enabled: household.categories.find(c => c.id === category.id) !== undefined})));
    } catch (e: any) {
      alert(e?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const payload: CategoryForm = {id: null, name};
    try {
      await categoryService.addCategory(payload);
      setNewCategoryName('');
      await refresh();
    } catch (e: any) {
      alert(e?.message || 'Failed to add category');
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleEdit = async () => {
    const name = editingCategoryName.trim();
    if (!name) {
      alert('Category name is required');
      return;
    }
    try {
      await categoryService.updateCategory({id: editingCategoryId, name});
      cancelEdit();
      await refresh();
    } catch (e: any) {
      alert(e?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(id);
        await refresh();
      } catch (e: any) {
        alert(e?.message || 'Failed to delete category');
      }
    }
  };

  const handleEnableToggle = async (categoryId: number, enabled: boolean) => {
    try{
      setLoading(true);
      const category = categories.find(category => category.id === categoryId);
      category && (category.enabled = enabled);
      if (enabled) {
        await householdService.enableCategory(categoryId);
      } else {
        await householdService.disableCategory(categoryId);
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  }

  return (
      <fieldset>
        <legend>Categories</legend>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
            <tr>
              <th>Enabled</th>
              <th>Name</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td></td>
              <td>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    disabled={disabled || loading}
                />
              </td>
              <td>
                <button className="add-button"
                        onClick={handleAdd}
                        disabled={disabled || loading}
                        title="Add category"/>
              </td>
            </tr>

            {
                categories.map((category) => {
                  const editing = editingCategoryId === category.id;
                  return (
                      <tr key={category.id}>
                        <td>
                          <input
                              type="checkbox"
                              checked={category.enabled}
                              onChange={(e) => handleEnableToggle(category.id, e.target.checked)}
                              disabled={disabled || loading}
                          />
                        </td>
                        <td>
                          {editing ? (
                              <input
                                  type="text"
                                  value={editingCategoryName}
                                  onChange={(e) => setEditingCategoryName(e.target.value)}
                                  disabled={disabled || loading}
                              />
                          ) : (
                              category.default ? (<>{category.name}
                                <i>(default)</i></>) : (category.name)
                          )}
                        </td>
                        <td>
                          {!category.default ? (
                              editing ? (
                                  <>
                                    <button className="save-button"
                                            onClick={handleEdit}
                                            disabled={disabled || !editingCategoryName.trim()}
                                            title="Save"/>
                                    <button className="cancel-button" onClick={cancelEdit}
                                            disabled={disabled} title="Cancel"/>
                                  </>
                              ) : (
                                  <>
                                    <button className="edit-button"
                                            onClick={() => startEdit(category)} disabled={disabled}
                                            title="Edit"/>
                                    <button className="delete-button"
                                            onClick={() => handleDelete(category.id)}
                                            disabled={disabled} title="Delete"/>
                                  </>
                              )
                          ) : null}
                        </td>
                      </tr>
                  );
                }
            )}
            </tbody>
          </table>
        </div>
      </fieldset>
  );
}

export default Categories;
