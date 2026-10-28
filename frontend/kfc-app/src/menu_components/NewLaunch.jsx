
import { addlaunch } from '../redux/action';
import { getdata } from "../utils/getdata"
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./item.module.css"
import Item from './Item';
import filterCartProducts from "./filterCartProducts"

const NewLaunch = () => {
    const dispatch = useDispatch();
    const launch = useSelector((state)=>state.launch);
    const cart = useSelector((state)=>state.cart);
    const cartLaunch = filterCartProducts(launch, cart);

    const fetchData = useCallback(async () => {
        const payload = await getdata("http://localhost:8081/api/product/menu?type=launch");
        dispatch(addlaunch(payload));
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

  return (
    <div id="launch" >
      <h1>NEW LAUNCH</h1>
     <div className={styles.itembox} >
      {cartLaunch.map((el)=>{
        return <Item {...el} key={el._id}  />
      })}
     </div>
    </div>
  )
}

export default NewLaunch