import React, { useState } from "react";
import { Plus, Minus, ShoppingCart, Trash2, CheckCircle } from "lucide-react";

/**
 * SimpleCart.jsx
 *
 * Shopping cart component for Vite + React.
 * - Items are added via a Select button (icon)
 * - Once selected, item is greyed out and icon hidden
 * - Cart shows items with quantity + / – controls
 * - Show Order opens a modal with order details
 * - Empty Cart clears all items
 * - Make Order confirms order and clears the cart
 * - Items return to selectable state if removed from cart
 */

// ---------------------- Cart ----------------------
const Cart = ({ cartItems, onEmpty, onShowOrder, onRemove, onUpdateQty }) => {
  const totalQty = cartItems.reduce((sum, it) => sum + it.qty, 0);
  return (
    <div className="min-h-[200px] p-4 border-2 rounded bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg flex items-center gap-1">
          <ShoppingCart className="w-5 h-5" /> Cart ({totalQty})
        </h2>
        <div className="space-x-2">
          <button
            className="px-3 py-1 border rounded"
            onClick={onShowOrder}
            disabled={cartItems.length === 0}
          >
            Show Order
          </button>

          <button
            className="px-3 py-1 border rounded bg-red-100"
            onClick={onEmpty}
            disabled={cartItems.length === 0}
          >
            Empty Cart
          </button>
        </div>
      </div>

      <div className="min-h-[120px] p-2">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items in cart</p>
        ) : (
          cartItems.map((it) => (
            <div
              key={it.name}
              className="flex justify-between items-center p-2 bg-white rounded mb-2 shadow-sm"
            >
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <button
                    className="p-1 border rounded"
                    onClick={() => onUpdateQty(it.name, it.qty - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span>{it.qty}</span>
                  <button
                    className="p-1 border rounded"
                    onClick={() => onUpdateQty(it.name, it.qty + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                className="p-1 border rounded text-red-600"
                onClick={() => onRemove(it.name)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ---------------------- Simple Modal ----------------------
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        {children}
      </div>
    </div>
  );
};

// ---------------------- Main Component ----------------------
export default function SimpleCart() {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const items = [
    { name: "Apple", price: 2 },
    { name: "Banana", price: 1 },
    { name: "Orange", price: 3 },
    { name: "Mango", price: 4 },
    { name: "Grapes", price: 5 },
    { name: "Pineapple", price: 6 },
  ];

  const handleAdd = (item) => {
    
    setCartItems((prev) => {
      const existing = prev.find((p) => p.name === item.name);
      if (existing) {
        return prev.map((p) =>
          p.name === item.name ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleEmpty = () => setCartItems([]);

  const handleShowOrder = () => {
    setOrderPlaced(false);
    setShowModal(true);
  };

  const handleMakeOrder = () => {
    console.log("Order created:", cartItems);
    setOrderPlaced(true);
    setCartItems([]);
  };

  const handleRemove = (name) =>
    setCartItems((prev) => prev.filter((p) => p.name !== name));

  const handleUpdateQty = (name, qty) => {
    setCartItems((prev) =>
      prev
        .map((p) => (p.name === name ? { ...p, qty } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const isInCart = (name) => cartItems.some((p) => p.name === name);

  const totalQty = cartItems.reduce((sum, it) => sum + it.qty, 0);
  const totalPrice = cartItems.reduce((sum, it) => sum + it.qty * it.price, 0);

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <div>
        <h2 className="font-bold mb-2">🍎 Items</h2>
        <div className="p-2 bg-white rounded border">
          {items.map((item) => {
            const inCart = isInCart(item.name);
            return (
              <div
                key={item.name}
                className={`flex justify-between items-center p-2 border-b last:border-b-0 ${
                  inCart ? "bg-gray-100 text-gray-400" : ""
                }`}
              >
                <span>
                  {item.name} <span className="text-gray-500">(${item.price})</span>
                </span>
                {!inCart && (
                  <button
                    className="p-1 border rounded bg-blue-100"
                    onClick={() => handleAdd(item)}
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Cart
        cartItems={cartItems}
        onEmpty={handleEmpty}
        onShowOrder={handleShowOrder}
        onRemove={handleRemove}
        onUpdateQty={handleUpdateQty}
      />

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-xl font-bold mb-4">Your Order</h3>

        {orderPlaced ? (
          <div>
            <p className="mb-4">✅ Order placed successfully!</p>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 mb-4">Cart is empty.</p>
            ) : (
              <>
                <ul className="mb-4 space-y-2">
                  {cartItems.map((it) => (
                    <li
                      key={it.name}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {it.name} (${it.price})
                      </span>
                      <span className="text-sm text-gray-600">
                        Qty: {it.qty} | ${it.qty * it.price}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="font-bold mb-4">
                  Total: {totalQty} items | ${totalPrice}
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={handleMakeOrder}
                disabled={cartItems.length === 0}
              >
                Make Order
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
