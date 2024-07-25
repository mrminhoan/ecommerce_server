// ? Strategy Pattern

// PreOrder discount 10%
function preOrder(originalPrice) {
  return originalPrice * 0.9;
}
// Promotion discount 20%
function promotion(originalPrice) {
  return originalPrice * 0.8;
}
// Day Price discount 50%
function dayPrice(originalPrice) {
  return originalPrice * 0.5;
}

const getPriceStrategies = {
  preOrder: preOrder,
  promotion: promotion,
  dayPrice: dayPrice,
};

function getPrice(originalPrice, strategy) {
  return getPriceStrategies[strategy](originalPrice);
}

console.log(getPrice(20, "dayPrice"));
