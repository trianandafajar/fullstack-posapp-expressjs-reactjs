import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import secureLocalStorage from "react-secure-storage";
import { useCallback, useEffect, useState, memo, useMemo } from "react";
import PropTypes from "prop-types";
// import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = memo(({ setTotPurchase, setTotOrder }) => {
  const [purchase, setPurchase] = useState([]);
  const [order, setOrder] = useState([]);

  const loadPurchase = useCallback(async () => {
    try {
      const out = await axiosInstance.get("/api/purchase-year", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
        },
      });
      setPurchase(out.data.result);
      setTotPurchase(out.data.result.reduce((a, b) => a + b, 0));
    } catch (error) {
      console.error("Error loading purchase data:", error);
    }
  }, [setTotPurchase]);

  const loadOrder = useCallback(async () => {
    try {
      const out = await axiosInstance.get("/api/orders-year", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
        },
      });
      setOrder(out.data.result);
      setTotOrder(out.data.result.reduce((a, b) => a + b, 0));
    } catch (error) {
      console.error("Error loading order data:", error);
    }
  }, [setTotOrder]);

  useEffect(() => {
    loadPurchase();
    loadOrder();
  }, [loadPurchase, loadOrder]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `PERFORMANCE PT ABCD ${new Date().getFullYear()}`,
      },
    },
  }), []);

  const data = useMemo(() => ({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Purchase",
        data: purchase,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Order",
        data: order,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }), [purchase, order]);

  return <Bar options={options} data={data} />;
});

ChartComponent.propTypes = {
  setTotPurchase: PropTypes.func.isRequired,
  setTotOrder: PropTypes.func.isRequired,
};

export default ChartComponent;
