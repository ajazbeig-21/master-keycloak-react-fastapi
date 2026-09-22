import { useCallback, useEffect, useState } from "react";
import { fetchApi } from "../api";
import AdminOnly from "../components/AdminOnly";
import DataPanel from "../components/DataPanel";

export default function AdminOrdersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    fetchApi("/api/orders")
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 8000);
    return () => clearInterval(timer);
  }, [load]);

  return (
    <DataPanel
      title="All Purchases"
      subtitle="Live view of every customer order (admin role)"
      loading={loading}
      error={error}
      actions={
        <button type="button" className="btn" onClick={load}>
          Refresh
        </button>
      }
    >
      <AdminOnly>
        {data && (
          <>
            <p className="muted">{data.total} order(s) — auto-refresh every 8s</p>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Placed at</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      {order.items
                        ?.map((i) => `${i.name} (${i.quantity})`)
                        .join(", ")}
                    </td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="muted">{order.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </AdminOnly>
    </DataPanel>
  );
}
