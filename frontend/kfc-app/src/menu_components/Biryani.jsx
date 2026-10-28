
import { addbiryani } from '../redux/action';
import { getdata } from "../utils/getdata"
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./item.module.css"
import Item from './Item';
import filterCartProducts from "./filterCartProducts"

const Biryani = () => {
    const dispatch = useDispatch();
    const biryani = useSelector((state)=>state.biryani)
    const cart = useSelector((state)=>state.cart);
    const cartBiryani = filterCartProducts(biryani, cart);

    const fetchData = useCallback(async () => {
        const payload = await getdata("http://localhost:8081/api/product/menu?type=biryani");
        dispatch(addbiryani(payload));
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

  return (
  <div id="biryani">
    <h1>BIRYANI BUCKETS</h1>
   <div className={styles.itembox} >
    {cartBiryani.map((el)=>{
      return <Item {...el} key={el._id}  />
    })}
   </div>
  </div>
  )
}

export default Biryani