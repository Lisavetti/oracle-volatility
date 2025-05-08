const axios = require("axios");
const fs = require("fs");

const PAIRS = [
  { symbol: "BTCUSDT", reverse: false },
  { symbol: "BTCUSDT", reverse: true },
  { symbol: "ETHUSDT", reverse: false },
  { symbol: "ETHUSDT", reverse: true },
  { symbol: "DOGEUSDT", reverse: false },
  { symbol: "DOGEUSDT", reverse: true },
  { symbol: "PEPEUSDT", reverse: false },
  { symbol: "PEPEUSDT", reverse: true },
];

const INTERVAL = "1m"; 
const LIMIT = 1000; 
const WINDOW = 10; 
const STEP = 1; 
const EPSILON = 0.001;

async function fetchBinancePrices(symbol) {
  const url = "https://api.binance.com/api/v3/klines";
  const response = await axios.get(url, {
    params: { symbol, interval: INTERVAL, limit: LIMIT },
  });
  return response.data.map(c => parseFloat(c[4])); // close price
}

function computeMaxDrop(prices) {
  let maxDrop = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      const drop = (prices[i] - prices[j]) / prices[i];
      maxDrop = Math.max(maxDrop, drop);
    }
  }
  return maxDrop;
}

function computeVEpsilon(values, epsilon) {
  const sorted = [...values].sort((a, b) => b - a);
  const index = Math.ceil(epsilon * sorted.length);
  return sorted[index];
}

(async () => {
  const results = [];

  for (const { symbol, reverse } of PAIRS) {
    try {
      const prices = await fetchBinancePrices(symbol);
      const windowSize = WINDOW;
      const stepSize = STEP;
      const vValues = [];

      for (let i = 0; i + windowSize < prices.length; i += stepSize) {
        const window = prices.slice(i, i + windowSize);
        const usedPrices = reverse ? window.map(p => 1 / p) : window;
        const v = computeMaxDrop(usedPrices);
        vValues.push(v);
      }

      const vEps = computeVEpsilon(vValues, EPSILON);
      const name = reverse ? "USDT/" + symbol.replace("USDT", "") : symbol;
      results.push({ pair: name, v_epsilon: vEps });
      console.log(`${name}: v_ε=${vEps.toFixed(6)}`);

    } catch (err) {
      console.error(`Помилка при завантаженні ${symbol}:`, err.message);
    }
  }

  fs.writeFileSync("volatility_results.json", JSON.stringify(results, null, 2));
  console.log("\nРезультати збережено у volatility_results.json");
})();