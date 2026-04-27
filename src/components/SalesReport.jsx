import React from 'react';
import { useStore } from '../store/useStore';
import { MENU_ITEMS, SALES_ORDER } from '../data/menu';

export default function SalesReport() {
  const { itemsSold = {}, dailySales, menuItems } = useStore();

  const sortedItems = Object.entries(itemsSold)
    .sort((a, b) => {
      const indexA = SALES_ORDER.indexOf(a[0]);
      const indexB = SALES_ORDER.indexOf(b[0]);
      
      // If item is not in SALES_ORDER, put it at the end
      const posA = indexA === -1 ? 999 : indexA;
      const posB = indexB === -1 ? 999 : indexB;
      
      return posA - posB;
    });

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Sales Report</h1>
        <p className="subtitle">Detailed breakdown of products sold today.</p>
      </header>
      
      <div className="scrollable-content">
        <div className="stat-card highlight" style={{ marginBottom: '24px' }}>
          <span className="stat-label">Total Sales Today</span>
          <h2 className="stat-value">₱{dailySales.toFixed(2)}</h2>
        </div>

        <div className="report-section">
          <h2>Products Sold</h2>
          {sortedItems.length === 0 ? (
            <p className="empty-state">No products sold yet today.</p>
          ) : (
            <div className="sales-list">
              {sortedItems.map(([key, qty]) => {
                const item = menuItems[key];
                return (
                  <div key={key} className="sales-list-item">
                    <div className="item-info">
                      <span className="item-name">{item?.display || key}</span>
                      <span className="item-qty">x{qty}</span>
                    </div>
                    <span className="item-total">₱{((item?.price || 0) * qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
