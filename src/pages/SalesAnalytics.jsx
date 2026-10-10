
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

import "./SalesAnalytics.css";

const API_URL = "http://127.0.0.1:5000/sales-analytics";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value ?? 0);

function SalesAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError("");

        // Step 1: Get the saved JWT token
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Please log in to access Sales Analytics."
          );
        }

        // Step 2: Send the token to Flask
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          signal: controller.signal
        });

        // Step 3: Read the API response
        const data = await response.json();

        // Step 4: Handle API errors
        if (!response.ok) {
          throw new Error(
            data.error ||
            data.msg ||
            `Failed to fetch analytics. Status: ${response.status}`
          );
        }

        // Step 5: Save the data in React state
        setAnalytics(data);

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(
            "Error fetching sales analytics:",
            err
          );
          setError(
            err.message ||
            "Unable to fetch sales analytics. Please try again."
          );
        }
      } finally {
        // Step 6: Stop the loading indicator
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchAnalytics();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="analytics-message">
        Loading sales analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-message">
        <p>{error}</p>
        <p>
          Check that Flask is running and your account has
          admin access.
        </p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  // Protect the dashboard from unexpected API responses
  if (!analytics) {
    return (
      <div className="analytics-message">
        No analytics data is available.
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Revenue",
      value: currency(analytics.total_revenue),
      icon: "₹",
      description: "Revenue across recorded orders"
    },
    {
      title: "Total Orders",
      value: analytics.order_count,
      icon: "▤",
      description: "Orders recorded in MongoDB"
    },
    {
      title: "Units Sold",
      value: analytics.units_sold,
      icon: "□",
      description: "Total quantities purchased"
    },
    {
      title: "Average Order Value",
      value: currency(analytics.average_order_value),
      icon: "↗",
      description: "Revenue divided by order count"
    }
  ];

  const monthlyRevenue = analytics.monthly_revenue ?? [];
  const productPerformance = analytics.product_performance ?? [];

  return (
    <main className="analytics-page">
      <header className="analytics-header">
        <div>
          <p className="analytics-eyebrow">
            COSMO ROOTS · BUSINESS REPORT
          </p>
          <h1>Sales Analytics</h1>
          <p className="analytics-subtitle">
            Understand revenue, orders, and product performance.
          </p>
        </div>

        <button
          className="analytics-refresh"
          onClick={() => window.location.reload()}
        >
          ↻ Refresh Data
        </button>
      </header>

      {/* Summary cards */}
      <section className="analytics-summary">
        {summaryCards.map((card) => (
          <article className="analytics-card" key={card.title}>
            <div className="analytics-card-top">
              <span>{card.title}</span>
              <span className="analytics-icon">{card.icon}</span>
            </div>

            <h2>{card.value}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      {/* Charts */}
      <section className="analytics-charts">
        <article className="analytics-panel revenue-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Revenue Overview</h2>
              <p>Monthly revenue for the last six months</p>
            </div>
          </div>

          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e8dccd"
                />
                <XAxis
                  dataKey="month"
                  tickFormatter={(month) =>
                    new Date(`${month}-02T12:00:00`).toLocaleDateString(
                      "en-IN",
                      { month: "short", year: "2-digit" }
                    )
                  }
                />
                <YAxis
                  tickFormatter={(value) => `₹${value}`}
                  width={75}
                />
                <Tooltip
                  formatter={(value) => [
                    currency(value),
                    "Revenue"
                  ]}
                  labelFormatter={(month) => `Month: ${month}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#536b3b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="analytics-panel products-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Product Performance</h2>
              <p>Revenue generated by each product</p>
            </div>
          </div>

          {productPerformance.length === 0 ? (
            <p className="analytics-empty">
              No product sales have been recorded yet.
            </p>
          ) : (
            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productPerformance.slice(0, 8)}
                  layout="vertical"
                  margin={{ left: 12, right: 24 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e8dccd"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={125}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      currency(value),
                      "Revenue"
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#536b3b"
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
      </section>

      {/* Product sales table */}
      <section className="analytics-panel performance-table-panel">
        <div className="analytics-panel-heading">
          <div>
            <h2>Product-wise Sales</h2>
            <p>Compare units sold and revenue</p>
          </div>
        </div>

        {productPerformance.length === 0 ? (
          <p className="analytics-empty">
            No sales data available yet.
          </p>
        ) : (
          <div className="analytics-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>
                {productPerformance.map((product, index) => (
                  <tr key={product.name}>
                    <td>#{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.units_sold}</td>
                    <td>{currency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="analytics-footer">
        Data retrieved from the Cosmo Roots Flask API and MongoDB.
      </p>
    </main>
  );
}

export default SalesAnalytics;
