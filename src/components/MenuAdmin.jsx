import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { MENU_CATEGORIES } from '../data/menu';
import { Save, Edit2, Percent } from 'lucide-react';

export default function MenuAdmin() {
  const { 
    menuItems, updateItemPrice, showToast,
    foodCommissionRate, bevCommissionRate, updateCommissionRates
  } = useStore();
  const [editingKey, setEditingKey] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  
  const [isEditingComm, setIsEditingComm] = useState(false);
  const [tempFoodComm, setTempFoodComm] = useState((foodCommissionRate * 100).toString());
  const [tempBevComm, setTempBevComm] = useState((bevCommissionRate * 100).toString());

  const handleEdit = (key, currentPrice) => {
    setEditingKey(key);
    setTempPrice(currentPrice.toString());
  };

  const handleSave = (key) => {
    const price = parseFloat(tempPrice);
    if (!isNaN(price) && price >= 0) {
      updateItemPrice(key, price);
      showToast("Price updated");
      setEditingKey(null);
    } else {
      showToast("Invalid price");
    }
  };

  const handleSaveComm = () => {
    const food = parseFloat(tempFoodComm) / 100;
    const bev = parseFloat(tempBevComm) / 100;
    if (!isNaN(food) && !isNaN(bev)) {
      updateCommissionRates(food, bev);
      showToast("Commission rates updated");
      setIsEditingComm(false);
    } else {
      showToast("Invalid commission values");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="subtitle">Adjust product prices and commission rates.</p>
      </header>

      <div className="scrollable-content">
        <div className="report-section" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Percent size={20} color="var(--text-secondary)" />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Commission Rates</h2>
          </div>
          
          <div className="inventory-card">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="ingredient-name">Food Items (%)</span>
                {isEditingComm ? (
                  <input
                    type="number"
                    className="stock-input"
                    value={tempFoodComm}
                    onChange={(e) => setTempFoodComm(e.target.value)}
                    style={{ width: '100px' }}
                  />
                ) : (
                  <span className="stock-badge highlight">{(foodCommissionRate * 100).toFixed(0)}%</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="ingredient-name">Beverages (%)</span>
                {isEditingComm ? (
                  <input
                    type="number"
                    className="stock-input"
                    value={tempBevComm}
                    onChange={(e) => setTempBevComm(e.target.value)}
                    style={{ width: '100px' }}
                  />
                ) : (
                  <span className="stock-badge highlight">{(bevCommissionRate * 100).toFixed(0)}%</span>
                )}
              </div>
            </div>
            
            <div className="restock-action" style={{ marginLeft: '24px' }}>
              {isEditingComm ? (
                <button className="icon-btn success" onClick={handleSaveComm}>
                  <Save size={20} />
                </button>
              ) : (
                <button className="icon-btn" onClick={() => setIsEditingComm(true)}>
                  <Edit2 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--surface-highlight)', margin: '0 -24px 32px', padding: '0 24px' }}></div>
        {MENU_CATEGORIES.map(category => (
          <div key={category.id} className="category-section">
            <h3 className="category-title">{category.title}</h3>
            <div className="inventory-list">
              {category.items.map(key => {
                const item = menuItems[key];
                if (!item) return null;
                const isEditing = editingKey === key;

                return (
                  <div key={key} className="inventory-card">
                    <div className="inventory-details">
                      <span className="ingredient-name">{item.display}</span>
                      <span className="stock-badge healthy">₱{item.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="restock-action">
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            className="stock-input"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            autoFocus
                            step="0.01"
                          />
                          <button 
                            className="icon-btn success"
                            onClick={() => handleSave(key)}
                          >
                            <Save size={20} />
                          </button>
                        </>
                      ) : (
                        <button 
                          className="icon-btn"
                          onClick={() => handleEdit(key, item.price)}
                        >
                          <Edit2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
