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
          {id: 1, name: 'Short', price: 0.00},
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
          {id: 1, name: 'Short', price: 0.00},
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
          {id: 1, name: 'Short', price: 0.00},
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
          {id: 1, name: 'Short', price: 0.00},
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
          {id: 1, name: 'Short', price: 0.00},
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
          {id: 1, name: 'Short', price: 0.00},
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
