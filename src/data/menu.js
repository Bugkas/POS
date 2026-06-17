export const MENU_ITEMS = {
  "b1t1-cheese": { display: "Cheese Burger B1T1", price: 50.00, deduct: { bun: 2, patty: 2, cheese: 2, "burger-dressing": 2 } },
  "b1t1-hamb": { display: "Hamburger B1T1", price: 40.00, deduct: { bun: 2, patty: 2, "burger-dressing": 2 } },
  "b1t1-hamw": { display: "Hamwich B1T1", price: 44.00, deduct: { bun: 2, ham: 2, mayo: 2 } },
  "b1t1-super": { display: "SuperMak B1T1", price: 55.00, deduct: { bun: 2, makpatty: 2, "burger-dressing": 2 } },
  "b1t1-makh": { display: "Mak Hotdog B1T1", price: 40.00, deduct: { "hotdog-bun": 2, hotdog: 2, catsup: 2 } },
  "b1t1-cheesy-footlong": { display: "Cheesy Footlong B1T1", price: 95.00, deduct: { "footlong-bun": 2, footlong: 2, cheese: 2, mayo: 2, catsup: 4 } },
  
  "k-burger": { display: "K-Burger", price: 40.00, deduct: { bun: 1, patty: 1, cheese: 1, kimchi: 1, "burger-dressing": 1 } },
  "k-hotdog": { display: "K-Hotdog", price: 40.00, deduct: { "hotdog-bun": 1, "regular-hotdog": 1, cheese: 1, kimchi: 1, "burger-dressing": 1 } },
  "supreme-overload": { display: "Supreme Overload", price: 89.00, deduct: { bun: 1, patty: 2, cheese: 2, egg: 1, bacon: 1, "burger-dressing": 2 } },
  "hungarian": { display: "Hungarian Sausage", price: 60.00, deduct: { "hotdog-bun": 1, hungarian: 1, catsup: 1 } },
  "footlong-overload": { display: "Footlong Overload", price: 99.00, deduct: { "footlong-bun": 1, footlong: 1, egg: 2, mayo: 1, catsup: 2 } },
  
  "sisig-egg": { display: "Sisig Burger w/ Egg", price: 55.00, deduct: { bun: 1, sisig: 1, egg: 1, mayo: 1 } },
  "sisig": { display: "Sisig Burger", price: 40.00, deduct: { bun: 1, sisig: 1, mayo: 1 } },
  "bacon-egg": { display: "Bacon & Egg", price: 35.00, deduct: { bun: 1, bacon: 1, egg: 1, mayo: 1 } },
  "bacon-sandwich": { display: "Bacon Sandwich", price: 22.00, deduct: { bun: 1, bacon: 1, mayo: 1 } },
  "cheese-bacon": { display: "Cheesy Bacon", price: 26.00, deduct: { bun: 1, bacon: 1, cheese: 1, mayo: 1 } },
  "egg-sandwich": { display: "Egg Sandwich", price: 23.00, deduct: { bun: 1, egg: 1, catsup: 1 } },
  "egg-sandwich-cheese": { display: "Egg Sandwich w/ Cheese", price: 29.00, deduct: { bun: 1, egg: 1, cheese: 1, catsup: 1 } },
  
  "superlong": { display: "Superlong Hotdog", price: 58.00, deduct: { "super-footlong-bun": 1, "super-footlong": 1, mayo: 2, catsup: 3 } },
  "chilidog": { display: "ChiliDog", price: 34.00, deduct: { "hotdog-bun": 1, "regular-hotdog": 1, chiliconcarne: 1 } },
  
  "siopao": { display: "Siopao Asado", price: 30.00, deduct: { siopao: 1 } },
  "pizza": { display: "Pizza Biscuit", price: 48.00, deduct: { pizza: 1 } },
  
  "add-egg": { display: "Extra Egg", price: 15.00, deduct: { egg: 1 } },
  "add-cheese": { display: "Extra Cheese", price: 10.00, deduct: { cheese: 1 } },
  "add-bacon": { display: "Extra Bacon", price: 15.00, deduct: { bacon: 1 } },
  
  "bev-coke-mismo": { display: "Coke Mismo", price: 25.00, deduct: { "coke-mismo": 1 } },
  "bev-royal-mismo": { display: "Royal Mismo", price: 25.00, deduct: { "royal-mismo": 1 } },
  "bev-sprite-mismo": { display: "Sprite Mismo", price: 25.00, deduct: { "sprite-mismo": 1 } },
  "bev-wilkins-500": { display: "Wilkins Pure 500ml", price: 20.00, deduct: { "wilkins-500": 1 } },
  "bev-minutemaid": { display: "Minute Maid Orange", price: 30.00, deduct: { minutemaid: 1 } },
  "bev-nutrichoco": { display: "Nutri Choco 200ml", price: 25.00, deduct: { "nutrichoco": 1 } }
};
export const MENU_CATEGORIES = [
  {
    id: "promo",
    title: "Buy 1 Take 1",
    items: [
      "b1t1-cheese", 
      "b1t1-hamb", 
      "b1t1-hamw", 
      "b1t1-super", 
      "b1t1-makh", 
      "b1t1-cheesy-footlong"
    ]
  },
  {
    id: "specials",
    title: "Specials",
    items: [ 
      "k-burger", 
      "k-hotdog", 
      "supreme-overload",
      "hungarian", 
      "footlong-overload"
    ]
  },
  {
    id: "single",
    title: "Single Orders",
    items: [
      "sisig-egg", 
      "sisig", 
      "bacon-egg", 
      "bacon-sandwich", 
      "cheese-bacon", 
      "egg-sandwich", 
      "egg-sandwich-cheese"
    ]
  },
  {
    id: "hotdogs",
    title: "Hotdogs",
    items: [
      "superlong", 
      "chilidog"
    ]
  },
  {
    id: "others",
    title: "Others",
    items: [
      "siopao", 
      "pizza"
    ]
  },
  {
    id: "addons",
    title: "Add Ons",
    items: [
      "add-egg", 
      "add-cheese", 
      "add-bacon"
    ]
  },
  {
    id: "beverages",
    title: "Beverages",
    items: [
      "bev-coke-mismo", 
      "bev-royal-mismo", 
      "bev-sprite-mismo", 
      "bev-wilkins-500", 
      "bev-minutemaid",
      "bev-nutrichoco"
    ]
  }
];

export const SALES_ORDER = [
  "b1t1-hamb", "b1t1-cheese", "b1t1-hamw", "bacon-egg", "cheese-bacon", 
  "bacon-sandwich", "chilidog", "b1t1-makh", "b1t1-cheesy-footlong", 
  "superlong", "sisig", "sisig-egg", "pizza", "egg-sandwich", 
  "egg-sandwich-cheese", "supreme-overload", "b1t1-super", 
  "k-burger", "k-hotdog", "footlong-overload", "hungarian",
  "siopao", "add-egg", "add-cheese", "add-bacon",
  "bev-coke-mismo", "bev-royal-mismo", "bev-sprite-mismo", 
  "bev-wilkins-500", "bev-nutrichoco", "bev-minutemaid"
];
