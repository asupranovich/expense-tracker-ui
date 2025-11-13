import {Person, PersonForm} from "@/types";
import React, {useEffect, useState} from "react";
import {personService} from "../../../services/personService";

interface Props {
  disabled?: boolean,
}

function Members({disabled = false}: Props) {
  const [members, setMembers] = useState<Person[]>([]);

  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [newMemberPassword, setNewMemberPassword] = useState<string>('');

  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingMemberName, setEditingMemberName] = useState<string>('');
  const [editingMemberEmail, setEditingMemberEmail] = useState<string>('');
  const [editingMemberPassword, setEditingMemberPassword] = useState<string>('');

  const refresh = async () => {
    try {
      const data = await personService.getAll();
      setMembers(data);
    } catch (e: any) {
      alert(e?.message || 'Failed to load categories');
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async () => {
    const name = newMemberName.trim();
    if (!name) {
      alert('Member name is required');
      return;
    }
    const email = newMemberEmail.trim();
    if (!email) {
      alert('Member email is required');
      return;
    }
    const password = newMemberPassword.trim();
    if (!password) {
      alert('Member password is required');
      return;
    }
    const payload: PersonForm = {id: null, name, email, password};
    try {
      await personService.addPerson(payload);
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberPassword('');
      await refresh();
    } catch (e: any) {
      alert(e?.message || 'Failed to add member');
    }
  };

  const startEdit = (person: Person) => {
    setEditingMemberId(person.id);
    setEditingMemberName(person.name);
    setEditingMemberEmail(person.email);
    setEditingMemberPassword('');
  };

  const cancelEdit = () => {
    setEditingMemberId(null);
    setEditingMemberName('');
    setEditingMemberEmail('');
    setEditingMemberPassword('');
  };

  const handleEdit = async () => {
    const name = editingMemberName.trim();
    if (!name) {
      alert('Member name is required');
      return;
    }
    const email = editingMemberEmail.trim();
    if (!email) {
      alert('Member email is required');
      return;
    }
    const password = editingMemberPassword.trim();
    if (!password) {
      alert('Member password is required');
      return;
    }
    const payload: PersonForm = {id: editingMemberId, name, email, password};
    try {
      await personService.updatePerson(payload);
      cancelEdit();
      await refresh();
    } catch (e: any) {
      alert(e?.message || 'Failed to add member');
    }
  };

  return (
      <fieldset>
        <legend>Members</legend>
        <div className="date-table-container">
          <table className="data-table">
            <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <input
                    type="text"
                    value={newMemberName}
                    disabled={disabled}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Member name"
                />
              </td>
              <td>
                <input
                    type="email"
                    value={newMemberEmail}
                    disabled={disabled}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Member email"
                />
              </td>
              <td>
                <input
                    type="password"
                    value={newMemberPassword}
                    disabled={disabled}
                    onChange={(e) => setNewMemberPassword(e.target.value)}
                    placeholder="Member password"
                />
              </td>
              <td>
                <button className="add-button" onClick={handleAdd} disabled={disabled} title="Add"/>
              </td>
            </tr>
            {members.map(member => (
                member.id === editingMemberId ?
                    (
                        <tr key={member.id}>
                          <td>
                            <input
                                type="text"
                                value={editingMemberName}
                                disabled={disabled}
                                onChange={(e) => setEditingMemberName(e.target.value)}
                                placeholder="Member name"
                            />
                          </td>
                          <td>
                            <input
                                type="email"
                                value={editingMemberEmail}
                                disabled={disabled}
                                onChange={(e) => setEditingMemberEmail(e.target.value)}
                                placeholder="Member email"
                            />
                          </td>
                          <td>
                            <input
                                type="password"
                                value={editingMemberPassword}
                                disabled={disabled}
                                onChange={(e) => setEditingMemberPassword(e.target.value)}
                                placeholder="Member password"
                            />
                          </td>
                          <td>
                            <button className="save-button"
                                    onClick={handleEdit}
                                    disabled={disabled}
                                    title="Save"/>
                            <button className="cancel-button"
                                    onClick={cancelEdit}
                                    disabled={disabled} title="Cancel"/>
                          </td>
                        </tr>
                    ) : (
                        <tr key={member.id}>
                          <td>{member.name}</td>
                          <td>{member.email}</td>
                          <td>*****</td>
                          <td>
                            <button className="edit-button"
                                    onClick={() => startEdit(member)}
                                    disabled={disabled}
                                    title="Edit"/>
                          </td>
                        </tr>
                    )
            ))}
            </tbody>
          </table>
        </div>
      </fieldset>
  )
}

export default Members;