"use client";

interface DashboardChartProps {
  title: string;
  data: {
    ok: number;
    due_60: number;
    due_30: number;
    expired: number;
  };
}

export default function DashboardChart({ title, data }: DashboardChartProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {total > 0 ? (
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{data.ok}</div>
            <div className="text-sm text-gray-500">OK</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{data.due_60}</div>
            <div className="text-sm text-gray-500">Due in 60d</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{data.due_30}</div>
            <div className="text-sm text-gray-500">Due in 30d</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{data.expired}</div>
            <div className="text-sm text-gray-500">Expired</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No data available
        </div>
      )}
    </div>
  );
} 