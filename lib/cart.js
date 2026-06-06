"use client";

import { createContext, useContext, useReducer, useEffect, useState } from "react";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const key = `${action.item.productId}-${action.item.variantId}`;
      const existing = state.find((i) => `${i.productId}-${i.variantId}` === key);
      if (existing) {
        return state.map((i) =>
          `${i.productId}-${i.variantId}` === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case "REMOVE":
      return state.filter((i) => !(i.productId === action.productId && i.variantId === action.variantId));
    case "SET_QTY":
      return state
        .map((i) =>
          i.productId === action.productId && i.variantId === action.variantId
            ? { ...i, quantity: action.quantity }
            : i
        )
        .filter((i) => i.quantity > 0);
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.items;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("xuvia-cart");
      if (stored) dispatch({ type: "HYDRATE", items: JSON.parse(stored) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("xuvia-cart", JSON.stringify(items));
  }, [items, ready]);

  const addToCart = (item) => {
    dispatch({ type: "ADD", item });
    setOpen(true);
  };
  const removeFromCart = (productId, variantId) =>
    dispatch({ type: "REMOVE", productId, variantId });
  const setQuantity = (productId, variantId, quantity) =>
    dispatch({ type: "SET_QTY", productId, variantId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, open, setOpen, addToCart, removeFromCart, setQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
