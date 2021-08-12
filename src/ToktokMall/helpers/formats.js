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