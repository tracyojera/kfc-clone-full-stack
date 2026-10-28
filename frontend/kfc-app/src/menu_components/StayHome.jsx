
import { addstayhome } from '../redux/action';
import { getdata } from "../utils/getdata"
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./item.module.css"
import Item from './Item';
import filterCartProducts from "./filterCartProducts"
const StayHome = () => {
  const stayhome = useSelector((state)=>state.stayhome);
  const cart = useSelector((state)=>state.cart);
  const cartStayHome = filterCartProducts(stayhome, cart);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
      const payload = await getdata("http://localhost:8081/api/product/menu?type=stayhome");
      dispatch(addstayhome(payload));
  }, [dispatch]);

  useEffect(() => {
      fetchData();
  }, [fetchData]);

  return (
  <div id="stayhome">
    <h1>STAY HOME SPECIALS</h1>
   <div className={styles.itembox} >
    {cartStayHome.map((el)=>{
      return <Item {...el} key={el._id}  />
    })}
   </div>
  </div>
  )
}

export default StayHome