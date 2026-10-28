import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../redux/action";
import { getdata } from "../utils/getdata";
import filterCartProducts from "./filterCartProducts";
import Item from "./Item";
import SearchBox from "./SearchBox";
import Sidebar from "./Sidebar";
import styles from "./item.module.css";

const CATEGORY_ORDER = [
  { id: "chicken", title: "CHICKEN BUCKETS", aliases: ["chicken", "chicken buckets"] },
  { id: "launch", title: "NEW LAUNCH", aliases: ["launch", "new launch"] },
  { id: "rolls", title: "CHICKEN ROLLS", aliases: ["rolls", "chicken rolls"] },
  { id: "biryani", title: "BIRYANI BUCKETS", aliases: ["biryani", "biryani buckets"] },
  { id: "boxmeals", title: "BOX MEALS", aliases: ["box", "boxes", "boxmeals", "box meals"] },
  { id: "burger", title: "BURGERS", aliases: ["burger", "burgers"] },
  { id: "stayhome", title: "STAY HOME SPECIALS", aliases: ["stayhome", "stay home specials"] },
  { id: "snacks", title: "SNACKS & SIDES", aliases: ["snacks", "sides", "snacks & sides"] },
  { id: "beverages", title: "BEVERAGES", aliases: ["beverage", "beverages", "drink", "drinks"] },
];
const ROLLS_CATEGORY = CATEGORY_ORDER.find((category) => category.id === "rolls");
const BURGERS_CATEGORY = CATEGORY_ORDER.find((category) => category.id === "burger");

const normalizeCategory = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");

const isDietaryLabel = (value) =>
  ["veg", "non veg"].includes(normalizeCategory(value));

const getCategory = (product) => {
  const values = [product.category, product.type].filter(
    (value) => value && !isDietaryLabel(value)
  );
  const knownCategory = CATEGORY_ORDER.find((category) =>
    values.some((value) => category.aliases.includes(normalizeCategory(value)))
  );

  if (knownCategory) return knownCategory;

  if (!values.length) {
    const productText = [product.title, product.name, product.desc, product.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return /\brolls?\b/.test(productText) ? ROLLS_CATEGORY : BURGERS_CATEGORY;
  }

  const label = String(values[0]).trim();
  const id = `category-${normalizeCategory(label).replace(/[^a-z0-9]+/g, "-")}`;
  return { id, title: label.toUpperCase(), aliases: [normalizeCategory(label)] };
};

const MenuItem = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartReady, setCartReady] = useState(false);
  const [cartError, setCartError] = useState("");

  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const items = await getdata("http://localhost:8081/api/product/menu");

      if (!Array.isArray(items)) {
        throw new Error("The menu API did not return a product list.");
      }

      setProducts(items);
    } catch (requestError) {
      console.error("Unable to load menu products:", requestError);
      setError("The menu could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCart = useCallback(async () => {
    try {
      setCartReady(false);
      setCartError("");
      const items = await getdata("http://localhost:8081/api/productcart/cart");

      if (!Array.isArray(items)) {
        throw new Error("The cart API did not return a cart list.");
      }

      dispatch(getCart(items));
      setCartReady(true);
    } catch (requestError) {
      console.error("Unable to load cart:", requestError);
      setCartError("Your cart could not be loaded, so cart controls are disabled.");
    }
  }, [dispatch]);

  useEffect(() => {
    loadMenu();
    loadCart();
  }, [loadCart, loadMenu]);

  const categories = useMemo(() => {
    const groupedProducts = new Map();

    products.forEach((product) => {
      const category = getCategory(product);
      if (!groupedProducts.has(category.id)) {
        groupedProducts.set(category.id, { ...category, products: [] });
      }
      groupedProducts.get(category.id).products.push(product);
    });

    return [...groupedProducts.values()].sort((first, second) => {
      const firstIndex = CATEGORY_ORDER.findIndex((category) => category.id === first.id);
      const secondIndex = CATEGORY_ORDER.findIndex((category) => category.id === second.id);
      if (firstIndex === -1) return secondIndex === -1 ? first.title.localeCompare(second.title) : 1;
      if (secondIndex === -1) return -1;
      return firstIndex - secondIndex;
    });
  }, [products]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        products: filterCartProducts(category.products, cart).filter((product) =>
          [
            product.title,
            product.name,
            product.desc,
            product.description,
            product.category,
            product.type,
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query))
        ),
      }))
      .filter((category) => category.products.length > 0);
  }, [cart, categories, search]);

  return (
    <div className={styles.menuPage}>
      <Sidebar categories={categories} />
      <main className={styles.menuContent}>
        <SearchBox value={search} onChange={setSearch} />
        {loading && <p className={styles.menuStatus}>Loading menu...</p>}
        {error && (
          <p className={styles.menuError} role="alert">
            {error}{" "}
            <button type="button" onClick={loadMenu}>
              Try again
            </button>
          </p>
        )}
        {cartError && (
          <p className={styles.menuError} role="alert">
            {cartError}
            <button type="button" onClick={loadCart}>
              Try again
            </button>
          </p>
        )}
        {!loading && !error && filteredCategories.length === 0 && (
          <p className={styles.menuStatus}>
            {search.trim()
              ? "No menu items match your search."
              : "There are no menu items to display."}
          </p>
        )}
        {!loading &&
          filteredCategories.map((category) => (
            <section
              className={styles.menuCategory}
              id={category.id}
              key={category.id}
            >
              <h1>{category.title}</h1>
              <div className={styles.itembox}>
                {category.products.map((product) => (
                  <Item
                    {...product}
                    category={product.category || product.type || category.title}
                    cartReady={cartReady}
                    key={product._id}
                  />
                ))}
              </div>
            </section>
          ))}
      </main>
    </div>
  );
};

export { MenuItem };
