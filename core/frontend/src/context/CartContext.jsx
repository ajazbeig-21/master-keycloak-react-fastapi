import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState({});

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const current = prev[product.id]?.quantity || 0;
      return {
        ...prev,
        [product.id]: { product, quantity: current + quantity },
      };
    });
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: { ...prev[productId], quantity },
      };
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setItems({}), []);

  const cartLines = useMemo(() => Object.values(items), [items]);

  const cartTotal = useMemo(
    () =>
      cartLines.reduce(
        (sum, line) => sum + line.product.price * line.quantity,
        0
      ),
    [cartLines]
  );

  const cartCount = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.quantity, 0),
    [cartLines]
  );

  const value = useMemo(
    () => ({
      cartLines,
      cartTotal,
      cartCount,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [cartLines, cartTotal, cartCount, addItem, setQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
