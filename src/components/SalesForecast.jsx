
import { useEffect, useState } from "react";
import "./SalesForecast.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

function SalesForecast() {

    const [forecast, setForecast] = useState(null);
    const [history, setHistory] = useState([]);

    const [days, setDays] = useState(7);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch future predictions
    const fetchForecast = async (selectedDays) => {

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://127.0.0.1:5000/api/forecast?days=${selectedDays}`
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || data.message || "Unable to fetch forecast"
                );
            }

            setForecast(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch historical sales
    const fetchHistory = async () => {

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/forecast/history"
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to fetch history");
            }

            setHistory(data.history);

        } catch (err) {
            console.error("History Error:", err.message);
        }
    };

    // Run both API requests
    useEffect(() => {
        fetchForecast(days);
        fetchHistory();
    }, [days]);

    // Format currency
    const formatCurrency = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 0
        })}`;

    // Combine historical and future data
    const chartData = [
        ...history.map((item) => ({
            date: item.date,
            actualRevenue: item.revenue,
            predictedRevenue: null
        })),

        ...(forecast?.predictions || []).map((item) => ({
            date: item.date,
            actualRevenue: null,
            predictedRevenue: item.predictedRevenue
        }))
    ];

    return (
        <div className="sales-forecast">

            <div className="forecast-heading">
                <div>
                    <h2>Sales Forecast</h2>
                    <p>Predicted sales for your store</p>
                </div>

                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                >
                    <option value={7}>Next 7 days</option>
                    <option value={15}>Next 15 days</option>
                    <option value={30}>Next 30 days</option>
                </select>
            </div>

            {loading && <p>Loading forecast...</p>}

            {error && (
                <p className="forecast-error">{error}</p>
            )}

            {!loading && !error && forecast && (
                <>

                    {/* KPI Cards */}
                    <div className="forecast-cards">

                        <div className="forecast-card">
                            <p>Predicted Revenue</p>
                            <h3>
                                {formatCurrency(forecast.totalPredictedRevenue)}
                            </h3>
                        </div>

                        <div className="forecast-card">
                            <p>Predicted Units</p>
                            <h3>
                                {Number(forecast.totalPredictedUnits || 0)
                                    .toLocaleString("en-IN")}
                            </h3>
                        </div>

                        <div className="forecast-card">
                            <p>Average Daily Revenue</p>
                            <h3>
                                {formatCurrency(forecast.averageDailyRevenue)}
                            </h3>
                        </div>

                    </div>

                    {/* Revenue Chart */}
                    <div className="forecast-chart-section">

                        <h3>Revenue Overview</h3>
                        <p>Historical vs Predicted Revenue</p>

                        <div className="forecast-chart">

                            <ResponsiveContainer width="100%" height="100%">

                                <LineChart data={chartData}>

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11 }}
                                    />

                                    <YAxis
                                        tickFormatter={(value) => `₹${value}`}
                                    />

                                    <Tooltip
                                        formatter={(value) =>
                                            value === null
                                                ? "No data"
                                                : formatCurrency(value)
                                        }
                                    />

                                    <Legend />

                                    <Line
                                        type="monotone"
                                        dataKey="actualRevenue"
                                        name="Actual Revenue"
                                        stroke="#536b3b"
                                        strokeWidth={2}
                                        dot={false}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="predictedRevenue"
                                        name="Predicted Revenue"
                                        stroke="#e09b45"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>
                    </div>

                    {/* Daily Predictions Table */}
                    <h3 className="forecast-table-title">
                        Daily Predictions
                    </h3>

                    <div className="forecast-table-wrapper">

                        <table className="forecast-table">

                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Predicted Revenue</th>
                                    <th>Predicted Units</th>
                                </tr>
                            </thead>

                            <tbody>

                                {forecast.predictions?.map((item, index) => (

                                    <tr key={item.date || index}>
                                        <td>{item.date}</td>

                                        <td>
                                            {formatCurrency(item.predictedRevenue)}
                                        </td>

                                        <td>{item.predictedUnits}</td>
                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </>
            )}

        </div>
    );
}

export default SalesForecast;
