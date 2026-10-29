import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addbeverages } from '../redux/action';
import { getdata } from '../utils/getdata';
import styles from "./item.module.css"
import Item from './Item';
import filterCartProducts from "./filterCartProducts"

const Beverages = () => {
 const dispatch = useDispatch();
 const beverage = useSelector((state) => state.beverages);
 const cart = useSelector((state)=>state.cart);
 const cartBeverages = filterCartProducts(beverage, cart);

 const fetchData = useCallback(async () => {
    const payload = await getdata("https://kfc-clone-full-stack-1.onrender.com/api/product/menu?type=beverages");
    dispatch(addbeverages(payload));
 }, [dispatch]);

 useEffect(() => {
    fetchData();
 }, [fetchData]);

  return (
  <div id="beverage" >
    <h1>BEVERAGES</h1>
   <div className={styles.itembox} >
    {cartBeverages.map((el)=>{
      return <Item {...el} key={el._id}  />
    })}
   </div>
  </div>
  )
}

export default Beverages