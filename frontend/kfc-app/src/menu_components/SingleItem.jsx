import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addcart, addcartcount } from "../redux/action";
import { useFallbackImage } from "../utils/imageFallback";
import { formatUGX } from "../utils/currency";
import { getMenuImage } from "../utils/menuImages";
import styles from "./item.module.css";
import Reccom from "./Reccom";
import Beverages from "./Beverages";

const SingleItem = ({ _id, image, price, title, desc }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const cartItem = cart.find((item) => String(item.id) === String(_id));
  const quantity = Number(cartItem?.qty) || 0;
  const menuImage = getMenuImage(title, image);

  const addItemToCart = async () => {
    if (isUpdating) return;

    const item = {
      id: _id,
      image: menuImage,
      price,
      title,
      desc,
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
      price,
      title,
      desc,
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
    <div className={styles.singleupperbox}>
      <div className={styles.mainsinglebox}>
        <img src={menuImage} onError={useFallbackImage} alt={title || "food"} />
        <h2>{title}</h2>
        <p className={styles.singledesc}>{desc}</p>
        <h2>{formatUGX(price)}</h2>

        <div className={styles.cartbutton}>
          {quantity === 0 ? (
            <button
              className={styles.addto}
              type="button"
              disabled={isUpdating}
              onClick={addItemToCart}
            >
              {isUpdating ? "Adding..." : "Add to cart"}
            </button>
          ) : (
            <div className={styles.quantityControl}>
              <button
                className={styles.minus}
                type="button"
                aria-label={`Remove one ${title}`}
                disabled={isUpdating}
                onClick={() => updateQuantity(quantity - 1)}
              >
                &#8211;
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                className={styles.plus}
                type="button"
                aria-label={`Add one ${title}`}
                disabled={isUpdating}
                onClick={() => updateQuantity(quantity + 1)}
              >
                &#43;
              </button>
            </div>
          )}
          <button
            className={styles.cartIconButton}
            type="button"
            aria-label={`Add ${title || "item"} to cart`}
            disabled={isUpdating}
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
        <h1 className={styles.pepsi}>
          You can enjoy this delicious dish with
        </h1>
        <Beverages />
      </div>
      <div>
        <Reccom />
      </div>
    </div>
  );
};

export default SingleItem;
