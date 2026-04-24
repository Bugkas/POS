import { MENU_ITEMS } from './menu';

export const getInitialInventory = () => {
  const inventory = {};
  Object.values(MENU_ITEMS).forEach(item => {
    Object.keys(item.deduct).forEach(ingredient => {
      inventory[ingredient] = 0;
    });
  });
  return inventory;
};

// Also export a list of unique ingredient names for display purposes
export const INGREDIENT_NAMES = Object.keys(getInitialInventory()).sort();

export const PACK_SIZES = {
  "bun": 6,
  "hotdog-bun": 6,
  "footlong-bun": 6,
  "super-footlong-bun": 6,
  "patty": 24,
  "makpatty": 12,
  "bacon": 6,
  "ham": 6,
  "hotdog": 24,
  "regular-hotdog":12,
  "footlong": 9,
  "super-footlong": 6,
  "cheese": 24,
  "pizza": 5,
  "coke-mismo": 12,
  "royal-mismo": 12,
  "sprite-mismo": 12,
  "wilkins-500": 24,
  "minutemaid": 24
};

export const INVENTORY_CATEGORIES = [
  {
    id: "singles",
    title: "Single Orders",
    items: ["sisig", "pizza"]
  },
  {
    id: "addons",
    title: "Add ons",
    items: ["egg", "cheese", "bacon"]
  },
  {
    id: "bread",
    title: "Bread",
    items: ["bun", "hotdog-bun", "footlong-bun", "super-footlong-bun"]
  },
  {
    id: "meats",
    title: "Meats",
    items: ["patty", "makpatty", "bacon", "ham", "regular-hotdog", "hotdog", "footlong", "super-footlong", "hungarian"]
  },
  {
    id: "beverages",
    title: "Beverages",
    items: ["coke-mismo", "royal-mismo", "sprite-mismo", "wilkins-500", "nutrichoco", "minutemaid"]
  },
  {
    id: "others",
    title: "Others",
    items: ["siopao", "kimchi", "chiliconcarne"]
  }
];
