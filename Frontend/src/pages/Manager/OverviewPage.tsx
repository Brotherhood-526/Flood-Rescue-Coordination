import {
  FileText,
  Check,
  Shield,
  Truck,
} from "lucide-react";
import { useMemo } from "react";
import { useManagerDashboard } from "@/hooks/Manager/useManagerDashboard";

export const OverviewPage = () => {
  const { dashboard, loading, error } = useManagerDashboard();

  const completionRateText = useMemo(() => {
    const v = dashboard?.completionRate;
    if (v == null || !Number.isFinite(v)) return "0%";
    // BE có vẻ trả trực tiếp theo % (vd 27.6). Nếu nhỏ hơn hoặc bằng 1, coi là dạng fraction.
    const displayed = v > 1 ? v : v * 100;
    const rounded = displayed % 1 === 0 ? displayed.toFixed(0) : displayed.toFixed(1);
    return `${rounded}%`;
  }, [dashboard?.completionRate]);

  const overviewStats = useMemo(() => {
    const totalRequests = dashboard?.totalRequests ?? 0;
    const activeStaff = dashboard?.activeStaff ?? 0;
    const totalStaff = dashboard?.totalStaff ?? 0;
    const availableVehicle = dashboard?.availableVehicle ?? 0;
    const totalVehicle = dashboard?.totalVehicle ?? 0;

    return [
      {
        title: "Tổng yêu cầu",
        value: loading ? "..." : String(totalRequests),
        icon: FileText,
        cardClass: "bg-blue-700",
      },
      {
        title: "Tỷ lệ thành công",
        value: loading ? "..." : completionRateText,
        icon: Check,
        cardClass: "bg-emerald-700",
      },
      {
        title: "Đội hoạt động",
        value: loading ? "..." : `${activeStaff} / ${totalStaff}`,
        icon: Shield,
        cardClass: "bg-indigo-600",
      },
      {
        title: "Phương tiện có sẵn",
        value: loading ? "..." : `${availableVehicle} / ${totalVehicle}`,
        icon: Truck,
        cardClass: "bg-amber-700",
      },
    ];
  }, [dashboard, loading, completionRateText]);

  const teamPerformance = useMemo(() => {
    const topTeams = dashboard?.topTeams ?? [];
    return topTeams
      .map((t) => {
        const completedCount = Number(t.completedCount) || 0;
        return {
          team: t.leaderName,
          completedCount,
          scorePct: Math.max(0, Math.min(completedCount, 100)),
        };
      })
      .sort((a, b) => b.completedCount - a.completedCount)
      .slice(0, 4);
  }, [dashboard?.topTeams]);

  const topProvinces = useMemo(() => {
    return (dashboard?.topCities ?? []).map((c) => ({
      name: c.city,
      requests: c.requestCount,
    }));
  }, [dashboard?.topCities]);

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.title}
                className={`rounded-2xl p-4 text-white shadow-sm ${stat.cardClass}`}
              >
                <Icon className="h-5 w-5" />
                <p className="mt-3 text-[2rem] font-extrabold leading-none tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-xl font-semibold">{stat.title}</p>
              </article>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Top 4 đội có số lượng nhiệm vụ giải cứu thành công nhiều nhất.
                </h2>

              </div>
            </header>

            <div className="mt-6">
              <div className="ml-14 grid grid-cols-6 text-sm font-semibold text-slate-400">
                {[0, 20, 40, 60, 80, 100].map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>

              <div className="mt-3 space-y-5">
                {teamPerformance.map((item) => (
                  <div key={item.team} className="grid grid-cols-[56px_1fr] items-center gap-2">
                    <span className="text-sm text-slate-500">{item.team}</span>
                    <div className="relative h-10 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-[width] duration-700 ease-out"
                        style={{ width: `${item.scorePct}%` }}
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-0.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
                        style={{ left: `${Math.min(item.scorePct + 2, 96)}%` }}
                      >
                        {item.completedCount}
                      </span>
                    </div>
                  </div>
                ))}

                {!loading && !error && teamPerformance.length === 0 && (
                  <div className="pt-2 text-center text-sm text-slate-500">
                    Không có dữ liệu hiệu suất.
                  </div>
                )}

                {error && (
                  <div className="pt-2 text-center text-sm text-red-600">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Danh sách địa điểm có nhiều yêu cầu cứu hộ
            </h2>

            <div className="mt-4 space-y-4">
              {topProvinces.map((province, index) => (
                <div key={`${province.name}-${index}`} className="border-l-2 border-indigo-400 pl-4">
                  <p className="text-base font-semibold leading-tight text-slate-900">
                    {province.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {province.requests} yêu cầu
                  </p>
                </div>
              ))}

              {!loading && !error && topProvinces.length === 0 && (
                <div className="pt-2 text-center text-sm text-slate-500">
                  Không có dữ liệu tỉnh.
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
