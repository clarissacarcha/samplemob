import React from 'react';
import CustomIcon from '../../../../../Components/Icons';

export const RenderStars = ({value}) => {
    let orange = "#FFC833"
    let gray = "rgba(33, 37, 41, 0.1)"
    return (
      <>
        <CustomIcon.FoIcon name="star" size={14} color={value >= 1 ? orange : gray} />
        <CustomIcon.FoIcon name="star" size={14} color={value >= 2 ? orange : gray} />
        <CustomIcon.FoIcon name="star" size={14} color={value >= 3 ? orange : gray} />
        <CustomIcon.FoIcon name="star" size={14} color={value >= 4 ? orange : gray} />
        <CustomIcon.FoIcon name="star" size={14} color={value >= 5 ? orange : gray} />
      </>
    )
  }