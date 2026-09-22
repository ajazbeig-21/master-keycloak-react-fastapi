import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminOnly from "../components/AdminOnly";
import DataPanel from "../components/DataPanel";
import { useRole } from "../context/RoleContext";
import { useFetch } from "../hooks/useFetch";

export default function DashboardPage() {
  const { data, loading, error } = useFetch("/api/dashboard");
  const { isAdmin, isUser } = useRole();

  return (
    <DataPanel
      title="Dashboard"
      subtitle={
        isAdmin
          ? "Sales analytics and store performance"
          : "Browse the shop and track your orders"
      }
      loading={loading}
      error={error}
    >
      {data && (
        <>
          <div className="metrics">
            {Object.entries(data.metrics).map(([key, value]) => (
              <div key={key} className="metric-card">
                <span className="metric-label">{key.replace(/_/g, " ")}</span>
                <span className="metric-value">
                  {key.includes("revenue") ? `$${value}` : value}
                </span>
              </div>
            ))}
          </div>

          {isUser && (
            <div className="hero-banner">
              <h2>Welcome to ShopWave</h2>
              <p>
                As a <strong>Customer</strong>, you can buy items marked for
                shoppers in the Shop. Enterprise-only products are visible but
                not purchasable.
              </p>
            </div>
          )}

          <AdminOnly>
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Monthly revenue</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.sales_by_month}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={2}
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3>Orders per month</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.sales_by_month}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#7c3aed" name="Orders" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card chart-card-wide">
                <h3>Revenue by category</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.revenue_by_category}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#059669" name="Revenue ($)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </AdminOnly>

          <h2 className="section-title">Recent purchases</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </DataPanel>
  );
}
