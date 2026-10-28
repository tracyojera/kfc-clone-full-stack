
import { addsnacks } from '../redux/action';
import { getdata } from "../utils/getdata"
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./item.module.css"
import Item from './Item';
import filterCartProducts from "./filterCartProducts"
const Snacks = () => {
    const dispatch = useDispatch();
    const snacks = useSelector((state)=>state.snacks);
    const cart = useSelector((state)=>state.cart);
    const cartSnacks = filterCartProducts(snacks, cart);

    const fetchData = useCallback(async () => {
        const payload = await getdata("http://localhost:8081/api/product/menu?type=snacks");
        dispatch(addsnacks(payload));
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

  return (
  <div id="snacks">
    <h1>SNACKS</h1>
   <div className={styles.itembox} >
    {cartSnacks.map((el)=>{
      return <Item {...el} key={el._id}  />
    })}
   </div>
  </div>
  )
}

export default Snacks