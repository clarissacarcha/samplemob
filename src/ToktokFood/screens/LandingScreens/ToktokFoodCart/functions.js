
export const arrangeAddons = (addons) => {
  if(addons.length > 0){
    let selectedAddons = {};
    addons.map((item) => {
      let { id, optionPrice, optionName, optionDetailsName } = item;
      let data = { addon_id: id, addon_name: optionName, addon_price: optionPrice }
      if(selectedAddons[optionDetailsName] != undefined){
        selectedAddons[optionDetailsName].push(data)
      } else {
        selectedAddons = { ...selectedAddons, [optionDetailsName]: [data] }
      }
    })
    return selectedAddons
  }
}
