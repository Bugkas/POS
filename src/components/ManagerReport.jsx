import React from 'react';
import { useStore } from '../store/useStore';
import { INGREDIENT_NAMES, INVENTORY_CATEGORIES } from '../data/ingredients';
import { MENU_ITEMS } from '../data/menu';
import { LogOut, Download } from 'lucide-react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export default function ManagerReport() {
  const { 
    dailySales, inventory, closeRegister, showToast, 
    totalCommission, setOpeningInventory, setClosingInventory,
    openingInventory, closingInventory, itemsSold, menuItems
  } = useStore();
  
  const handleCloseRegister = () => {
    if (window.confirm("Are you sure you want to close the register? This will reset today's sales to zero.")) {
      closeRegister();
      showToast("Register closed");
    }
  };

  const handleDownloadCSV = async () => {
    let csv = "DAILY REPORT\n\n";
    
    csv += `Total Sales,PHP ${dailySales.toFixed(2)}\n`;
    csv += `Total Salary/Commission,PHP ${totalCommission.toFixed(2)}\n\n`;

    csv += "PRODUCTS SOLD\n";
    csv += "Item,Quantity,Total Revenue\n";
    Object.entries(itemsSold).forEach(([key, qty]) => {
      const item = menuItems[key];
      const name = item?.display || key;
      const total = (item?.price || 0) * qty;
      csv += `"${name}",${qty},PHP ${total.toFixed(2)}\n`;
    });
    csv += "\n";

    csv += "INVENTORY STATUS\n";
    csv += "Ingredient,Opening Stock,Closing Stock,Current Stock\n";
    
    INGREDIENT_NAMES.forEach(ing => {
      const open = openingInventory?.[ing] ?? "Not Set";
      const close = closingInventory?.[ing] ?? "Not Set";
      const current = inventory[ing] || 0;
      csv += `"${ing}",${open},${close},${current}\n`;
    });

    const fileName = `DailyReport_${new Date().toISOString().split('T')[0]}.csv`;

    if (Capacitor.isNativePlatform()) {
      try {
        const result = await Filesystem.writeFile({
          path: fileName,
          data: csv,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });
        
        await Share.share({
          title: 'Daily Sales Report',
          text: 'Here is the POS Daily Sales Report',
          files: [result.uri],
          dialogTitle: 'Share Daily Report'
        });
        
        showToast("Report ready to share/save!");
      } catch (e) {
        showToast("Error sharing: " + e.message);
      }
    } else {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Report Downloaded");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Manager Report</h1>
        <p className="subtitle">End of day summary and stock snapshot.</p>
      </header>
      
      <div className="scrollable-content">
        <div className="summary-cards">
          <div className="stat-card highlight">
            <span className="stat-label">Total Sales Today</span>
            <h2 className="stat-value">₱{dailySales.toFixed(2)}</h2>
          </div>
          <div className="stat-card accent">
            <span className="stat-label">Total Commission</span>
            <h2 className="stat-value">₱{totalCommission.toFixed(2)}</h2>
          </div>
        </div>

        <div className="report-section" style={{ marginBottom: '24px' }}>
          <h2>Inventory Tracking</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn" 
              style={{ 
                flex: 1, 
                backgroundColor: (openingInventory && !closingInventory) ? 'var(--success-color)' : 'var(--surface-highlight)' 
              }} 
              onClick={() => { setOpeningInventory(); showToast("Opening Inventory Set"); }}
              disabled={openingInventory && !closingInventory}
            >
              {openingInventory && !closingInventory ? "Opening Set" : "Set Opening"}
            </button>
            <button 
              className="btn" 
              style={{ 
                flex: 1, 
                backgroundColor: closingInventory ? 'var(--success-color)' : 'var(--surface-highlight)' 
              }} 
              onClick={() => { setClosingInventory(); showToast("Closing Inventory Set"); }}
              disabled={closingInventory || !openingInventory}
            >
              {closingInventory ? "Closing Set" : "Set Closing"}
            </button>
          </div>
        </div>

        <div className="report-section">
          <h2>Remaining Inventory</h2>
          {INVENTORY_CATEGORIES.map(category => (
            <div key={category.id} style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '12px', borderBottom: '1px solid var(--surface-highlight)', paddingBottom: '4px' }}>
                {category.title}
              </h3>
              <div className="inventory-grid">
                {category.items.map(ingredient => {
                  const currentStock = inventory[ingredient] || 0;
                  return (
                    <div key={ingredient} className="report-inventory-item">
                      <span className="ingredient-name">{ingredient}</span>
                      <span className={`stock-count ${currentStock <= 10 ? 'critical' : ''}`}>
                        {currentStock}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-footer">
        <button className="btn" onClick={handleDownloadCSV} style={{ backgroundColor: 'var(--accent-color)' }}>
          <Download size={24} />
          <span>Download CSV</span>
        </button>
        <button className="btn danger" onClick={handleCloseRegister}>
          <LogOut size={24} />
          <span>Close Register</span>
        </button>
      </div>
    </div>
  );
}
