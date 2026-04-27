import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { MENU_CATEGORIES } from '../data/menu';
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';

export default function SalesKiosk() {
  const { 
    dailySales, 
    menuItems, 
    cart, 
    addToCart, 
    updateCartQuantity,
    removeFromCart, 
    clearCart, 
    checkout, 
    showToast 
  } = useStore();
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleItemClick = (key) => {
    setSelectedItem({ key, ...menuItems[key] });
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedItem && quantity > 0) {
      addToCart(selectedItem.key, quantity);
      showToast(`Added ${quantity}x ${selectedItem.display}`);
      setSelectedItem(null);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const totalPrice = cart.reduce((sum, item) => {
      const menuItem = menuItems[item.itemKey];
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0);

    checkout();
    showToast(`Order Complete: ₱${totalPrice.toFixed(2)}`);
    setIsCartOpen(false); // Close cart on mobile after checkout
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

  const cartTotal = cart.reduce((sum, item) => {
    const menuItem = menuItems[item.itemKey];
    return sum + (menuItem?.price || 0) * item.quantity;
  }, 0);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page-container">
      <div className="kiosk-layout">
        {/* Menu Side */}
        <div className="menu-container">
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
        </div>

        {/* Floating Cart Bar (Mobile Only) */}
        {cart.length > 0 && (
          <div className="floating-cart-bar" onClick={() => setIsCartOpen(true)}>
            <div className="cart-bar-info">
              <div className="cart-count-badge">{totalItemsCount}</div>
              <div className="cart-bar-total">₱{cartTotal.toFixed(2)}</div>
            </div>
            <button className="btn-view-order">
              View Order <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Order Summary Panel (Sidebar on Desktop, Full Screen Modal on Mobile) */}
        <aside className={`order-panel ${isCartOpen ? 'open' : ''}`}>
          <div className="order-header">
            <button className="order-close-btn" onClick={() => setIsCartOpen(false)}>
              <ChevronDown size={24} />
            </button>
            <h2><ShoppingCart size={24} /> {isCartOpen ? 'Your Order' : 'Current Order'}</h2>
            {cart.length > 0 && (
              <button className="remove-btn" onClick={clearCart} title="Clear All">
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <div className="order-items">
            {cart.length === 0 ? (
              <div className="empty-cart-msg">
                <ShoppingCart size={48} />
                <p>Order is empty.<br/>Select items to begin.</p>
              </div>
            ) : (
              cart.map((item) => {
                const menuItem = menuItems[item.itemKey];
                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{menuItem?.display}</span>
                      <span className="cart-item-details">
                        {item.quantity}x @ ₱{menuItem?.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-qty-controls">
                        <button 
                          className="qty-mini-btn"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button 
                          className="qty-mini-btn"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="cart-item-price">
                        ₱{((menuItem?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                      <button 
                        className="remove-btn" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="order-footer">
            <div className="order-total-row">
              <span className="total-label">Total Amount</span>
              <span className="total-amount">₱{cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              className="btn-checkout" 
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              <CheckCircle size={24} />
              Confirm Order
            </button>
          </div>
        </aside>
      </div>

      {/* Item Selection Modal */}
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
                <Minus size={24} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                className="qty-btn increment" 
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus size={24} />
              </button>
            </div>
            
            <div className="modal-subtotal">
              Subtotal: <strong>₱{(selectedItem.price * quantity).toFixed(2)}</strong>
            </div>
            
            <div className="modal-footer">
              <button className="btn cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn confirm" onClick={handleAddToCart}>
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
