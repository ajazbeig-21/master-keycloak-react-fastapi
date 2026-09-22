import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import AdminOnly from "../components/AdminOnly";
import DataPanel from "../components/DataPanel";
import { useFetch } from "../hooks/useFetch";

const PIE_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626"];

export default function ReportsPage() {
  const { data, loading, error } = useFetch("/api/reports");

  return (
    <DataPanel
      title="Reports"
      subtitle="Analytics and inventory insights (admin role)"
      loading={loading}
      error={error}
    >
      <AdminOnly>
        {data && (
          <>
            <div className="metrics">
              {Object.entries(data.summary).map(([key, value]) => (
                <div key={key} className="metric-card">
                  <span className="metric-label">{key.replace(/_/g, " ")}</span>
                  <span className="metric-value">
                    {String(key).includes("revenue") || key === "average_order_value"
                      ? `$${value}`
                      : value}
                  </span>
                </div>
              ))}
            </div>

            <div className="charts-grid reports-grid">
              <div className="chart-card">
                <h3>Orders by status</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={data.orders_by_status}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {data.orders_by_status.map((entry, index) => (
                        <Cell
                          key={entry.status}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Top products</h3>
                <table className="table compact">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Units</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.top_products.map((row) => (
                      <tr key={row.product_id}>
                        <td>{row.name}</td>
                        <td>{row.units_sold}</td>
                        <td>${row.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="section-title">Low stock alert</h3>
            {data.low_stock.length === 0 ? (
              <p className="muted">All shopper SKUs are adequately stocked.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Stock left</th>
                  </tr>
                </thead>
                <tbody>
                  {data.low_stock.map((row) => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </AdminOnly>
    </DataPanel>
  );
}
