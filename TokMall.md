# Concerns & Verifications

* Shop
    1. Follow Shop function (Lined up for development on WEB)
    2. Number of followers (Lined up for development on WEB)
    3. How to get Rating (Lined up for development on WEB)
    4. How to get Shop categories

* Product
    1. Product Rating (Lined up for development on WEB)
    2. Rate Product (Lined up for development on WEB)

# Needes Code Refactor

    1. Axios Utility (get data from async storage, get signature from getSignature BE)
    2. Image source provider

# Needed Global Components

function FormatMapper(data) {
    let animals = data.filter( (value, index, self) => self.findIndex((x) => x.name == value.name) === index)
    let result = animals.map((val, index) => {
      return {
        id: val.id,
        name: val.name,
        actions: data.filter(x => x.name == val.name)
      }
    })
    return result
  }


# DONE

- Vouchers (hide in landing page)
- Landing page: Display the featured items in web
- Update View Product screen (remove three dot) 
- Change notifications 1=1 ; upon clicking will redirect to order details
- Order Details screen
# ONGOING
- Order Details Backend

# TODO
- Update Delete Screen (No edit button. hold to delete and swipe left-> delete button will appear) 


# VALUES

- Ramen Nagi Voucher TJCRNXJ8KHFG


USER REGISTRATION (Splash Screen)
CART
PRODUCT DETAILS
 - Add to cart
PLACE ORDER
ADDRESSES
NOTIFICATIONS
