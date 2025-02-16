import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCart } from "../Components/cart/CartContext";
import "./productSelected.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPlus } from "@fortawesome/free-solid-svg-icons";
import "swiper/css";
import "swiper/css/navigation";
import "./productSelected.css";



const ProductSelected = () => {
  const { id } = useParams();
  const location = useLocation();
  const product = location.state?.product;
  const { addToCart } = useCart();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [isAllAttributesSelected, setIsAllAttributesSelected] = useState(false);

  // Verifica se todos os atributos foram selecionados
  useEffect(() => {
    if (product?.attributes) {
      const allSelected = product.attributes.every(
        (attr) => selectedAttributes[attr.name]
      );
      setIsAllAttributesSelected(allSelected);
    }
  }, [selectedAttributes, product]);

  // Função para selecionar atributos
  const handleSelectAttribute = (name, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para adicionar ao carrinho
  const handleAddToCart = () => {
    if (!product || !isAllAttributesSelected) return;

    // Gera o uniqueId com base nos atributos selecionados
    const uniqueId = `${product.id}-${Object.entries(selectedAttributes)
      .sort((a, b) => a[0].localeCompare(b[0])) // Ordena os atributos por nome
      .map(([key, value]) => `${key}:${value}`) // Formata como "nome:valor"
      .join("-")}`; // Junta tudo com "-"

    // Cria um objeto com os atributos disponíveis
    const availableAttributes = product.attributes?.reduce((acc, attr) => {
      acc[attr.name] = acc[attr.name] || [];
      acc[attr.name].push(attr.value);
      return acc;
    }, {});

    const cartItem = {
      id: product.id,
      uniqueId,
      name: product.name,
      image: product.images?.[0] || "https://via.placeholder.com/300",
      price: parseFloat(product.amount || 0).toFixed(2),
      currency: product.currency_symbol,
      attributes: { ...selectedAttributes }, // Copia os atributos selecionados
      availableAttributes, // Inclui os atributos disponíveis
      quantity: 1,
    };

    addToCart(cartItem);
    console.log("Produto adicionado ao carrinho:", cartItem);
  };

  // Agrupa atributos pelo nome
  const groupedAttributes = product?.attributes?.reduce((acc, attr) => {
    (acc[attr.name] = acc[attr.name] || []).push(attr);
    return acc;
  }, {});

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img
          className="product-image"
          src={product?.images?.[0] || "https://via.placeholder.com/300"}
          alt={product?.name}
        />
      </div>
      <div className="product-details">
        <h2 className="product-title">{product?.name}</h2>
        <div className="product-attributes">
          {Object.entries(groupedAttributes || {}).map(([name, attributes], index) => (
            <div key={index} className="attribute-group">
              <h4 className="attribute-title">{name}:</h4>
              <div className="attribute-buttons">
                {attributes.map((attr, idx) => (
                  <button
                    key={idx}
                    className={`attribute-button ${
                      selectedAttributes[name] === attr.value ? "selected" : ""
                    }`}
                    style={name === "Color" ? { backgroundColor: attr.value } : {}}
                    onClick={() => handleSelectAttribute(name, attr.value)}
                  >
                    {attr.display_value}
                  </button>
                ))}
              </div>
              {!selectedAttributes[name] && (
                <p className="attribute-error">Por favor, selecione uma opção.</p>
              )}
            </div>
          ))}
        </div>

        <h3 className="product-price">
          Preço: <span>{parseFloat(product?.amount || 0).toFixed(2)} {product?.currency_symbol}</span>
        </h3>
        <button
          className={`add-to-cart ${!isAllAttributesSelected ? "disabled" : ""}`}
          onClick={handleAddToCart}
          disabled={!isAllAttributesSelected}
        >
          ADD TO CART
        </button>
        {!isAllAttributesSelected && (
          <p className="cart-error">Por favor, selecione todos os atributos antes de adicionar ao carrinho.</p>
        )}
        <p className="product-description">
          {product?.description || "Nenhuma descrição disponível."}
        </p>
      </div>
    </div>
  );
};

export default ProductSelected;