const filterCartProducts = (products, cart) =>
  products.map((product) => {
    const cartItem = cart.find(
      (item) => String(item.id) === String(product._id)
    );

    return { ...product, qty: cartItem?.qty ?? 0 };
  });

export default filterCartProducts;
