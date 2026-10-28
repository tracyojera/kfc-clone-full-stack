export const fallbackFoodImage =
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=85";

export const useFallbackImage = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackFoodImage;
};
