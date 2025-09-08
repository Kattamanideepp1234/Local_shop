import { useState, useEffect } from "react";
import API from "../../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function ShopkeeperAnalytics() {
    const [analytics, setAnalytics] = useState(null);

    const fetchAnalytics = async () => {
        const res = await API.get("/analytics/sales");
        setAnalytics(res.data || null)
    }

    useEffect(() => {
        fetchAnalytics();
    }, []);
    if (!analytics) return (<p>loading......</p>);

    const chartData = Object.entries(analytics.productStats).map(([product, quantity]) => ({ name: product, quantity }));

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <p>Total Orders: {analytics.totalOrders}</p>
            <p>Total Revenue: ₹{analytics.totalRevenue}</p>

            <h2 className="mt-4 text-xl font-semibold">Top Products</h2>
            <BarChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
        </div>
    )
}