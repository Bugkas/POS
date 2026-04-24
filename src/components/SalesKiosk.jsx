import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { MENU_ITEMS, MENU_CATEGORIES } from '../data/menu';

export default function SalesKiosk() {
  const { dailySales, processSale, showToast, menuItems } = useStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleItemClick = (key) => {
    setSelectedItem({ key, ...menuItems[key] });
    setQuantity(1);
  };

  const handleConfirm = () => {
    if (selectedItem && quantity > 0) {
      processSale(selectedItem.key, quantity);
      showToast(`Sold ${quantity}x ${selectedItem.display}`);
      setSelectedItem(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const scrollToCategory = (id) => {
    const element = document.getElementById(`cat-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="page-container">
      <header className="sticky-header">
        <div className="stat-card highlight">
          <span className="stat-label">Total Sales Today</span>
          <h2 className="stat-value">₱{dailySales.toFixed(2)}</h2>
        </div>
        
        <div className="category-nav">
          {MENU_CATEGORIES.map(category => (
            <button 
              key={category.id} 
              className="category-chip"
              onClick={() => scrollToCategory(category.id)}
            >
              {category.title}
            </button>
          ))}
        </div>
      </header>
      
      <div className="scrollable-content">
        {MENU_CATEGORIES.map(category => (
          <div key={category.id} id={`cat-${category.id}`} className="category-section">
            <h3 className="category-title">{category.title}</h3>
            <div className="bento-grid">
              {category.items.map(key => {
                const item = menuItems[key];
                if (!item) return null;
                return (
                  <button 
                    key={key} 
                    className="bento-item"
                    onClick={() => handleItemClick(key)}
                  >
                    <span className="item-name">{item.display}</span>
                    <span className="item-price">₱{item.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{selectedItem.display}</h3>
            <p className="modal-subtitle">₱{selectedItem.price.toFixed(2)} each</p>
            
            <div className="qty-selector">
              <button 
                className="qty-btn decrement" 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                className="qty-btn increment" 
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>
            
            <div className="modal-subtotal">
              Subtotal: <strong>₱{(selectedItem.price * quantity).toFixed(2)}</strong>
            </div>
            
            <div className="modal-footer">
              <button className="btn cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn confirm" onClick={handleConfirm}>Confirm Sale</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
