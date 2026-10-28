import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getCart } from "../redux/action";
import { getdata } from "../utils/getdata";
import { useDispatch } from "react-redux";
import Cartproduct from './Cartproduct';


const Leftside = () => {
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart);

    const fetchdata = useCallback(async () => {
      const payload = await getdata("http://localhost:8081/api/productcart/cart");
      dispatch(getCart(payload.map((item) => ({
        ...item,
        id: item.id || item._id
      }))));
    }, [dispatch]);

    useEffect(() => {
      fetchdata();
    }, [fetchdata]);

  return (
    <div>
        {cart.map((el)=>{
            return <Cartproduct key={el.id} {...el} />
        })}
    </div>
  )
}

export default Leftside