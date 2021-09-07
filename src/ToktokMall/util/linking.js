const config = {
  screens:{
    RootDrawer: {
      screens: {
        AuthenticatedStack: {
          screens: {
            ToktokMallProductDetails: {
                path: "products/:Id",
                parse: {
                  Id: (Id) => `${Id}`
                }
              }
          }
        }
      }
    }
  }
}

const linking = {
    prefixes: ["https://toktokmall.ph"],
    config
}

export default linking

// ToktokMallProductDetails: {
//     path: "products/:Id",
//     parse: {
//       Id: (Id) => `${Id}`
//     }
//   }