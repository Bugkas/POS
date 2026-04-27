import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getInitialInventory } from '../data/ingredients';
import { MENU_ITEMS, MENU_CATEGORIES } from '../data/menu';

// Internal helper for static categories, used by the store
const isBeverage = (itemKey) => {
  const bevCategory = MENU_CATEGORIES.find(c => c.id === 'beverages');
  return bevCategory?.items.includes(itemKey);
};

export const useStore = create(
  persist(
    (set) => ({
      inventory: getInitialInventory(),
      dailySales: 0,
      itemsSold: {},
      transactions: [],
      totalCommission: 0,
      openingInventory: null,
      closingInventory: null,
      menuItems: MENU_ITEMS,
      foodCommissionRate: 0.15,
      bevCommissionRate: 0.05,
      cart: [],
      
      addToCart: (itemKey, quantity) => {
        set((state) => {
          const existingItemIndex = state.cart.findIndex(item => item.itemKey === itemKey);
          
          if (existingItemIndex !== -1) {
            // Combine with existing item
            const newCart = [...state.cart];
            newCart[existingItemIndex] = {
              ...newCart[existingItemIndex],
              quantity: newCart[existingItemIndex].quantity + quantity
            };
            return { cart: newCart };
          } else {
            // Add as new item
            return {
              cart: [...state.cart, { itemKey, quantity, id: Date.now() + Math.random() }]
            };
          }
        });
      },

      updateCartQuantity: (id, newQuantity) => {
        set((state) => {
          if (newQuantity <= 0) {
            return { cart: state.cart.filter(item => item.id !== id) };
          }
          return {
            cart: state.cart.map(item => 
              item.id === id ? { ...item, quantity: newQuantity } : item
            )
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== id)
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      checkout: () => {
        set((state) => {
          if (state.cart.length === 0) return state;

          const newInventory = { ...state.inventory };
          const newItemsSold = { ...state.itemsSold };
          let addedSales = 0;
          let addedCommission = 0;
          const newTransactions = [];

          state.cart.forEach((cartItem) => {
            const item = state.menuItems[cartItem.itemKey];
            if (!item) return;

            // Deduct from inventory
            Object.entries(item.deduct).forEach(([ingredient, amount]) => {
              newInventory[ingredient] = (newInventory[ingredient] || 0) - (amount * cartItem.quantity);
            });

            // Update items sold
            newItemsSold[cartItem.itemKey] = (newItemsSold[cartItem.itemKey] || 0) + cartItem.quantity;

            const total = item.price * cartItem.quantity;
            const rate = isBeverage(cartItem.itemKey) ? state.bevCommissionRate : state.foodCommissionRate;
            const commission = total * rate;

            addedSales += total;
            addedCommission += commission;

            newTransactions.push({
              id: Date.now() + Math.random(),
              timestamp: new Date().toISOString(),
              itemKey: cartItem.itemKey,
              quantity: cartItem.quantity,
              total,
              commission
            });
          });

          return {
            inventory: newInventory,
            dailySales: state.dailySales + addedSales,
            itemsSold: newItemsSold,
            transactions: [...state.transactions, ...newTransactions],
            totalCommission: state.totalCommission + addedCommission,
            cart: [] // Clear cart after checkout
          };
        });
      },
      
      updateCommissionRates: (foodRate, bevRate) => {
        set((state) => {
          const fRate = parseFloat(foodRate);
          const bRate = parseFloat(bevRate);
          
          let newTotalCommission = 0;
          const updatedTransactions = state.transactions.map(tx => {
            const rate = isBeverage(tx.itemKey) ? bRate : fRate;
            const commission = tx.total * rate;
            newTotalCommission += commission;
            return { ...tx, commission };
          });

          return { 
            foodCommissionRate: fRate,
            bevCommissionRate: bRate,
            transactions: updatedTransactions,
            totalCommission: newTotalCommission
          };
        });
      },
      
      updateItemPrice: (itemKey, newPrice) => {
        set((state) => {
          const updatedPrice = parseFloat(newPrice);
          const updatedMenuItems = {
            ...state.menuItems,
            [itemKey]: {
              ...state.menuItems[itemKey],
              price: updatedPrice
            }
          };

          let newDailySales = 0;
          let newTotalCommission = 0;
          
          const updatedTransactions = state.transactions.map(tx => {
            if (tx.itemKey === itemKey) {
              const total = updatedPrice * tx.quantity;
              const rate = isBeverage(tx.itemKey) ? state.bevCommissionRate : state.foodCommissionRate;
              const commission = total * rate;
              const updatedTx = { ...tx, total, commission };
              newDailySales += updatedTx.total;
              newTotalCommission += updatedTx.commission;
              return updatedTx;
            }
            newDailySales += tx.total;
            newTotalCommission += tx.commission;
            return tx;
          });

          return {
            menuItems: updatedMenuItems,
            transactions: updatedTransactions,
            dailySales: newDailySales,
            totalCommission: newTotalCommission
          };
        });
      },
      
      processSale: (itemKey, quantity) => {
        set((state) => {
          const item = state.menuItems[itemKey];
          if (!item) return state;
          const newInventory = { ...state.inventory };
          
          Object.entries(item.deduct).forEach(([ingredient, amount]) => {
            newInventory[ingredient] = (newInventory[ingredient] || 0) - (amount * quantity);
          });
          
          const newItemsSold = { ...state.itemsSold };
          newItemsSold[itemKey] = (newItemsSold[itemKey] || 0) + quantity;
          
          const total = item.price * quantity;
          const rate = isBeverage(itemKey) ? state.bevCommissionRate : state.foodCommissionRate;
          const commission = total * rate;
          
          const newTransaction = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            itemKey,
            quantity,
            total,
            commission
          };
          
          return {
            inventory: newInventory,
            dailySales: state.dailySales + total,
            itemsSold: newItemsSold,
            transactions: [...state.transactions, newTransaction],
            totalCommission: state.totalCommission + commission
          };
        });
      },
      
      deleteTransaction: (id) => {
        set((state) => {
          const tx = state.transactions.find(t => t.id === id);
          if (!tx) return state;
          
          const item = state.menuItems[tx.itemKey];
          const newInventory = { ...state.inventory };
          if (item) {
            Object.entries(item.deduct).forEach(([ingredient, amount]) => {
              newInventory[ingredient] = (newInventory[ingredient] || 0) + (amount * tx.quantity);
            });
          }
          
          const newItemsSold = { ...state.itemsSold };
          if (newItemsSold[tx.itemKey]) {
            newItemsSold[tx.itemKey] -= tx.quantity;
            if (newItemsSold[tx.itemKey] <= 0) delete newItemsSold[tx.itemKey];
          }
          
          return {
            inventory: newInventory,
            dailySales: Math.max(0, state.dailySales - tx.total),
            totalCommission: Math.max(0, state.totalCommission - tx.commission),
            itemsSold: newItemsSold,
            transactions: state.transactions.filter(t => t.id !== id)
          };
        });
      },

      editTransaction: (id, newQuantity) => {
        set((state) => {
          const txIndex = state.transactions.findIndex(t => t.id === id);
          if (txIndex === -1) return state;
          const oldTx = state.transactions[txIndex];
          const item = state.menuItems[oldTx.itemKey];
          if (!item) return state;

          // Revert old transaction
          const newInventory = { ...state.inventory };
          Object.entries(item.deduct).forEach(([ingredient, amount]) => {
            newInventory[ingredient] = (newInventory[ingredient] || 0) + (amount * oldTx.quantity);
          });
          const tempItemsSold = { ...state.itemsSold };
          if (tempItemsSold[oldTx.itemKey]) {
            tempItemsSold[oldTx.itemKey] -= oldTx.quantity;
          }

          // Apply new transaction
          Object.entries(item.deduct).forEach(([ingredient, amount]) => {
            newInventory[ingredient] = (newInventory[ingredient] || 0) - (amount * newQuantity);
          });
          tempItemsSold[oldTx.itemKey] = (tempItemsSold[oldTx.itemKey] || 0) + newQuantity;

          const newTotal = item.price * newQuantity;
          const rate = isBeverage(oldTx.itemKey) ? state.bevCommissionRate : state.foodCommissionRate;
          const newCommission = newTotal * rate;

          const updatedTx = {
            ...oldTx,
            quantity: newQuantity,
            total: newTotal,
            commission: newCommission
          };

          const newTransactions = [...state.transactions];
          newTransactions[txIndex] = updatedTx;

          return {
            inventory: newInventory,
            dailySales: state.dailySales - oldTx.total + newTotal,
            totalCommission: state.totalCommission - oldTx.commission + newCommission,
            itemsSold: tempItemsSold,
            transactions: newTransactions
          };
        });
      },
      
      addStock: (ingredient, quantity) => {
        set((state) => ({
          inventory: {
            ...state.inventory,
            [ingredient]: (state.inventory[ingredient] || 0) + quantity
          }
        }));
      },
      
      deductStock: (ingredient, quantity) => {
        set((state) => ({
          inventory: {
            ...state.inventory,
            [ingredient]: Math.max(0, (state.inventory[ingredient] || 0) - quantity)
          }
        }));
      },
      
      resetInventory: () => {
        set({ inventory: getInitialInventory() });
      },
      
      setOpeningInventory: () => {
        set((state) => ({ 
          openingInventory: { ...state.inventory },
          closingInventory: null 
        }));
      },
      
      setClosingInventory: () => {
        set((state) => ({ closingInventory: { ...state.inventory } }));
      },

      closeRegister: () => {
        set({ 
          dailySales: 0, 
          itemsSold: {}, 
          transactions: [], 
          totalCommission: 0,
          openingInventory: null,
          closingInventory: null
        });
      },

      toastMessage: null,
      toastTimeout: null,
      showToast: (message) => {
        set((state) => {
          if (state.toastTimeout) {
            clearTimeout(state.toastTimeout);
          }
          const timeout = setTimeout(() => {
            set({ toastMessage: null, toastTimeout: null });
          }, 2500);
          return { toastMessage: message, toastTimeout: timeout };
        });
      }
    }),
    {
      name: 'pos-storage',
      partialize: (state) => ({ 
        inventory: state.inventory, 
        dailySales: state.dailySales, 
        itemsSold: state.itemsSold,
        transactions: state.transactions,
        totalCommission: state.totalCommission,
        openingInventory: state.openingInventory,
        closingInventory: state.closingInventory,
        menuItems: state.menuItems,
        foodCommissionRate: state.foodCommissionRate,
        bevCommissionRate: state.bevCommissionRate
      }),
    }
  )
);
