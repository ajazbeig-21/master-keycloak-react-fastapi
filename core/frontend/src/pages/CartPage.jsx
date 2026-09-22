import { useState } from "react";
import { Link } from "react-router-dom";
import { postApi } from "../api";
import DataPanel from "../components/DataPanel";
import { useCart } from "../context/CartContext";
import { useRole } from "../context/RoleContext";

export default function CartPage() {
  const { cartLines, cartTotal, setQuantity, removeItem, clearCart } = useCart();
  const { isUser, customerName } = useRole();
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCheckout() {
    if (!isUser) {
      setCheckoutError("Switch to Customer role to complete a purchase.");
      return;
    }
    if (cartLines.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setCheckoutError("");
    setCheckoutSuccess("");

    try {
      const order = await postApi("/api/orders", {
        customer: customerName.trim() || "Guest",
        items: cartLines.map((line) => ({
          product_id: line.product.id,
          quantity: line.quantity,
        })),
      });
      clearCart();
      setCheckoutSuccess(`Order #${order.id} placed — total $${order.total.toFixed(2)}`);
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DataPanel title="Cart" subtitle="Checkout is available in Customer role only">
      {!isUser && (
        <p className="info-banner">
          Admins cannot checkout here. Use <strong>All Purchases</strong> to monitor
          orders placed by customers.
        </p>
      )}

      {cartLines.length === 0 ? (
        <p className="muted">
          No items yet. <Link to="/shop">Go shopping</Link>
        </p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Line total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cartLines.map((line) => (
                <tr key={line.product.id}>
                  <td>{line.product.name}</td>
                  <td>${line.product.price.toFixed(2)}</td>
                  <td>
                    <input
                      className="qty-input"
                      type="number"
                      min={1}
                      max={99}
                      value={line.quantity}
                      disabled={!isUser}
                      onChange={(e) =>
                        setQuantity(line.product.id, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>${(line.product.price * line.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-link"
                      disabled={!isUser}
                      onClick={() => removeItem(line.product.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary">
            <strong>Total: ${cartTotal.toFixed(2)}</strong>
            <button
              type="button"
              className="btn primary"
              disabled={!isUser || submitting}
              onClick={handleCheckout}
            >
              {submitting ? "Placing order…" : "Place order"}
            </button>
          </div>
        </>
      )}

      {checkoutError && <p className="error">{checkoutError}</p>}
      {checkoutSuccess && <p className="success">{checkoutSuccess}</p>}
    </DataPanel>
  );
}
