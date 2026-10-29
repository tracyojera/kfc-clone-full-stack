import React, { useState } from 'react'
import styles from "./cart.module.css"
import axios from "axios"
import { useDispatch } from 'react-redux'
import { addcartcount, deleteCart } from '../redux/action'
import { useFallbackImage } from '../utils/imageFallback'
import { formatUGX, getPriceAmount, getSafeQuantity } from '../utils/currency'

const Cartproduct = ({desc,id,image,price,qty,title}) => {
const dispatch= useDispatch();
const [isUpdating, setIsUpdating] = useState(false);
const [error, setError] = useState("");
const acprice = getPriceAmount(price);
const quantity = getSafeQuantity(qty);

const handleRemove = async () =>{
  if (isUpdating) return;

  try {
    setIsUpdating(true);
    setError("");
    await axios.delete(`https://kfc-clone-full-stack-1.onrender.com/api/productcart/cart/${id}`);
    dispatch(deleteCart(id));
  } catch (requestError) {
    console.error("Unable to remove cart item:", requestError);
    setError("Could not remove this item. Please try again.");
  } finally {
    setIsUpdating(false);
  }
};

const updateQuantity = async (nextQuantity) => {
  if (isUpdating || nextQuantity < 0) return;

  const item = {
    id,
    image,
    price: acprice,
    title,
    desc,
    qty: nextQuantity
  };

  try {
    setIsUpdating(true);
    setError("");
    const response = await axios.put(
      `https://kfc-clone-full-stack-1.onrender.com/api/productcart/cart/${id}`,
      item
    );

    if (nextQuantity > 0 && !response.data?._id) {
      throw new Error("Cart item was not found.");
    }

    dispatch(addcartcount(item));
  } catch (requestError) {
    console.error("Unable to update cart item quantity:", requestError);
    setError(
      requestError.response?.data?.message ||
      requestError.message ||
      "Could not update quantity. Please try again."
    );
  } finally {
    setIsUpdating(false);
  }
}

  return (
    <div className={styles.cartproductmain} >
        <div className={styles.cartproductleft}>
            <img src={image} onError={useFallbackImage} alt={title || "food"} />
            <div className={styles.cartDetails}>
                <h3>{title}</h3>
                <ul>
                    <li>{desc}</li>
                </ul>
                <button
                className={styles.removeButton}
                type="button"
                disabled={isUpdating}
                onClick={handleRemove}
                >Remove</button>
            </div>
        </div>
        <div className={styles.cartproductright} >
          <div className={styles.quantityControl}>
                <button
                type="button"
                aria-label={`Remove one ${title || "item"}`}
                disabled={isUpdating || quantity === 0}
                onClick={()=>updateQuantity(quantity - 1)}
                >&#8211;</button>
                <span aria-live="polite">{quantity}</span>
                <button
                type="button"
                aria-label={`Add one ${title || "item"}`}
                disabled={isUpdating}
                onClick={()=>updateQuantity(quantity + 1)}
                >&#43;</button>
          </div>
          <h3 className={styles.cartAmount}>{formatUGX(acprice * quantity)}</h3>
        </div>
        {error && <p className={styles.cartUpdateError} role="alert">{error}</p>}
    </div>
  )
}

export default Cartproduct