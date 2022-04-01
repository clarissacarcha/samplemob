const recentDestinations = [
  {
    name: 'Cloud Panda PH',
    body: '18F One Corporate Center, Julia Vargas Avenue, Meralco Ave, Ortigas Center, Pasig, Metro Manila',
  },
  {
    name: 'Cloud Panda PH1',
    body: '18F One Corporate Center, Julia Vargas Avenue, Meralco Ave, Ortigas Center, Pasig, Metro Manila',
  },
  {
    name: 'Cloud Panda PH2',
    body: '18F One Corporate Center, Julia Vargas Avenue, Meralco Ave, Ortigas Center, Pasig, Metro Manila',
  },
];

const savedLocations = [
  {
    name: 'Home',
    body: 'P. Villanueva Street, Libertad, Pasay City, Metro Manila',
  },
  {
    name: 'Office',
    body: '18F One Corporate Center, Julia Vargas Avenue, Meralco Ave, Ortigas Center, Pasig, Metro Manila',
  },
];

const frequentlyUsed = [
  {
    name: 'SM City Manila',
    body: 'Natividad Almeda-Lopez corner A. Villegas and, San Marcelino, Ermita, Manila, Metro Manila',
  },
  {
    name: 'SM City Legazpi',
    body: 'Natividad Almeda-Lopez corner A. Villegas and, San Marcelino, Ermi, Manila, Metro Manila',
  },
];

const vehicles = [
  {
    name: 'Sedan',
    description: 'Perfect for 2 persons ride',
    price: 380,
    typeId: 1,
    baseFare: 100,
    perKM: 150,
  },
  {
    name: 'Small MPV',
    description: 'Perfect for 2-4 persons',
    price: 500,
    typeId: 2,
    baseFare: 150,
    perKM: 180,
  },
  {
    name: 'Large MPV',
    description: 'Perfect for 3-5 persons',
    price: 600,
    typeId: 3,
    baseFare: 180,
    perKM: 210,
  },
  {
    name: 'Van',
    description: 'Perfect for 4-8 persons',
    price: 700,
    typeId: 4,
    baseFare: 210,
    perKM: 260,
  },
];

export default {
  vehicles,
  recentDestinations,
  savedLocations,
  frequentlyUsed,
};
