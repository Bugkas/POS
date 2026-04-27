import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { MENU_ITEMS } from '../data/menu';
import { Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function PurchaseLogs() {
  const { transactions, deleteTransaction, editTransaction, showToast } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState(1);
  const [expandedGroups, setExpandedGroups] = useState({});

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
    if (window.confirm("Are you sure you want to void this item? Ingredients will be returned to inventory.")) {
      deleteTransaction(id);
      showToast("Item voided");
    }
  };

  const toggleGroup = (timestamp) => {
    setExpandedGroups(prev => ({ ...prev, [timestamp]: !prev[timestamp] }));
  };

  // Group transactions by timestamp
  const groupedTransactions = transactions.reduce((acc, tx) => {
    if (!acc[tx.timestamp]) acc[tx.timestamp] = [];
    acc[tx.timestamp].push(tx);
    return acc;
  }, {});

  const sortedTimestamps = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

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
            {sortedTimestamps.map(timestamp => {
              const groupTxs = groupedTransactions[timestamp];
              const isMultiple = groupTxs.length > 1;
              const isExpanded = expandedGroups[timestamp] || !isMultiple;
              const groupTotal = groupTxs.reduce((sum, tx) => sum + tx.total, 0);

              return (
                <div key={timestamp} className="log-card">
                  <div 
                    className="log-header" 
                    onClick={() => isMultiple && toggleGroup(timestamp)} 
                    style={{ cursor: isMultiple ? 'pointer' : 'default', paddingBottom: isExpanded ? '12px' : '0', borderBottom: isExpanded ? '1px solid var(--surface-highlight)' : 'none', marginBottom: isExpanded ? '12px' : '0' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="log-time">{new Date(timestamp).toLocaleTimeString()}</span>
                      {isMultiple && <span className="item-qty">{groupTxs.length} items</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="log-total">₱{groupTotal.toFixed(2)}</span>
                      {isMultiple && (
                        <div style={{ color: 'var(--text-secondary)' }}>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="log-group-items" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {groupTxs.map((tx, index) => {
                        const item = MENU_ITEMS[tx.itemKey];
                        const isEditing = editingId === tx.id;
                        
                        let ingredientsStr = '';
                        if (item && item.deduct) {
                          ingredientsStr = Object.entries(item.deduct)
                            .map(([ing, qty]) => `${qty * tx.quantity}x ${ing}`)
                            .join(', ');
                        }
                        
                        return (
                          <div key={tx.id} className="log-body" style={{ borderBottom: index < groupTxs.length - 1 ? '1px solid var(--surface-highlight)' : 'none', paddingBottom: index < groupTxs.length - 1 ? '16px' : '0' }}>
                            <div className="log-item-info" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <strong>{item?.display || tx.itemKey}</strong>
                                {isEditing ? (
                                  <div className="edit-qty-controls">
                                    <input 
                                      type="number" 
                                      min="1" 
                                      value={editQty} 
                                      onChange={(e) => setEditQty(parseInt(e.target.value) || 1)}
                                      className="stock-input"
                                      style={{ padding: '4px 8px', width: '60px' }}
                                    />
                                    <button className="icon-btn success" onClick={() => handleSaveEdit(tx.id)}><Check size={16}/></button>
                                    <button className="icon-btn danger" onClick={handleCancelEdit}><X size={16}/></button>
                                  </div>
                                ) : (
                                  <span className="item-qty">x{tx.quantity}</span>
                                )}
                              </div>
                              {ingredientsStr && (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                  Deducted: {ingredientsStr}
                                </span>
                              )}
                            </div>
                            
                            {!isEditing && (
                              <div className="log-actions" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginRight: '12px' }}>
                                  ₱{tx.total.toFixed(2)}
                                </div>
                                <button className="icon-btn edit" onClick={() => handleEditClick(tx)} style={{ color: 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={18}/></button>
                                <button className="icon-btn danger" onClick={() => handleDelete(tx.id)} style={{ color: 'var(--danger-color)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18}/></button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
