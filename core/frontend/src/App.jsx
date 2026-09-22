import { NavLink, Route, Routes } from "react-router-dom";
import { ROLES, useRole } from "./context/RoleContext";
import { useCart } from "./context/CartContext";
import DashboardPage from "./pages/DashboardPage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ReportsPage from "./pages/ReportsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import "./App.css";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/cart", label: "Cart" },
  { to: "/my-orders", label: "My Orders" },
  { to: "/reports", label: "Reports" },
  { to: "/admin-orders", label: "All Purchases" },
];

export default function App() {
  const { role, setRole, customerName, setCustomerName, isAdmin } = useRole();
  const { cartCount } = useCart();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">ShopWave</div>
        <p className="brand-tag">E‑commerce demo</p>

        <div className="role-switch">
          <span className="role-label">Acting as</span>
          <div className="role-buttons">
            <button
              type="button"
              className={role === ROLES.USER ? "role-btn active" : "role-btn"}
              onClick={() => setRole(ROLES.USER)}
            >
              Customer
            </button>
            <button
              type="button"
              className={role === ROLES.ADMIN ? "role-btn active" : "role-btn"}
              onClick={() => setRole(ROLES.ADMIN)}
            >
              Admin
            </button>
          </div>
          {!isAdmin && (
            <label className="customer-field">
              <span>Name</span>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
              />
            </label>
          )}
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
              {item.to === "/cart" && cartCount > 0 && (
                <span className="nav-badge">{cartCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin-orders" element={<AdminOrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}
