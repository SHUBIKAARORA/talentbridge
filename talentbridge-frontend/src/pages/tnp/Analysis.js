import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

const COLORS = ["#6366F1", "#38BDF8", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

const STATUS_COLORS = {
  applied:     "#6366F1",
  shortlisted: "#F59E0B",
  selected:    "#10B981",
  rejected:    "#EF4444",
};

const BASE = "http://localhost:8080/analytics";

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tnp-chart-tooltip">
      {label && <div className="tnp-chart-tooltip-label">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="tnp-chart-tooltip-row">
          <span className="tnp-chart-tooltip-dot" style={{ background: p.color || p.fill }} />
          <span>{p.name}: <strong>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="tnp-stat-card">
      <div className="tnp-stat-icon" style={{ background: color + "18" }}>{icon}</div>
      <div>
        <div className="tnp-stat-value">{value}</div>
        <div className="tnp-stat-label">{label}</div>
        {sub && <div className="tnp-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function Section({ title, sub, children }) {
  return (
    <div className="tnp-analytics-section">
      <div className="tnp-analytics-section-header">
        <div className="tnp-analytics-section-title">{title}</div>
        {sub && <div className="tnp-analytics-section-sub">{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Analysis() {
  const [summary, setSummary]   = useState(null);
  const [deptData, setDeptData] = useState([]);
  const [compData, setCompData] = useState([]);
  const [statusData, setStatus] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, d, c, st, t] = await Promise.all([
          axios.get(`${BASE}/placement-summary`,      { headers }),
          axios.get(`${BASE}/department-wise`,        { headers }),
          axios.get(`${BASE}/company-wise`,           { headers }),
          axios.get(`${BASE}/status`,                 { headers }),
          axios.get(`${BASE}/applications-over-time`, { headers }),
        ]);
        setSummary(s.data);
        setDeptData(d.data);
        setCompData(c.data);
        setStatus(st.data.map(item => ({
          ...item,
          fill: STATUS_COLORS[item.status?.toLowerCase()] || "#94A3B8",
        })));
        setTimeData(t.data.map(item => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        })));
      } catch {
        setError("Failed to load analytics data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="tnp-analytics-loading">
      <div className="tnp-analytics-spinner" />
      Loading analytics...
    </div>
  );

  if (error) return (
    <div className="tnp-message tnp-message--error" style={{ maxWidth: 480 }}>{error}</div>
  );

  const pct = summary ? Math.round(summary.placementPercentage) : 0;

  return (
    <div className="tnp-analytics">

      {/* ── Stat cards ── */}
      <div className="tnp-stat-grid">
        <StatCard
          label="Total students"
          value={summary?.totalStudents ?? "—"}
          color="#6366F1"
          icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke="#6366F1" strokeWidth="1.4"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/></svg>}
        />
        <StatCard
          label="Placed students"
          value={summary?.placedStudents ?? "—"}
          sub={`${pct}% placement rate`}
          color="#10B981"
          icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#10B981" strokeWidth="1.4"/><path d="M5 8l2 2 4-4" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
        <StatCard
          label="Unplaced students"
          value={summary?.unplacedStudents ?? "—"}
          color="#EF4444"
          icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#EF4444" strokeWidth="1.4"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round"/></svg>}
        />
        <StatCard
          label="Companies hired"
          value={compData.length}
          color="#38BDF8"
          icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="2" stroke="#38BDF8" strokeWidth="1.4"/><path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="#38BDF8" strokeWidth="1.4"/></svg>}
        />
      </div>

      {/* ── Placement rate bar ── */}
      <Section
        title="Overall placement rate"
        sub={`${summary?.placedStudents} out of ${summary?.totalStudents} students placed`}
      >
        <div className="tnp-progress-wrap">
          <div className="tnp-progress-bar">
            <div className="tnp-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="tnp-progress-pct">{pct}%</span>
        </div>
      </Section>

      {/* ── Dept + Status side by side ── */}
      <div className="tnp-charts-row">

        <Section title="Department-wise placements" sub="Students placed per department">
          <div className="tnp-chart-box">
            {deptData.length === 0 ? <div className="tnp-chart-empty">No data yet</div> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={deptData} margin={{ top: 8, right: 8, left: -16, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                  <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#94A3B8" }} angle={-35} textAnchor="end" interval={0}/>
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} allowDecimals={false}/>
                  <Tooltip content={<ChartTooltip />}/>
                  <Bar dataKey="count" name="Placed" fill="#6366F1" radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Section>

        <Section title="Application status breakdown" sub="Current status of all applications">
          <div className="tnp-chart-box">
            {statusData.length === 0 ? <div className="tnp-chart-empty">No data yet</div> : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusData} dataKey="count" nameKey="status"
                      cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill}/>
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="tnp-pie-legend">
                  {statusData.map((item, i) => (
                    <div key={i} className="tnp-pie-legend-item">
                      <span className="tnp-pie-legend-dot" style={{ background: item.fill }}/>
                      <span className="tnp-pie-legend-label">{item.status}</span>
                      <span className="tnp-pie-legend-val">{item.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Section>

      </div>

      {/* ── Applications over time ── */}
      <Section title="Applications over time" sub="Daily application volume across the placement season">
        <div className="tnp-chart-box tnp-chart-box--wide">
          {timeData.length === 0 ? <div className="tnp-chart-empty">No data yet</div> : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={timeData} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} interval="preserveStartEnd"/>
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} allowDecimals={false}/>
                <Tooltip content={<ChartTooltip />}/>
                <Line type="monotone" dataKey="count" name="Applications"
                  stroke="#6366F1" strokeWidth={2.5} dot={false}
                  activeDot={{ r: 5, fill: "#6366F1" }}/>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Section>

      {/* ── Company hiring horizontal bar ── */}
      <Section title="Top hiring companies" sub="Number of students hired per company (top 12)">
        <div className="tnp-chart-box tnp-chart-box--wide">
          {compData.length === 0 ? <div className="tnp-chart-empty">No data yet</div> : (
            <ResponsiveContainer width="100%" height={Math.max(280, Math.min(compData.length, 12) * 44)}>
              <BarChart
                data={[...compData].sort((a, b) => b.hires - a.hires).slice(0, 12)}
                layout="vertical"
                margin={{ top: 8, right: 48, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false}/>
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} allowDecimals={false}/>
                <YAxis type="category" dataKey="company" tick={{ fontSize: 12, fill: "#475569" }} width={130}/>
                <Tooltip content={<ChartTooltip />}/>
                <Bar dataKey="hires" name="Hires" radius={[0, 4, 4, 0]}>
                  {[...compData].sort((a, b) => b.hires - a.hires).slice(0, 12).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Section>

    </div>
  );
}

export default Analysis;