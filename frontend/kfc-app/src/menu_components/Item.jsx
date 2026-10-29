import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addcart, addcartcount } from "../redux/action";
import { formatUGX, getPriceAmount } from "../utils/currency";
import { useFallbackImage } from "../utils/imageFallback";
import { getMenuImage } from "../utils/menuImages";
import styles from "./item.module.css";

const Item = ({
  _id,
  image,
  price,
  title,
  name,
  desc,
  description,
  type,
  cartReady = true,
  qty = 0,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const quantity = Number(qty) || 0;
  const itemTitle = title || name || "Menu item";
  const itemDescription = desc || description;
  const menuImage = getMenuImage(itemTitle, image);
  const itemPrice = getPriceAmount(price);

  const addItemToCart = async () => {
    if (isUpdating) return;

    const item = {
      id: _id,
      image: menuImage,
      price: itemPrice,
      title: itemTitle,
      desc: itemDescription,
      qty: 1,
    };

    try {
      setIsUpdating(true);
      setError("");
      await axios.post("https://kfc-clone-full-stack-1.onrender.com/api/productcart/cart", item);
      dispatch(addcart(item));
    } catch (requestError) {
      console.error("Unable to add menu item to cart:", requestError);
      setError("Could not add this item. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateQuantity = async (nextQuantity) => {
    if (isUpdating || nextQuantity < 0) return;

    const item = {
      id: _id,
      image: menuImage,
      price: itemPrice,
      title: itemTitle,
      desc: itemDescription,
      qty: nextQuantity,
    };

    try {
      setIsUpdating(true);
      setError("");
      const response = await axios.put(
        `https://kfc-clone-full-stack-1.onrender.com/api/productcart/cart/${_id}`,
        item
      );

      if (nextQuantity > 0 && Array.isArray(response.data) && !response.data.length) {
        throw new Error("Cart item was not found.");
      }

      dispatch(addcartcount(item));
    } catch (requestError) {
      console.error("Unable to update menu item quantity:", requestError);
      setError("Could not update quantity. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCartIconClick = () => {
    if (quantity > 0) {
      updateQuantity(quantity + 1);
      return;
    }

    addItemToCart();
  };

  return (
    <article className={styles.innerbox}>
      <img
        onClick={() => navigate(`/menu/${_id}`)}
        src={menuImage}
        onError={useFallbackImage}
        alt={itemTitle}
      />
      <div>
        <h3 className={styles.title}>{itemTitle}</h3>
        {type && <p className={styles.itemType}>{type}</p>}
        <h3>{formatUGX(itemPrice)}</h3>
        <p className={styles.desc}>{itemDescription}</p>
        <div className={styles.cartbutton}>
          {quantity === 0 ? (
            <button
              className={styles.addto}
              type="button"
              disabled={isUpdating || !cartReady}
              onClick={addItemToCart}
            >
              {isUpdating ? "Adding..." : "Add to cart"}
            </button>
          ) : (
            <div className={styles.quantityControl}>
              <button
                className={styles.minus}
                type="button"
                aria-label={`Remove one ${itemTitle}`}
                disabled={isUpdating || !cartReady}
                onClick={() => updateQuantity(quantity - 1)}
              >
                &#8211;
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                className={styles.plus}
                type="button"
                aria-label={`Add one ${itemTitle}`}
                disabled={isUpdating || !cartReady}
                onClick={() => updateQuantity(quantity + 1)}
              >
                &#43;
              </button>
            </div>
          )}
          <button
            className={styles.cartIconButton}
            type="button"
            aria-label={`Add ${itemTitle} to cart`}
            disabled={isUpdating || !cartReady}
            onClick={handleCartIconClick}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </button>
        </div>
        {error && (
          <p className={styles.cartError} role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
};

export default Item;
