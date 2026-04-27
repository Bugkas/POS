import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Store, LayoutDashboard, TrendingUp, Menu } from 'lucide-react';
import SalesKiosk from './components/SalesKiosk';
import InventoryAdmin from './components/InventoryAdmin';
import ManagerReport from './components/ManagerReport';
import SalesReport from './components/SalesReport';
import PurchaseLogs from './components/PurchaseLogs';
import MenuAdmin from './components/MenuAdmin';
import MoreMenu from './components/MoreMenu';
import UpdateCheck from './components/UpdateCheck';
import Toast from './components/Toast';
import UpdateManager from './components/UpdateManager';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="bottom-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} end>
            <Store size={24} />
            <span>Kiosk</span>
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard size={24} />
            <span>Stock</span>
          </NavLink>
          <NavLink to="/sales" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <TrendingUp size={24} />
            <span>Sales</span>
          </NavLink>
          <NavLink to="/more" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Menu size={24} />
            <span>More</span>
          </NavLink>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SalesKiosk />} />
            <Route path="/sales" element={<SalesReport />} />
            <Route path="/logs" element={<PurchaseLogs />} />
            <Route path="/inventory" element={<InventoryAdmin />} />
            <Route path="/report" element={<ManagerReport />} />
            <Route path="/settings" element={<MenuAdmin />} />
            <Route path="/more" element={<MoreMenu />} />
            <Route path="/updates" element={<UpdateCheck />} />
          </Routes>
          <Toast />
          <UpdateManager />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
