import DataPanel from "../components/DataPanel";
import { useRole } from "../context/RoleContext";
import { useFetch } from "../hooks/useFetch";

export default function MyOrdersPage() {
  const { customerName, isUser } = useRole();
  const query = customerName.trim()
    ? `?customer=${encodeURIComponent(customerName.trim())}`
    : "";
  const { data, loading, error } = useFetch(`/api/orders${query}`);

  return (
    <DataPanel
      title="My Orders"
      subtitle={
        isUser
          ? `Orders for ${customerName || "Guest"}`
          : "Preview as Customer to see personal order history"
      }
      loading={loading}
      error={error}
    >
      {data && data.items.length === 0 && (
        <p className="muted">No orders yet. Place one from the Cart.</p>
      )}
      {data && data.items.length > 0 && (
        <div className="order-list">
          {data.items.map((order) => (
            <article key={order.id} className="order-card">
              <header>
                <span>Order #{order.id}</span>
                <span className={`badge badge-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </header>
              <p className="muted">{order.created_at}</p>
              <ul>
                {order.items?.map((item) => (
                  <li key={`${order.id}-${item.product_id}`}>
                    {item.name} × {item.quantity} — ${item.line_total.toFixed(2)}
                  </li>
                ))}
              </ul>
              <footer>Total: ${order.total.toFixed(2)}</footer>
            </article>
          ))}
        </div>
      )}
    </DataPanel>
  );
}
