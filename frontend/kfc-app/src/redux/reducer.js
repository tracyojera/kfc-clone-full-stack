import { ADDBEVERAGES, ADDBIRYANI, ADDBOX, ADDBURGER, ADDCART, ADDCHICKEN, ADDLAUNCH, ADDROLLS, ADDSNACKS, ADDSTAYHOME, CARTCOUNT, DELETECART, GETCART } from "./action";


const initialState={
    chicken:[],
    launch:[],
    rolls:[],
    biryani:[],
    box:[],
    burger:[],
    stayhome:[],
    snacks:[],
    beverages:[],
    cart:[]
}

export const reducer= (state=initialState,{type,payload})=>{

switch(type){
    case ADDCHICKEN:{
      return{
        ...state,chicken:payload
      }
    }
    case ADDLAUNCH:{
        return{
          ...state,launch:payload
        }
      }
      case ADDROLLS:{
        return{
          ...state,rolls:payload
        }
      }
      case ADDBIRYANI:{
        return{
          ...state,biryani:payload
        }
      }
      case ADDBOX:{
        return{
          ...state,box:payload
        }
      }
      case ADDBURGER:{
        return{
          ...state,burger:payload
        }
      }
      case ADDSTAYHOME:{
        return{
          ...state,stayhome:payload
        }
      }
      case ADDSNACKS:{
        return{
          ...state,snacks:payload
        }
      }
      case ADDBEVERAGES:{
        return{
          ...state,beverages:payload
        }
      }
      case ADDCART:{
        const existingItem = state.cart.find(
          (item) => String(item.id) === String(payload.id)
        );

        if (existingItem) {
          return {
            ...state,
            cart: state.cart.map((item) =>
              String(item.id) === String(payload.id)
                ? { ...item, ...payload }
                : item
            )
          };
        }

        return{
          ...state,cart:[...state.cart,payload]
        }
      }
      case CARTCOUNT:{
        const cart = payload.qty === 0
          ? state.cart.filter((item) => String(item.id) !== String(payload.id))
          : state.cart.map((item) =>
              String(item.id) === String(payload.id)
                ? { ...item, ...payload }
                : item
            );

        return{
          ...state,cart:cart
        }
      }
      case GETCART:{
          return{
            ...state,cart:payload
          }
      }
      case DELETECART:{
          return{
            ...state,
            cart: state.cart.filter((item) => String(item.id) !== String(payload))
          }
      }
    default :return state;
}
}