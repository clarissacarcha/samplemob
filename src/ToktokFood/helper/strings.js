import {food1, image1, image2, image3, image4} from 'toktokfood/assets/images';

export const availableTips = [
  {
    id: 1,
    amount: 20,
  },
  {
    id: 2,
    amount: 50,
  },
  {
    id: 3,
    amount: 100,
  },
  {
    id: 4,
    amount: 150,
  },
  {
    id: 5,
    amount: 200,
  },
  {
    id: 6,
    amount: 250,
  },
];

// This must be migrate to redux

export const MY_ORDERS = [
  // {
  //   id: 1,
  //   name: 'Caffe Latte',
  //   price: 45.58,
  //   description: 'Rich espresso balance with steamed',
  //   image: food1,
  //   qty: 1,
  //   ratings: 5,
  //   variations: [
  //     {
  //       sizes: [
  //         {id: 1, name: 'Short', price: 0.00},
  //         {id: 2, name: 'Tall', price: 50.5},
  //         {id: 3, name: 'Grande', price: 75.5},
  //         {id: 4, name: 'Venti', price: 100.5},
  //       ],
  //       add_ons: [
  //         {id: 1, name: 'Extra Cream', price: 20.5},
  //         {id: 2, name: 'Choco Sprinkles', price: 30.5},
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   name: 'Caffe Latte',
  //   price: 45.58,
  //   description: 'Rich espresso balance with steamed',
  //   image: food1,
  //   qty: 1,
  //   ratings: 5,
  //   variations: [
  //     {
  //       sizes: [
  //         {id: 1, name: 'Short', price: 0.00},
  //         {id: 2, name: 'Tall', price: 50.5},
  //         {id: 3, name: 'Grande', price: 75.5},
  //         {id: 4, name: 'Venti', price: 100.5},
  //       ],
  //       add_ons: [
  //         {id: 1, name: 'Extra Cream', price: 20.5},
  //         {id: 2, name: 'Choco Sprinkles', price: 30.5},
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   name: 'Caffe Latte',
  //   price: 45.58,
  //   description: 'Rich espresso balance with steamed',
  //   image: food1,
  //   qty: 1,
  //   ratings: 5,
  //   variations: [
  //     {
  //       sizes: [
  //         {id: 1, name: 'Short', price: 0.00},
  //         {id: 2, name: 'Tall', price: 50.5},
  //         {id: 3, name: 'Grande', price: 75.5},
  //         {id: 4, name: 'Venti', price: 100.5},
  //       ],
  //       add_ons: [
  //         {id: 1, name: 'Extra Cream', price: 20.5},
  //         {id: 2, name: 'Choco Sprinkles', price: 30.5},
  //       ],
  //     },
  //   ],
  // },
];

const MY_ORDER_DETAILS = {
  // orders: [
  //   {
  //     id: 1,
  //     name: 'Caffe Latte',
  //     price: 45.58,
  //     description: 'Rich espresso balance with steamed',
  //     image: food1,
  //     qty: 1,
  //     ratings: 5,
  //     variations: [
  //       {
  //         sizes: [
  //           {id: 1, name: 'Short', price: 0.00},
  //           {id: 2, name: 'Tall', price: 50.5},
  //           {id: 3, name: 'Grande', price: 75.5},
  //           {id: 4, name: 'Venti', price: 100.5},
  //         ],
  //         add_ons: [
  //           {id: 1, name: 'Extra Cream', price: 20.5},
  //           {id: 2, name: 'Choco Sprinkles', price: 30.5},
  //         ],
  //       },
  //     ],
  //   },
  // ],
};

