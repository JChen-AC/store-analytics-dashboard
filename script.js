const API_URL =
  "https://jingjing-store-analytics-func-gtesdadsccaugrds.canadacentral-01.azurewebsites.net/api/GetDashboardData";
  
function updateStatus(message) {
  document.getElementById("status").textContent = message;
}

function updateDashboard(data) {
  const events = data || {};
  //const orders = events.filter(e => e.event_type === "order_placed");
  //const addToCart = events.filter(e => e.event_type === "add_to_cart");
  //const cartAbandons = events.filter(e => e.event_type === "cart_abandon");

  const orders = events.totalorder;
  const revenue = events.totalrevenue;
  const conversion = events.conversion;

  /*
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (order.order_value || 0);
  }, 0);*/

  /*const totalOrders = orders.length;
  const addToCartCount = addToCart.length;
  const cartAbandonCount = cartAbandons.length;

  const conversionRate =
    addToCartCount > 0
      ? ((totalOrders / addToCartCount) * 100).toFixed(1) + "%"
      : "0%";
  */

  document.getElementById("totalRevenue").textContent =   "$" + (events.totalrevenue || 0).toFixed(2);
  document.getElementById("totalOrders").textContent = events.totalorder || 0;
  //document.getElementById("addToCart").textContent = addToCartCount;
  //document.getElementById("cartAbandons").textContent = cartAbandonCount;
  document.getElementById("conversionRate").textContent = ((events.conversion?.conversionRate || 0) * 100).toFixed(1) + "%";

  const riskList = document.getElementById("risk-list");
  riskList.innerHTML = "";

  const riskProduct = events.riskstatus || [];

  riskProduct.forEach(item => {
    const li = document.createElement("li");

    li.textContent =
      `Order ID: ${item.order_id}, Risk Status: ${item.riskStatus}`;

    riskList.appendChild(li);
  });

  const pageList = document.getElementById("page-list");
  pageList.innerHTML = "";

  const pageProduct = events.price || [];

  pageProduct.forEach(item => {
    const li = document.createElement("li");

    li.textContent =
      `Product ID: ${item.product_id}, Page Score: ${item.page_score}`;

    pageList.appendChild(li);
  });

  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

  const customerProduct = events.abandon || [];

  customerProduct.forEach(item => {
    const li = document.createElement("li");

    li.textContent =
      `Customer ID: ${item.customer_id}, State: ${item.trueAbandon}, Rate: ${item.abandon_rate}`;

    cartList.appendChild(li);
  });

  document.getElementById("rawJson").textContent = JSON.stringify(data, null, 2);
}

async function loadData() {
  try {
    updateStatus("Loading data from Azure Function...");

    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
      updateStatus(data.message || "No data available yet.");
      document.getElementById("rawJson").textContent = JSON.stringify(data, null, 2);
      return;
    }

    updateStatus("Dashboard loaded successfully.");
    updateDashboard(data);
  } catch (error) {
    updateStatus("Unable to load data from API.");
    document.getElementById("rawJson").textContent = error.message;
  }
}

loadData();