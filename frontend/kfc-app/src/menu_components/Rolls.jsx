
import { addrolls } from '../redux/action';
import { getdata } from "../utils/getdata"
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./item.module.css"
import Item from './Item';
import filterCartProducts from "./filterCartProducts"

const Rolls = () => {
    const dispatch = useDispatch();
    const rolls = useSelector((state)=>state.rolls)
    const cart = useSelector((state)=>state.cart);
    const cartRolls = filterCartProducts(rolls, cart);

    const fetchData = useCallback(async () => {
        const payload = await getdata("http://localhost:8081/api/product/menu?type=rolls");
        dispatch(addrolls(payload));
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

  return (
    <div id="rolls">
      <h1>CHICKEN ROLLS</h1>
     <div className={styles.itembox} >
      {cartRolls.map((el)=>{
        return <Item {...el} key={el._id}  />
      })}
     </div>
    </div>
  )
}

export default Rolls