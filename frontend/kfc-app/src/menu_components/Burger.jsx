
import { addburger } from '../redux/action';
import { getdata } from "../utils/getdata"
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./item.module.css"
import Item from './Item';
import filterCartProducts from "./filterCartProducts"
const Burger = () => {
    const dispatch = useDispatch();
    const burger = useSelector((state)=>state.burger);
    const cart = useSelector((state)=>state.cart);
    const cartBurger = filterCartProducts(burger, cart);

    const fetchData = useCallback(async () => {
        const payload = await getdata("https://kfc-clone-full-stack-1.onrender.com/api/product/menu?type=burger");
        dispatch(addburger(payload));
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

  return (
  <div id="burger">
    <h1>BURGERS</h1>
   <div className={styles.itembox} >
    {cartBurger.map((el)=>{
      return <Item {...el} key={el._id}  />
    })}
   </div>
  </div>
  )
}

export default Burger