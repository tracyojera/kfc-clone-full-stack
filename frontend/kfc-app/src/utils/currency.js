export const getPriceAmount = (price) => {
  if (price === null || price === undefined || String(price).trim() === "") {
    return 0;
  }

  const numericValue = Number(price);
  if (Number.isFinite(numericValue)) {
    return numericValue;
  }

  const normalizedPrice = String(price)
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  if (!normalizedPrice || normalizedPrice === "-" || normalizedPrice === ".") {
    return 0;
  }

  const amount = Number.parseFloat(normalizedPrice);
  return Number.isFinite(amount) ? amount : 0;
};

export const getSafeQuantity = (quantity) => {
  const amount = Number(quantity);
  return Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0;
};

export const formatUGX = (price) => {
  const amount = getPriceAmount(price);

  return `UGX ${new Intl.NumberFormat("en-UG", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
};