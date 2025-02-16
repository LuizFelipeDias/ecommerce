import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping, faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import "./Navbar.css";
import Logo from "../../assets/logo";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartItems = [], updateCartItemQuantity, updateCartItemAttributes, removeFromCart } = useCart();

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleQuantityChange = (uniqueId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(uniqueId); // Remove o produto se a quantidade for menor que 1
    } else {
      updateCartItemQuantity(uniqueId, newQuantity); // Atualiza a quantidade
    }
  };

  const handleAttributeChange = (uniqueId, attributeName, newValue) => {
    const item = cartItems.find((item) => item.uniqueId === uniqueId);
    if (item) {
      const updatedAttributes = {
        ...item.attributes,
        [attributeName]: newValue,
      };
      updateCartItemAttributes(uniqueId, updatedAttributes); // Atualiza apenas os atributos
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="navbar">
      <div className={`overlay ${isCartOpen ? "active" : ""}`} onClick={handleCartClick}></div>

      <div className="logo-container">
        <Logo />
      </div>

      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li className="dropdown" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
            <span>Categories</span>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/all">ALL </Link></li>
                <li><Link to="/clothes">CLOTHES</Link></li>
                <li><Link to="/tech">TECH</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="cart-container">
        <button onClick={handleCartClick} disabled={cartItems.length === 0}>
          <FontAwesomeIcon icon={faCartShopping} className="cart" />
          <div className="products-count">{cartItems.length}</div>
        </button>

        <div className={`cart-modal ${isCartOpen ? "active" : ""}`}>
          <button className="close-modal" onClick={handleCartClick}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="cart-modal-content">
            <h2 className="cart-title">YOUR BAG</h2>
            <div className="cart-items-container">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item-container">
                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">{item.price} {item.currency}</p>
                    {item.availableAttributes && (
                      <div className="cart-item-attributes">
                        {Object.entries(item.availableAttributes).map(([groupName, attributes], index) => (
                          <div key={index} className="cart-attribute-group">
                            <h4 className="cart-attribute-title">{groupName}:</h4>
                            <div className="cart-attribute-buttons">
                              {attributes.map((option, optIdx) => (
                                <button
                                  key={optIdx}
                                  className={`cart-attribute-button ${item.attributes[groupName] === option ? "selected" : ""}`}
                                  style={groupName.toLowerCase() === "color" ? { backgroundColor: option } : {}}
                                  onClick={() => handleAttributeChange(item.uniqueId, groupName, option)}
                                >
                                  {groupName.toLowerCase() !== "color" && option}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="add-and-remove-cart">
                    <div className="cart-item-quantity">
                      <button className="add-quantity" onClick={() => handleQuantityChange(item.uniqueId, item.quantity + 1)}>
                        <FontAwesomeIcon icon={faPlus} className="add"/>
                      </button>
                      <input
                        className="input-quntity"
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(item.uniqueId, parseInt(e.target.value))}
                      />
                      <button className="remove-quantity" onClick={() => handleQuantityChange(item.uniqueId, item.quantity - 1)}>
                        <FontAwesomeIcon icon={faMinus}/>
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-image-container">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                  </div>
                </div>
              ))}
            </div>
            <p className="total">TOTAL: {calculateTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;