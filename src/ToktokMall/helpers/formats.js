import React from 'react';
import moment from 'moment'

export const DisplayDateAndTime = (value) => {
  return `${moment(value).format('MMM D, YYYY')} ${moment(value).format('hh:mm A')}`
}

export const DisplayDate = (value) => {
  return `${moment(value).format('MMM D, YYYY')}`
}

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

export const ArrayCopy = (toCopy) => {
  return JSON.parse(JSON.stringify(toCopy))
}


export const FormatDateTime = (value) => moment(value, "YYYY-MM-DD h:m:s").format("MMM DD, YYYY hh:mm A") 


export const ReplaceHtmlEntities = (s) => {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  var translate = {
    'nbsp': String.fromCharCode(160), 
    'amp' : '&', 
    'quot': '"',
    'lt'  : '<', 
    'gt'  : '>'
  };

  var translator = function($0, $1) { 
    return translate[$1]; 
  }

  return s.replace(translate_re, translator);
}