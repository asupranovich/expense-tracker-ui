import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useHousehold} from '../../context/HouseholdContext';
import './Settings.css';
import Categories from './components/Categories';
import Members from "./components/Members";

function Settings() {
  const navigate = useNavigate();
  const {refresh: refreshHousehold} = useHousehold();

  const onClose = async () => {
    await refreshHousehold();
    navigate('/expenses');
  };

  return (
      <div className="page-container">
        <div className="page-header">
          <h2>Settings</h2>
          <div className="page-header-actions">
            <button className="cancel-button" onClick={onClose} title="Back"/>
          </div>
        </div>

        <div className="page-content">
          <div className="content-row">
            <Categories
                selectedIds={[]}
                disabled={false}
            />
            <Members disabled={false}/>
          </div>
        </div>
      </div>
  );
}

export default Settings;
