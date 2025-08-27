"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Cat = { category: string; count: number; stockValue: number };

export default function CategoryChart({ data }: { data: Cat[] }) {
  const labels = data.map((d) => d.category || "Sem categoria");
  const counts = data.map((d) => d.count);

  const ds = {
    labels,
    datasets: [
      {
        label: "Produtos por categoria",
        data: counts,
      },
    ],
  };

  return (
    <div className="w-full max-w-3xl">
      <Bar data={ds} />
    </div>
  );
}
