import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { MENU_ITEMS } from '../data/menu';
import { Trash2, Edit2, Check, X } from 'lucide-react';

export default function PurchaseLogs() {
  const { transactions, deleteTransaction, editTransaction, showToast } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState(1);

  const handleEditClick = (tx) => {
    setEditingId(tx.id);
    setEditQty(tx.quantity);
  };

  const handleSaveEdit = (id) => {
    if (editQty > 0) {
      editTransaction(id, editQty);
      showToast("Transaction updated");
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to void this transaction? Ingredients will be returned to inventory.")) {
      deleteTransaction(id);
      showToast("Transaction voided");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Purchase Logs</h1>
        <p className="subtitle">History of all transactions today.</p>
      </header>
      
      <div className="scrollable-content">
        {transactions.length === 0 ? (
          <p className="empty-state">No transactions yet today.</p>
        ) : (
          <div className="logs-list">
            {[...transactions].reverse().map(tx => {
              const item = MENU_ITEMS[tx.itemKey];
              const isEditing = editingId === tx.id;
              
              return (
                <div key={tx.id} className="log-card">
                  <div className="log-header">
                    <span className="log-time">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    <span className="log-total">₱{tx.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="log-body">
                    <div className="log-item-info">
                      <strong>{item?.display || tx.itemKey}</strong>
                      {isEditing ? (
                        <div className="edit-qty-controls">
                          <input 
                            type="number" 
                            min="1" 
                            value={editQty} 
                            onChange={(e) => setEditQty(parseInt(e.target.value) || 1)}
                            className="stock-input"
                          />
                          <button className="icon-btn success" onClick={() => handleSaveEdit(tx.id)}><Check size={16}/></button>
                          <button className="icon-btn danger" onClick={handleCancelEdit}><X size={16}/></button>
                        </div>
                      ) : (
                        <span className="item-qty">x{tx.quantity}</span>
                      )}
                    </div>
                    
                    {!isEditing && (
                      <div className="log-actions">
                        <button className="icon-btn edit" onClick={() => handleEditClick(tx)}><Edit2 size={16}/></button>
                        <button className="icon-btn danger" onClick={() => handleDelete(tx.id)}><Trash2 size={16}/></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
