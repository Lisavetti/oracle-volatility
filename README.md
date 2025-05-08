# 📉 Oracle-Based Volatility Calculator

This tool calculates the **short-term price volatility** ($\nu_{A/B}$) for cryptocurrency pairs using historical price data from the [Binance](https://binance.com) API.

The metric $v_\varepsilon$ captures the **maximum relative drop** within short time windows, and is later used to estimate $\nu_{A/B}$ — one of the key risk parameters in DeFi liquidation models.

---

## 📊 Overview

This script:

- Fetches recent 1-minute candle data (1000 points per pair);
- Slices the data into moving windows of 10 minutes (step = 1 min);
- Computes the **maximum price drop** inside each window;
- Selects the $\varepsilon$-percentile of worst drops as $v_\varepsilon$;
- Applies this calculation for both directions: `ASSET/USDT` and `USDT/ASSET`.

### Pairs covered:

- BTC/USDT
- ETH/USDT
- DOGE/USDT
- PEPE/USDT

---


## ⚙️ Installation

```bash
git clone https://github.com/your-username/oracle-volatility.git
cd oracle-volatility
npm install
```

## 🚀 Usage
```bash
node price-drop.js
```

Output is saved to:
```plaintext
volatility_results.json
```

## 📁 Project Structure

```plaintext
oracle-volatility/
├── price-drop.js           # Main script
├── volatility_results.json # Output file
├── package.json
└── package-lock.json
