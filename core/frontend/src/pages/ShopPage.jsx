import DataPanel from "../components/DataPanel";
import { useCart } from "../context/CartContext";
import { useRole } from "../context/RoleContext";
import { useFetch } from "../hooks/useFetch";

export default function ShopPage() {
  const { data, loading, error } = useFetch("/api/products");
  const { addItem } = useCart();
  const { isUser, isAdmin } = useRole();

  return (
    <DataPanel
      title="Shop"
      subtitle="Customer role can add purchasable products to the cart"
      loading={loading}
      error={error}
    >
      {isAdmin && (
        <p className="info-banner">
          You are viewing as <strong>Admin</strong>. Switch to{" "}
          <strong>Customer</strong> to purchase products.
        </p>
      )}

      {data && (
        <div className="product-grid">
          {data.items.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>
              <div className="product-body">
                <span className="product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="product-sku">{product.sku}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <span className="muted">Stock: {product.stock}</span>
                </div>
                {!product.customer_can_buy && (
                  <span className="badge badge-enterprise">Admin / enterprise only</span>
                )}
                {product.customer_can_buy && isUser && (
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => addItem(product)}
                  >
                    Add to cart
                  </button>
                )}
                {product.customer_can_buy && isAdmin && (
                  <button type="button" className="btn" disabled>
                    Purchase disabled for admin
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </DataPanel>
  );
}
