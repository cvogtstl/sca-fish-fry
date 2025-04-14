import React, { useState } from "react";

const menu = {
  Dinners: [
    { name: "1 Pc. Fried Cod Dinner", price: 13 },
    { name: "2 Pc. Fried Cod Dinner", price: 16 },
    { name: "1 Pc. Baked Cod Dinner", price: 14 },
    { name: "6 Pc. Fried Shrimp Dinner", price: 14 },
    { name: "Fried Combo: 1 Cod & 3 Shrimp", price: 16 },
  ],
  "Fish & Shrimp": [
    { name: "1 Pc. Fried Cod", price: 5 },
    { name: "1 Pc. Fried Shrimp", price: 1 },
    { name: "1 Pc. Peel & Eat Shrimp", price: 1 },
  ],
  Sides: [
    { name: "Slice of Cheese Pizza", price: 3 },
    { name: "Italian Salad", price: 7 },
    { name: "Hushpuppy (1ea)", price: 1 },
    { name: "Green Beans", price: 4 },
    { name: "Cole Slaw", price: 4 },
    { name: "Mac-n-Cheese", price: 4 },
  ],
  Drinks: [
    { name: "Soda", price: 1 },
    { name: "Beer - Cup", price: 4 },
    { name: "Beer - Pitcher", price: 14 },
    { name: "Wine", price: 5 },
    { name: "Classic Margarita", price: 8 },
    { name: "Spicy Margarita", price: 8 },
    { name: "Pitcher of Margaritas", price: 24 },
  ],
};

function App() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [latestOrder, setLatestOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  const addToCart = (item) => {
    const note = prompt("Add a note for this item (optional):", "");
    setCart((prev) => {
      const exists = prev.find((i) => i.name === item.name && i.note === note);
      if (exists) {
        return prev.map((i) =>
          i.name === item.name && i.note === note ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [...prev, { ...item, qty: 1, note }];
      }
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const decreaseQty = (index) => {
    setCart((prev) => {
      const updated = [...prev];
      if (updated[index].qty > 1) {
        updated[index].qty -= 1;
      } else {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const handleCheckout = () => {
    if (!customerName) {
      alert("Please enter your name before placing the order.");
      return;
    }
    const newOrder = {
      id: Date.now(),
      name: customerName,
      items: cart,
      total,
    };
    setOrders((prev) => [...prev, newOrder]);
    setLatestOrder(newOrder);
    setCart([]);
    setCustomerName("");
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 5000);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Fish Fry Ordering</h1>
      {Object.entries(menu).map(([category, items]) => (
        <div key={category}>
          <h2>{category}</h2>
          {items.map((item) => (
            <div key={item.name} style={{ marginBottom: 8 }}>
              <span>
                {item.name} - ${item.price}
              </span>
              <button onClick={() => addToCart(item)} style={{ marginLeft: 10 }}>
                Add
              </button>
            </div>
          ))}
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.qty} x {item.name} - ${item.qty * item.price}
              {item.note && <em> (Note: {item.note})</em>}
              <button onClick={() => decreaseQty(index)} style={{ marginLeft: 10 }}>
                -
              </button>
              <button onClick={() => addToCart(item)} style={{ marginLeft: 5 }}>
                +
              </button>
              <button onClick={() => removeFromCart(index)} style={{ marginLeft: 5 }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 16 }}>Total: ${total}</div>
      <input
        type="text"
        placeholder="Your Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        style={{ marginTop: 10, padding: 8, width: "100%" }}
      />
      <button onClick={handleCheckout} style={{ marginTop: 10 }}>
        Place Order
      </button>

      {orderPlaced && latestOrder && (
        <div style={{ background: "#e6ffe6", padding: 16, marginTop: 20 }}>
          <h3>Order Receipt</h3>
          <p>Order #{latestOrder.id}</p>
          <p>
            <strong>Name:</strong> {latestOrder.name}
          </p>
          <ul>
            {latestOrder.items.map((item, i) => (
              <li key={i}>
                {item.qty} x {item.name} - ${item.qty * item.price}
                {item.note && <em> (Note: {item.note})</em>}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total:</strong> ${latestOrder.total}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;

