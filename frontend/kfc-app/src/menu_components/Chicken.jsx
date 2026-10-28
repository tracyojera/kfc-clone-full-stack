import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addchicken } from "../redux/action";
import { getdata } from "../utils/getdata";
import Item from "./Item";
import filterCartProducts from "./filterCartProducts";
import styles from "./item.module.css";

const Chicken = () => {
  const dispatch = useDispatch();
  const chicken = useSelector((state) => state.chicken);
  const cart = useSelector((state) => state.cart);
  const cartChicken = filterCartProducts(chicken, cart);

  const fetchData = useCallback(async () => {
    const payload = await getdata(
      "http://localhost:8081/api/product/menu?type=chicken"
    );
    dispatch(addchicken(payload));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section id="chicken">
      <h1>CHICKEN BUCKETS</h1>
      <div className={styles.itembox}>
        {cartChicken.map((item) => (
          <Item {...item} key={item._id} />
        ))}
      </div>
    </section>
  );
};

export default Chicken;
