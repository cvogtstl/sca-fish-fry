
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Flex,
  Image,
  useToast,
  Card,
  CardBody,
  Stack,
  Divider,
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
      toast({
        title: "Please enter your name.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
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
    <Box bg="gray.50" minH="100vh" py={[4, 6]} px={[2, 6]}>
      <VStack spacing={3} mb={6}>
        <Image
          src="https://saintclareofassisi.org/wp-content/uploads/2020/06/logo.png"
          alt="St. Clare of Assisi"
          boxSize={["60px", "80px", "100px"]}
        />
        <Heading color="blue.800" size={["md", "lg"]} textAlign="center">
          St. Clare Fish Fry
        </Heading>
      </VStack>

      <Flex direction={["column", null, "row"]} maxW="1200px" mx="auto" gap={6}>
        {/* Menu Section */}
        <Box flex="3">
          <VStack spacing={8} align="stretch">
            {Object.entries(menu).map(([category, items]) => (
              <Box key={category}>
                <Heading size="md" mb={2} color="blue.700">
                  {category}
                </Heading>
                <Flex wrap="wrap" gap={4}>
                  {items.map((item) => (
                    <Card
                      key={item.name}
                      w={["100%", "48%", "220px"]}
                      bg="white"
                      boxShadow="md"
                      borderRadius="lg"
                    >
                      <CardBody>
                        <Stack spacing={3}>
                          <Text fontWeight="bold">{item.name}</Text>
                          <Text fontSize="sm" color="gray.600">
                            ${item.price}
                          </Text>
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => addToCart(item)}
                            w="full"
                          >
                            Add to Cart
                          </Button>
                        </Stack>
                      </CardBody>
                    </Card>
                  ))}
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Cart Section */}
        <Box
          flex="1"
          position={["static", null, "sticky"]}
          top="20px"
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="md"
        >
          <Heading size="md" mb={3} color="blue.700">
            Your Cart
          </Heading>
          {cart.length === 0 ? (
            <Text>No items yet.</Text>
          ) : (
            <VStack align="stretch" spacing={3}>
              {cart.map((item, index) => (
                <Box key={index} borderBottom="1px solid #eee" pb={2}>
                  <Text fontWeight="medium">
                    {item.qty} x {item.name} — ${item.qty * item.price}
                  </Text>
                  {item.note && (
                    <Text fontSize="sm" color="gray.500">
                      Note: {item.note}
                    </Text>
                  )}
                  <HStack spacing={1} mt={1}>
                    <Button size="xs" onClick={() => decreaseQty(index)}>
                      -
                    </Button>
                    <Button size="xs" onClick={() => addToCart(item)}>
                      +
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="red"
                      onClick={() => removeFromCart(index)}
                    >
                      Remove
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
          <Divider my={4} />
          <Text fontWeight="bold">Total: ${total}</Text>
          <Input
            mt={3}
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <Button mt={3} colorScheme="green" width="100%" onClick={handleCheckout}>
            Place Order
          </Button>

          {orderPlaced && latestOrder && (
            <Box bg="green.50" p={3} borderRadius="md" mt={4}>
              <Heading size="sm" mb={1}>
                Order Receipt
              </Heading>
              <Text fontSize="sm">Order #{latestOrder.id}</Text>
              <Text fontSize="sm" fontWeight="medium">
                Name: {latestOrder.name}
              </Text>
              <VStack align="start" spacing={1} mt={2}>
                {latestOrder.items.map((item, i) => (
                  <Text fontSize="sm" key={i}>
                    {item.qty} x {item.name} - ${item.qty * item.price}
                    {item.note && <em> (Note: {item.note})</em>}
                  </Text>
                ))}
              </VStack>
              <Text fontWeight="bold" mt={2}>
                Total: ${latestOrder.total}
              </Text>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default App;
