import React from 'react';

export const Price = ({amount}) => {
  // return (
  //   <>
	// 		&#8369;{parseFloat(amount).toFixed(2)}
  //   </>
  // )
  return (
    <>
      &#8369;{parseFloat(amount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
    </>
  )
}

export const FormatToText = {
  currency: (amount) => {
    return "₱" + parseFloat(amount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
}

export const MergeStoreProducts = (data) => {
  
  //Get unique stores
  let stores = data.filter( (value, index, self) => self.findIndex((x) => x.store_id == value.store_id) === index)

  //loop through unique stores 
  //and find all products from the data that is associated with the store
  let result = stores.map((store, index) => {    
    return {
      store_id: store.store_id,
      store: store.storeName,
      storeLogo: store.storeLogo || "",
      cart: data.filter(x => x.storeName == store.storeName),
      delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
    }
  })
  return result

}