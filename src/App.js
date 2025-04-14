import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Divider,
  useToast,
  Card,
  CardBody,
  Stack,
  Flex,
  Badge,
} from "@chakra-ui/react";

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
  const toast = useToast();

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
      toast({ title: "Please enter your name.", status: "warning", duration: 3000 });
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
    <Box maxW="800px" mx="auto" p={6}>
      <Heading mb={6}>Fish Fry Ordering</Heading>
      <VStack align="stretch" spacing={6}>
        {Object.entries(menu).map(([category, items]) => (
          <Box key={category}>
            <Heading size="md" mb={2}>{category}</Heading>
            <Flex flexWrap="wrap" gap={4}>
              {items.map((item) => (
                <Card key={item.name} w="200px">
                  <CardBody>
                    <Stack spacing={3}>
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text>${item.price}</Text>
                      <Button size="sm" colorScheme="blue" onClick={() => addToCart(item)}>Add</Button>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          </Box>
        ))}

        <Divider />

        <Box>
          <Heading size="md" mb={2}>Your Cart</Heading>
          {cart.length === 0 ? (
            <Text>No items yet.</Text>
          ) : (
            <VStack align="stretch" spacing={2}>
              {cart.map((item, index) => (
                <HStack key={index} justify="space-between" align="start">
                  <Box>
                    <Text>
                      {item.qty} x {item.name} - ${item.qty * item.price}
                    </Text>
                    {item.note && <Text fontSize="sm" color="gray.500">Note: {item.note}</Text>}
                  </Box>
                  <HStack>
                    <Button size="xs" onClick={() => decreaseQty(index)}>-</Button>
                    <Button size="xs" onClick={() => addToCart(item)}>+</Button>
                    <Button size="xs" colorScheme="red" onClick={() => removeFromCart(index)}>Remove</Button>
                  </HStack>
                </HStack>
              ))}
            </VStack>
          )}
          <Text mt={4} fontWeight="bold">Total: ${total}</Text>
          <Input
            mt={4}
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <Button mt={2} colorScheme="green" onClick={handleCheckout}>
            Place Order
          </Button>
        </Box>

        {orderPlaced && latestOrder && (
          <Box bg="green.50" p={4} borderRadius="md" mt={4}>
            <Heading size="sm">Order Receipt</Heading>
            <Text>Order #{latestOrder.id}</Text>
            <Text><strong>Name:</strong> {latestOrder.name}</Text>
            <VStack align="start" spacing={1} mt={2}>
              {latestOrder.items.map((item, i) => (
                <Text key={i}>
                  {item.qty} x {item.name} - ${item.qty * item.price}{" "}
                  {item.note && <em>(Note: {item.note})</em>}
                </Text>
              ))}
            </VStack>
            <Text mt={2}><strong>Total:</strong> ${latestOrder.total}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default App;

