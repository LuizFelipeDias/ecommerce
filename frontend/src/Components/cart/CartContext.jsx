import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Filtra os produtos que têm os mesmos atributos do novo produto
      const matchingItems = prevItems.filter(
        (item) => JSON.stringify(item.attributes) === JSON.stringify(product.attributes)
      );

      if (matchingItems.length > 0) {
        // Se existirem produtos com os mesmos atributos, aumenta a quantidade de cada um
        return prevItems.map((item) =>
          JSON.stringify(item.attributes) === JSON.stringify(product.attributes)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Se não existir, adiciona um novo produto ao carrinho
        return [...prevItems, { ...product, quantity: 1, uniqueId: Date.now() }];
      }
    });
  };

  const updateCartItemQuantity = (uniqueId, newQuantity) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.uniqueId === uniqueId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const updateCartItemAttributes = (uniqueId, updatedAttributes) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.uniqueId === uniqueId
          ? { ...item, attributes: updatedAttributes }
          : item
      );
    });
  };

  const removeFromCart = (uniqueId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.uniqueId !== uniqueId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItemQuantity, updateCartItemAttributes, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};