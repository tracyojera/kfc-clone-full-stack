import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styles from "./item.module.css"
import { formatUGX } from '../utils/currency'
import { useFallbackImage } from '../utils/imageFallback'
import { getMenuImage } from '../utils/menuImages'



const Reccom = () => {
    let [recom,setrecom]= useState([]);
    useEffect(()=>{
      axios.get("https://kfc-clone-full-stack-1.onrender.com/api/searchapi/item/?search=classic")
      .then(({data})=>{
        setrecom(data);
      })
    },[])

  return (
    <div>
      <h2 className={styles.reccomtitle} >Reccomended Meals</h2> 
     {recom.map((el,index)=>{
      return <div key={index} className={styles.recombox} >
              <div><img src={getMenuImage(el.title, el.image)} onError={useFallbackImage} alt={el.title || "food"} /></div>
               <div>
                <h3>{el.title}</h3>
                <p>{el.desc}</p>
                <h3>{formatUGX(el.price)}</h3>
              </div>
            </div>
       
     })}
       

    </div>
  )
}

export default Reccom