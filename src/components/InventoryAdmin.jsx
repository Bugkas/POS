import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { INGREDIENT_NAMES, INVENTORY_CATEGORIES, PACK_SIZES } from '../data/ingredients';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export default function InventoryAdmin() {
  const { inventory, addStock, deductStock, resetInventory, showToast } = useStore();
  const [stockInputs, setStockInputs] = useState({});
  const [unitInputs, setUnitInputs] = useState({});

  const handleInputChange = (ingredient, value) => {
    setStockInputs({
      ...stockInputs,
      [ingredient]: value
    });
  };

  const handleUnitChange = (ingredient, unit) => {
    setUnitInputs({
      ...unitInputs,
      [ingredient]: unit
    });
  };

  const handleAddStock = (ingredient) => {
    const rawAmount = parseInt(stockInputs[ingredient], 10);
    if (!isNaN(rawAmount) && rawAmount > 0) {
      const isPacks = unitInputs[ingredient] === 'packs';
      const multiplier = isPacks && PACK_SIZES[ingredient] ? PACK_SIZES[ingredient] : 1;
      const finalAmount = rawAmount * multiplier;
      
      addStock(ingredient, finalAmount);
      showToast(`Added ${finalAmount} pcs (${rawAmount} ${isPacks ? 'packs' : 'pcs'}) ${ingredient}`);
      setStockInputs({
        ...stockInputs,
        [ingredient]: ''
      });
    }
  };

  const handleDeductStock = (ingredient) => {
    const rawAmount = parseInt(stockInputs[ingredient], 10);
    if (!isNaN(rawAmount) && rawAmount > 0) {
      const isPacks = unitInputs[ingredient] === 'packs';
      const multiplier = isPacks && PACK_SIZES[ingredient] ? PACK_SIZES[ingredient] : 1;
      const finalAmount = rawAmount * multiplier;

      deductStock(ingredient, finalAmount);
      showToast(`Deducted ${finalAmount} pcs (${rawAmount} ${isPacks ? 'packs' : 'pcs'}) ${ingredient}`);
      setStockInputs({
        ...stockInputs,
        [ingredient]: ''
      });
    }
  };

  const handleResetInventory = () => {
    if (window.confirm("Are you sure you want to reset all inventory items to 0?")) {
      resetInventory();
      showToast("Inventory reset to 0");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Inventory Admin</h1>
          <p className="subtitle">Manage raw ingredients and incoming deliveries.</p>
        </div>
        <button className="btn danger" onClick={handleResetInventory} style={{ padding: '10px 16px', fontSize: '0.9rem', width: 'auto' }}>
          <RotateCcw size={18} /> Reset All
        </button>
      </header>
      
      <div className="scrollable-content">
        {[...INVENTORY_CATEGORIES, { id: 'uncategorized', title: 'Uncategorized', items: [] }].map(category => {
          let categoryItems = [];
          if (category.id === 'uncategorized') {
            const categorizedItems = new Set(INVENTORY_CATEGORIES.flatMap(c => c.items));
            categoryItems = INGREDIENT_NAMES.filter(item => !categorizedItems.has(item));
          } else {
            categoryItems = category.items.filter(item => INGREDIENT_NAMES.includes(item));
          }

          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} className="category-section">
              <h3 className="category-title">{category.title}</h3>
              <div className="inventory-list">
                {categoryItems.map(ingredient => {
                  const currentStock = inventory[ingredient] || 0;
                  const packSize = PACK_SIZES[ingredient];
                  const packs = packSize ? Math.floor(currentStock / packSize) : 0;
                  const pieces = packSize ? currentStock % packSize : currentStock;

                  return (
                    <div key={ingredient} className="inventory-card">
                      <div className="inventory-details">
                        <h3 className="ingredient-name">{ingredient}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className={`stock-badge ${currentStock <= 10 ? 'critical' : 'healthy'}`}>
                            {packSize 
                              ? `${packs} packs & ${pieces} pcs` 
                              : `${currentStock} pcs left`
                            }
                          </span>
                          {packSize && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              Total: {currentStock} pcs
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="restock-action">
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <input 
                            type="number" 
                            min="1"
                            placeholder="Qty"
                            className="stock-input"
                            value={stockInputs[ingredient] || ''}
                            onChange={(e) => handleInputChange(ingredient, e.target.value)}
                          />
                          {PACK_SIZES[ingredient] && (
                            <select 
                              className="stock-input unit-select"
                              value={unitInputs[ingredient] || 'pcs'}
                              onChange={(e) => handleUnitChange(ingredient, e.target.value)}
                              style={{ width: '80px', padding: '0 8px' }}
                            >
                              <option value="pcs">Pcs</option>
                              <option value="packs">Packs</option>
                            </select>
                          )}
                        </div>
                        <div className="action-buttons">
                          <button 
                            className="btn add"
                            onClick={() => handleAddStock(ingredient)}
                            disabled={!stockInputs[ingredient] || parseInt(stockInputs[ingredient]) <= 0}
                          >
                            <Plus size={18} /> Add
                          </button>
                          <button 
                            className="btn deduct"
                            onClick={() => handleDeductStock(ingredient)}
                            disabled={!stockInputs[ingredient] || parseInt(stockInputs[ingredient]) <= 0}
                          >
                            <Minus size={18} /> Deduct
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
