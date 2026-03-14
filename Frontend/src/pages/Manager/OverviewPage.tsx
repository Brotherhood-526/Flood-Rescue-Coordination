import {
  FileText,
  Check,
  Shield,
  Truck,
} from "lucide-react";

export const OverviewPage = () => {
  const overviewStats = [
    {
      title: "Tổng yêu cầu",
      value: "1000",
      icon: FileText,
      cardClass: "bg-blue-700",
    },
    {
      title: "Tỷ lệ thành công",
      value: "94.3%",
      icon: Check,
      cardClass: "bg-emerald-700",
    },
    {
      title: "Đội hoạt động",
      value: "10 / 20",
      icon: Shield,
      cardClass: "bg-indigo-600",
    },
    {
      title: "Phương tiện có sẵn",
      value: "15 / 30",
      icon: Truck,
      cardClass: "bg-amber-700",
    },
  ];
  const teamPerformance = [
    { team: "Đội 1", score: 27.11 },
    { team: "Đội 2", score: 15.5 },
    { team: "Đội 3", score: 95.81 },
    { team: "Đội 4", score: 17.89 },
  ];
  const topProvinces = [
    { name: "Hà Tĩnh", requests: 40 },
    { name: "Quảng Bình", requests: 40 },
    { name: "Thừa Thiên Huế", requests: 40 },
  ];

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
            <h2 className="text-xl font-bold text-slate-900">
              Hiệu suất theo đội giải cứu
            </h2>

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
                        className="h-full rounded-full bg-emerald-600"
                        style={{ width: `${item.score}%` }}
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500"
                        style={{ left: `${Math.min(item.score + 2, 96)}%` }}
                      >
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Danh sách tỉnh có nhiều yêu cầu cứu hộ
            </h2>

            <div className="mt-6 space-y-8">
              {topProvinces.map((province, index) => (
                <div key={`${province.name}-${index}`} className="border-l-2 border-indigo-400 pl-4">
                  <p className="text-xl font-semibold leading-tight text-slate-900">
                    {province.name}
                  </p>
                  <p className="mt-1 text-lg text-slate-500">
                    {province.requests} yêu cầu
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
