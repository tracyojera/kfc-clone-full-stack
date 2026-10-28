
import { addbox } from '../redux/action';
import { getdata } from "../utils/getdata"
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./item.module.css"
import Item from './Item';
import filterCartProducts from "./filterCartProducts"

const Box = () => {
    const dispatch = useDispatch();
    const box = useSelector((state) => state.box);
    const cart = useSelector((state)=>state.cart);
    const cartBox = filterCartProducts(box, cart);

    const fetchData = useCallback(async () => {
        const payload = await getdata("http://localhost:8081/api/product/menu?type=boxmeals");
        dispatch(addbox(payload));
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

  return (
  <div id="box" >
    <h1>BOX MEALS</h1>
   <div className={styles.itembox} >
    {cartBox.map((el)=>{
      return <Item {...el} key={el._id}  />
    })}
   </div>
  </div>
  )
}

export default Box