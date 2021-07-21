import React from 'react';

export const Price = ({amount}) => {
  return (
    <>
			&#8369;{parseFloat(amount).toFixed(2)}
    </>
  )
}