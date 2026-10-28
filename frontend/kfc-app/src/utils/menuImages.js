const menuImages = {
  "Zinger Burger": "/menu-images/zinger-burger.jpg",
  "Chicken Pizza": "/menu-images/chicken-pizza.jpg",
  "Chicken Burger": "/menu-images/chicken-burger.jpg",
  "Chicken Wings": "/menu-images/chicken-wings.jpg",
  "Soft Drink Combo": "/menu-images/soft-drink-combo.jpg",
  "Chicken Biryani Bucket": "/menu-images/chicken-biryani-bucket.jpg",
  "Chicken Cheese Roll": "/menu-images/chicken-cheese-roll.jpg",
  "Vegetable Samosa": "/menu-images/vegetable-samosa.jpg",
  "Plain Rice with Chicken": "/menu-images/plain-rice-with-chicken.jpg",
  "Family Chicken Feast": "/menu-images/family-chicken-feast.jpg",
  "Burger Box Meal": "/menu-images/burger-box-meal.jpg",
  "Chicken Strips": "/menu-images/chicken-strips.jpg",
  "6 Piece Chicken Bucket": "/menu-images/6-piece-chicken-bucket.jpg",
  "Classic Crispy Chicken Burger": "/menu-images/classic-crispy-chicken-burger.jpg",
  "Cheesy Chicken Burger": "/menu-images/cheesy-chicken-burger.jpg",
  "Loaded Chicken Tenders": "/menu-images/loaded-chicken-tenders.jpg",
  "Coca-Cola": "/menu-images/coca-cola.jpg",
  kwench: "/menu-images/kwench.jpg",
  "Iced Tea": "/menu-images/iced-tea.jpg",
  Pepsi: "/menu-images/pepsi.jpg",
};

export const getMenuImage = (title, originalImage) => {
  if (originalImage) return originalImage;

  const localImage = menuImages[title?.trim()];
  return localImage ? `${process.env.PUBLIC_URL}${localImage}` : "";
};