export const foodData = [
  {
    id: 1,
    name: 'Caffe Latte',
    price: 45.58,
    description: 'Rich espresso balance with steamed',
    image: food1,
    qty: 1,
    ratings: 5,
    variations: [
      {
        sizes: [
          {id: 1, name: 'Short', price: 0.0},
          {id: 2, name: 'Tall', price: 50.5},
          {id: 3, name: 'Grande', price: 75.5},
          {id: 4, name: 'Venti', price: 100.5},
        ],
        add_ons: [
          {id: 1, name: 'Extra Cream', price: 20.5},
          {id: 2, name: 'Choco Sprinkles', price: 30.5},
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Americano',
    price: 45.5,
    description: 'Rich espresso balance with steamed',
    image: food1,
    qty: 5,
    ratings: 5,
    variations: [
      {
        sizes: [
          {id: 1, name: 'Short', price: 0.0},
          {id: 2, name: 'Tall', price: 50.5},
          {id: 3, name: 'Grande', price: 75.5},
          {id: 4, name: 'Venti', price: 100.5},
        ],
        add_ons: [
          {id: 1, name: 'Extra Cream', price: 20.5},
          {id: 2, name: 'Choco Sprinkles', price: 30.5},
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Mocha',
    price: 45.5,
    description: 'Rich espresso balance with steamed',
    image: food1,
    qty: 1,
    ratings: 5,
    variations: [
      {
        sizes: [
          {id: 1, name: 'Short', price: 0.0},
          {id: 2, name: 'Tall', price: 50.5},
          {id: 3, name: 'Grande', price: 75.5},
          {id: 4, name: 'Venti', price: 100.5},
        ],
        add_ons: [
          {id: 1, name: 'Extra Cream', price: 20.5},
          {id: 2, name: 'Choco Sprinkles', price: 30.5},
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Espresso',
    price: 45.5,
    description: 'Rich espresso balance with steamed',
    image: food1,
    qty: 1,
    ratings: 5,
    variations: [
      {
        sizes: [
          {id: 1, name: 'Short', price: 0.0},
          {id: 2, name: 'Tall', price: 50.5},
          {id: 3, name: 'Grande', price: 75.5},
          {id: 4, name: 'Venti', price: 100.5},
        ],
        add_ons: [
          {id: 1, name: 'Extra Cream', price: 20.5},
          {id: 2, name: 'Choco Sprinkles', price: 30.5},
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Cappuccino',
    price: 45.5,
    description: 'Rich espresso balance with steamed',
    image: food1,
    qty: 1,
    ratings: 5,
    variations: [
      {
        sizes: [
          {id: 1, name: 'Short', price: 0.0},
          {id: 2, name: 'Tall', price: 50.5},
          {id: 3, name: 'Grande', price: 75.5},
          {id: 4, name: 'Venti', price: 100.5},
        ],
        add_ons: [
          {id: 1, name: 'Extra Cream', price: 20.5},
          {id: 2, name: 'Choco Sprinkles', price: 30.5},
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'Brewed',
    price: 45.5,
    description: 'Rich espresso balance with steamed',
    image: food1,
    qty: 1,
    ratings: 5,
    variations: [
      {
        sizes: [
          {id: 1, name: 'Short', price: 0.0},
          {id: 2, name: 'Tall', price: 50.5},
          {id: 3, name: 'Grande', price: 75.5},
          {id: 4, name: 'Venti', price: 100.5},
        ],
        add_ons: [
          {id: 1, name: 'Extra Cream', price: 20.5},
          {id: 2, name: 'Choco Sprinkles', price: 30.5},
        ],
      },
    ],
  },
];

export const restaurants = [
  {
    id: 1,
    name: 'Starbucks (32nd Street)',
    ratings: 5,
    totalBranches: 4,
    time: '40 mins',
    distance: '1km',
    image: image1,
  },
  {
    id: 2,
    name: 'Yellow Cab (32nd Street)',
    ratings: 5,
    totalBranches: 4,
    time: '40 mins',
    distance: '2.1km',
    image: image2,
  },
  {
    id: 3,
    name: 'Starbucks (32nd Street)',
    ratings: 5,
    totalBranches: 4,
    time: '40 mins',
    distance: '1km',
    image: image3,
  },
  // {
  //   id: 4,
  //   name: 'Yellow Cab (32nd Street)',
  //   ratings: 5,
  //   totalBranches: 4,
  //   time: '40 mins',
  //   distance: '2.1km',
  //   image: image4,
  // },
  // {
  //   id: 5,
  //   name: 'Starbucks (32nd Street)',
  //   ratings: 5,
  //   totalBranches: 4,
  //   time: '40 mins',
  //   distance: '1km',
  //   image: image1,
  // },
  // {
  //   id: 6,
  //   name: 'Yellow Cab (32nd Street)',
  //   ratings: 5,
  //   totalBranches: 4,
  //   time: '40 mins',
  //   distance: '2.1km',
  //   image: image2,
  // },
  // {
  //   id: 7,
  //   name: 'Starbucks (32nd Street)',
  //   ratings: 5,
  //   totalBranches: 4,
  //   time: '40 mins',
  //   distance: '1km',
  //   image: image1,
  // },
  // {
  //   id: 8,
  //   name: 'Yellow Cab (32nd Street)',
  //   ratings: 4.5,
  //   totalBranches: 4,
  //   time: '40 mins',
  //   distance: '2.1km',
  //   image: image2,
  // },
];

export const tabs = [
  {
    id: 1,
    name: 'Near You',
  },
  {
    id: 2,
    name: 'Promos',
  },
  {
    id: 3,
    name: 'All',
  },
];

export const notifications = [
  {
    id: 1,
    title: 'Booking Confirmed',
    content: 'Your order has been accepted.',
  },
  {
    id: 2,
    title: 'Order Preparing',
    content: 'Your order is preparing.',
  },
  {
    id: 3,
    title: 'Your order is on the way to you',
    content: 'Your order has been accepted.',
  },
];

export const transactions = [
  {
    orderId: 1,
    quantity: 1,
    image: food1,
    shop: 'Starbucks',
    shopAddress: '32th Street',
    destinationAddress: 'Cloud Panda PH Inc. 10F 40th Street Taguig',
    statusCode: 'po',
    statusMessage: 'Order Accepted',
  },
  // {
  //   orderId: 2,
  //   quantity: 2,
  //   image: food1,
  //   shop: 'Starbucks',
  //   shopAddress: '32th Street',
  //   destinationAddress: 'Cloud Panda PH Inc. 10F 40th Street Taguig',
  //   statusCode: 'f',
  //   statusMessage: 'Food picked up',
  // },
  // {
  //   orderId: 3,
  //   quantity: 2,
  //   image: food1,
  //   shop: 'Starbucks',
  //   shopAddress: '32th Street',
  //   destinationAddress: 'Cloud Panda PH Inc. 10F 40th Street Taguig',
  //   statusCode: 's',
  //   statusMessage: 'Delivered',
  //   statusTime: '10:00 AM',
  // },
  // {
  //   orderId: 4,
  //   quantity: 2,
  //   image: food1,
  //   shop: 'Starbucks',
  //   shopAddress: '32th Street',
  //   destinationAddress: 'Cloud Panda PH Inc. 10F 40th Street Taguig',
  //   statusCode: 's',
  //   statusMessage: 'Delivered',
  //   statusTime: '10:00 AM',
  // },
  // {
  //   orderId: 6,
  //   quantity: 2,
  //   image: food1,
  //   shop: 'Starbucks',
  //   shopAddress: '32th Street',
  //   destinationAddress: 'Cloud Panda PH Inc. 10F 40th Street Taguig',
  //   statusCode: 'c',
  //   statusMessage: 'Cancelled',
  //   statusTime: '10:00 AM',
  // },
  // {
  //   orderId: 7,
  //   quantity: 2,
  //   image: food1,
  //   shop: 'Starbucks',
  //   shopAddress: '32th Street',
  //   destinationAddress: 'Cloud Panda PH Inc. 10F 40th Street Taguig',
  //   statusCode: 'c',
  //   statusMessage: 'Cancelled',
  //   statusTime: '10:00 AM',
  // },
];

export const searchData = [
  {
    id: 1,
    title: 'Most Searched',
  },
  {
    id: 2,
    title: 'Arranged Alphabetically',
  },
];
export const orderTypeData = [
  {
    id: 2,
    title: 'Pickup',
  },
  {
    id: 1,
    title: 'Delivery',
  },
];

export const SamplePolicy = `These Terms and Conditions govern your use of our platform tokokfood (the “Platform”), an food delivery platform operated by Cloud Panda PH Inc. (Cloud Panda). Please read these Terms and Conditions carefully before using the platform so that you are aware of your rights and obligations with respect to Cloud Panda, including its affiliates and subsidiaries.

By accessing or using the Platform, you agree to be bound by these Terms. These Terms govern your use and access of toktokfood. These Terms apply to all visitors, users, and others who access or use the Platform.

The actual contract of sale is directly between the user and our partner merchants. Cloud Panda is not a party to that or any other contract between the aforementioned parties. As such, it has no obligations in connection with any such contract. Parties to the transaction will be entirely responsible for the sales contract between them, the listing of goods, returns, refund, warranty of purchase and the like.

Cloud Panda PH Inc., reserves the right to modify these Terms and Conditions without prior notice. Any changes hereto will be effective immediately upon posting. Continuous access or use of this Platform after any modifications have been made, signifies your consent to the changes.

You agree that you will have no claim against Cloud Panda PH Inc, for any statement which is not explicitly set out in these Terms. In the event that any of the provisions of these Terms are deemed invalid or invalidated subsequently by any rules or regulations, the remaining provisions will not be affected, and the validity or enforceability of any other provision (or the remaining parts of that provision) will remain. If a court holds that we cannot enforce any part of these Terms as drafted, we may replace those terms with similar terms to the extent enforceable under applicable laws and regulations, without changing the remaining terms of these Terms. No delay in enforcing any provision of these Terms will be construed to be a waiver of any rights under that provision.

Cloud Panda reserves the right to refuse access to the Platform for whatever reason.`;

export const TermsAndConditions = {
  DEFINITIONS: {
    title: 'DEFINITIONS',
    content: `toktokfood is a link between you and the merchant for you to order a variety of goods including prepared meals, non-prepared food, and miscellaneous non-food items (hereinafter collectively referred to as "Goods") to be delivered to you. merchants may be owned and operated either by third party merchants or our affiliated companies.`,
  },
  USE_OF_THE_PLATFORM: {
    title: 'USE OF THE PLATFORM',
    content: `You need to create your own toktokfood account to use the Platform. When you register for a toktokfood account, we will ask you to provide your personal information including a valid email address, an active mobile phone number, a unique password, etc. Depeding on which payment method you opt to use in purchasing your order, you may need to provide us with your credit/debit card details and you are responsible in making sure that your account is safe. Orders that are placed under your toktokfood account are also your sole responsibility. 
You are obliged to provide information that is complete, accurate and truthful for the proper processing of the order, including your delivery address and contact information. toktokfood shall not be liable for orders that encounter delivery issues due to incomplete, incorrect or missing information provided by you.`,
  },
  RESTRICTIONS: {
    title: 'RESTRICTIONS',
    content: `toktokfood is a link between you and the merchant for you to order a variety of goods including prepared meals, non-prepared food, and miscellaneous non-food items (hereinafter collectively referred to as "Goods") to be delivered to you. merchants may be owned and operated either by third party merchants or our affiliated companies.`,
    listContent: [
      {
        content: `use toktok app to defraud toktok, our affiliates or other members or users, or engage in other unlawful activities (including, without limitation, dealing in products or services prohibited by law)`,
      },
      {
        content: `impersonate any person or entity, falsely claim or otherwise misrepresent an affiliation with any person or entity, or access the accounts of others without permission, or perform any other fraudulent activity`,
      },
      {
        content: `use toktok app to send infringing, obscene, threatening, offensive, or otherwise unlawful or tortious material, including but not limited to materials harmful to children or violative of third party privacy rights`,
      },
      {
        content: `engage in any conduct that could possibly damage the platform's reputation or amount to being disreputable.`,
      },
    ],
  },
  ORDERS: {
    title: 'ORDERS',
    content: `Before placing an order, you are required to provide the delivery address in order for the Platform to display the merchants available in your area. Once you select a merchant, you will be taken to that merchant’s menu page and you can start adding food item/s to your cart.

toktokfood and the merchant (as the case may be) reasonably endeavour to comply with your special instructions for an order. However in some cases where this is not possible or commercially reasonable, toktokfood and/or the merchant reserve the right to proceed to prepare the order in accordance with standard operating procedures. Neither toktokfood nor the merchant shall be responsible to replace or refund an order which does not conform to special instructions provided by you.

When an order is placed in the platform, toktokfood will send an email confirmation to your registered email with the order receipt.`,
  },
  PRODUCT_POLICY: {
    title: 'PRODUCT POLICY',
    content: `The following conditions should be complied when submitting a product-related request:`,
    listContent: [
      {
        content: `The request should be submitted to the merchant within twenty-four (24) hours upon receipt of the product/s`,
      },
      {
        content: `Order Reference Number shall be presented together with the request.`,
      },
      {
        content: `The product is not damaged or destroyed in any way. Packaging is unopened, with no markings, and not tattered or destroyed.`,
      },
      {
        content: `All sold products can only be exchanged with the same products/of the same value, and not cash`,
      },
      {
        content: `Request for exchange/ refund shall not be honored if the reason for return is a mere change of mind.`,
      },
      {
        content: `No cancellation of orders shall be made, for whatever grounds, once an order has already been prepared by the merchant`,
      },
      {
        content: `Approval of requests are subject to the Merchant's approval and is in accordance with the Merchant's existing refund and exchange policy.`,
      },
      {
        content: `Returns, refunds or exchanges shall be settled by the the user, and the merchant partner.`,
      },
      {
        content: `In case of cancelled orders, the merchant shall directly communicate with the customer. In the event of a refund, the partner shall take care of the process and refund.`,
      },
      {
        content: `For mishandled food item/s:
        
    a.) Upon receiving, immediately check the condition of the food if in case the said item is not sealed properly, spoiled or in any way inedible, and take photos of the item to serve as supporting document.

    b.) Have a copy of payment as a proof, make sure it contains the ff: (value/amount of item, address of the store where the item was bought) this will serve as evidence for further assessment of the store/merchant.

    c.) Contact the merchant and/or ask for assistance to toktokfood for immediate action.
`,
      },
    ],
  },
  DELIVERY: {
    title: 'DELIVERY',
    content: `You may choose your order to be delivered ASAP or scheduled for a specific time. An estimated delivery time will be provided to your email and will also be reflected in the Platform. The estimated delivery time shall vary, depending on the uncontrollable factors such as long queue (peak hours), weather, traffic conditions, etc.

You are responsible in ensuring that either you or an authorized representative is at the delivery location that you have provided to receive the order. toktokfood and the partner merchants will not be liable for the missed order and customer will not be eligible for a refund of the order's payment should this happen, including but not limited to the following:`,
    listContent: [
      {
        content: `No one was present or available to receive the order; or`,
      },
      {
        content: `Customer remained uncontactable despite attempts to reach the customer via the phone number provided for more than ten (10 )minutes from the time of delivery; or`,
      },
      {
        content: `Lack of a suitable or secure location to leave the order; or`,
      },
      {
        content: `In the case of Restricted Goods, customer did not meet the statutory age requirements or delivery did not deem it safe or appropriate for the customer to receive the Restricted Goods.`,
      },
    ],
    extentedContent: `Upon receipt of your order, if you discover that there are issues with your order (e.g. wrong/ incomplete order, defective order, poor handling, etc) please contact customer support immediately to report the incident. You must provide toktokfood a photographic proof and/or additional information to properly investigate the issue with your order. If we determine that the order and/or Goods you received are not of satisfactory condition or quality, we will compensate you for your order or parts of your order.`,
  },
  PAYMENT: {
    title: 'PAYMENT',
    content: `The Platform offers the following modes of payment:`,
    listContent: [
      {
        content: `Toktokwallet (you may cash in using your credit/debit card, mobile payments, OTC banks and non-banks)`,
      },
      {
        content: `COD`,
      },
    ],
    extentedContent: `The balance in the toktokwallet account cannot be withdrawn as cash, transferred to a bank account or credited to a debit card or credit card. It can only be used to purchase goods and/or services from the partner merchants on the platform.

toktokfood reserves the right to offer additional payment methods and/or remove existing payment methods at anytime in its sole discretion.`,
  },
  CANCELLATION: {
    title: 'CANCELLATION',
    content: `You have the right to cancel an order under the following provisions:

  a.) For transactions made using the toktokwallet, cancellation can only be completed if a merchant has not accepted your order yet. However, for merchants that uses the auto-accept option in their orders, cancellation will no longer be available. 
      
  b.) For COD transactions, you may cancel an order/s as long as it is still under the PLACED order status. However, once a rider has accepted the order and the order is already being prepared by the merchant, cancellation is no longer allowed. There is also no option to cancel if the selected merchant is auto accepting orders.
  
toktokfood also has the right to cancel any orders as well as suspend or terminate your account in its sole discretion if it detects fraudulent behavior or activity associated with your account and/or with your order.`,
  },
  REFUND: {
    title: 'REFUND',
    content: `Any request for refund must undergo due process of toktokfood and based on the cancellation policies reflected in this terms of use. The following incidents are allowed to process  for a refund, given that request has valid supporting documents (i.e. photos, medical certificate, etc.):`,
    listContent: [
      {
        content: `Food cooked icorrectly or with poor quality (Spoiled or Contaminated)`,
      },
      {
        content: `Food resulted in poisoning or upset stomach`,
      },
      {
        content: `Incorrect and/or missing orders`,
      },
    ],
    extentedContent: `The approved amount for refund will be refunded to your toktokwallet. Once the refunded amount is reflected in your toktokwallet, the refunded amount can be redeemed immediately.`,
  },
  COMPLAINTS: {
    title: 'COMPLAINTS',
    content: `You may contact the toktokfood customer service via telephone (632) 8424 8617 or email at food@toktok.ph should you encounter poor and unsatisfactory service. toktokfood has the right but not obligated to conduct an investigation about the incident. Parties responsible shall be penalized accordingly if proven of the negligence.`,
  },
  DISPUTES: {
    title: 'DISPUTES',
    content: `Disputes relating to any transactions conducted on the Platform shall be resolved by you and the merchant partner. The user agrees that no suit or claim shall be asserted against Cloud Panda.`,
  },
  INDEMNIFICATION: {
    title: 'INDEMNIFICATION',
    content: `By  using the platform, the Services, and/or the toktokfood Account, you agree to all the toktokfood Terms and Condition. You also agree that you shall defend, indemnify and hold toktokfood, its parent company, subsidiaries, affiliates, harmless from and against any and all claims, costs, damages, losses, liabilities and expenses arising out of or in connection with:`,
    listContent: [
      {
        content: `your use of the Services, the Paypanda Account, and/or the toktokfood Platform in your dealings with any third parties, including, but not limited to, the merchants, delivery agents and other users of the toktokfood Platform;`,
      },
      {
        content: `your violation or breach of any of the toktokfood Pay Terms or any applicable law or regulation;`,
      },
      {
        content: `your violation of any rights of any third party;`,
      },
      {
        content: `your misuse of the Services and/or the toktokfood Platform.`,
      },
    ],
  },
  LIMITATION_OF_LIABILITY: {
    title: 'LIMITATION OF LIABILITY',
    content: `The use of the Account, Services and the toktokfood Platform may be subject to limitations, delays, security issues, and other problems inherent in the use of the internet and electronic communications, including the device used by you being faulty, not connected, out of range of mobile signals or functioning incorrectly. toktokfood and Paypanda are not responsible for any delays, delivery failures, damages or losses resulting from such problems. You agree that all risks arising from online transactions will be borne by you. To the extent that toktokfood and PayPanda confirmed to incur any liability, toktokfood and PayPanda's liability shall in no event exceed the amount paid by you for the use of the Services giving rise to the cause of action.`,
  },
  MERCHANT_LIABILITY: {
    title: 'LIMITATION_OF_LIABILITY',
    content: `The use of the Account, Services and the toktokfood Platform may be subject to limitations, delays, security issues, and other problems inherent in the use of the internet and electronic communications, including the device used by you being faulty, not connected, out of range of mobile signals or functioning incorrectly. toktokfood and Paypanda are not responsible for any delays, delivery failures, damages or losses resulting from such problems. You agree that all risks arising from online transactions will be borne by you. To the extent that toktokfood and PayPanda confirmed to incur any liability, toktokfood and PayPanda's liability shall in no event exceed the amount paid by you for the use of the Services giving rise to the cause of action.`,
  },
  SEVERABILITY: {
    title: 'SEVERABILITY',
    content: `If any provision of this Agreement, or the application thereof to any Party hereto, is held illegal, null, void, unenforceable or otherwise invalid by any law, decree ordinance or judicial or administrative decision, such holding shall not affect the other provisions of this Agreement which can be given effect without the invalid provision and to this end the Parties agree that the provisions of this Agreement are and shall be severable, provided that if such invalidation affects any other provision deemed essential by any Party to the satisfactory performance of this Agreement then, upon written notice being given by such Party to the other, the Parties shall promptly negotiate in good faith to the end that this Agreement may be amended in such manner as may be deemed necessary to make it fair and equitable to both Parties.`,
  },
  GOVERNING_LAW: {
    title: 'GOVERNING LAW',
    content: `Any dispute or claim arising out of or in connection with the use of this Platform, shall be governed by, and construed in accordance with the laws of the Philippines.`,
  },
};
