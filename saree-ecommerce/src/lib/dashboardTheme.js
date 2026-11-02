/** Karnan Pattu admin dashboard — shared colors for charts, badges, and metrics. */
export const DASHBOARD = {
  primary: "#4a0e17",
  primarySoft: "#6b1a26",
  secondary: "#c59b27",
  secondaryDeep: "#8a6a1e",
  success: "#2d6a4f",
  successDeep: "#1b4332",
  inkMuted: "#64748b",
  grid: "#e5e7eb",
  donutEmpty: "#e7e5e4",
  catalogueHidden: "#c4a484",
  cream: "#f3e8dc",
  creamDeep: "#e7d5c4",
}

export const ORDER_STATUS_LABELS = [
  "Delivered",
  "Processing",
  "Pending",
  "Shipped",
  "Out for delivery",
  "Cancelled",
]

/** Donut slice colors — spaced across hue so each status is easy to tell apart. */
export const ORDER_STATUS_CHART = {
  Delivered: "#059669",
  Processing: "#2563eb",
  Pending: "#4a0e17",
  Shipped: "#9333ea",
  "Out for delivery": "#0891b2",
  Cancelled: "#dc2626",
}

/** chart = donut slice; pill = Tailwind classes for status &lt;select&gt; */
export const ORDER_STATUS_THEME = {
  Delivered: {
    chart: ORDER_STATUS_CHART.Delivered,
    pill: "border border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]",
  },
  Processing: {
    chart: ORDER_STATUS_CHART.Processing,
    pill: "border border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]",
  },
  Pending: {
    chart: ORDER_STATUS_CHART.Pending,
    pill: "border border-[#e7d5c4] bg-[#f3e8dc] text-[#4a0e17]",
  },
  Shipped: {
    chart: ORDER_STATUS_CHART.Shipped,
    pill: "border border-[#e9d5ff] bg-[#faf5ff] text-[#7e22ce]",
  },
  "Out for delivery": {
    chart: ORDER_STATUS_CHART["Out for delivery"],
    pill: "border border-[#a5f3fc] bg-[#ecfeff] text-[#0e7490]",
  },
  Cancelled: {
    chart: ORDER_STATUS_CHART.Cancelled,
    pill: "border border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]",
  },
}

export function orderStatusPillClass(status) {
  return ORDER_STATUS_THEME[status]?.pill || "border border-stone-200 bg-stone-100 text-stone-600"
}

export function buildOrderStatusRows(countForStatus) {
  return ORDER_STATUS_LABELS.map((label) => ({
    label,
    color: ORDER_STATUS_THEME[label].chart,
    count: countForStatus(label),
  }))
}

export const FUNNEL_BAR_COLORS = [
  DASHBOARD.primary,
  DASHBOARD.primarySoft,
  DASHBOARD.secondary,
  DASHBOARD.success,
]

export const METRIC_CARD_TINTS = [
  "border-[#ecd4d8] bg-[#faf5f6] text-[#4a0e17]",
  "border-[#ede0c4] bg-[#fdf8ee] text-[#8a6a1e]",
  "border-[#e7d5c4] bg-[#f7f1e8] text-[#6b1a26]",
  "border-[#cfe8dc] bg-[#f4faf7] text-[#1b4332]",
]

export const QUICK_STAT_ACCENT = {
  shop: DASHBOARD.primary,
  hidden: DASHBOARD.catalogueHidden,
  messages: DASHBOARD.secondary,
  live: DASHBOARD.success,
}

export const MESSAGE_STATUS_THEME = {
  New: "border border-[#ede0c4] bg-[#faf0d8] text-[#8a6a1e] font-medium",
  Contacted: "border border-[#cfe8dc] bg-[#e8f5ef] text-[#1b4332] font-medium",
  Closed: "border border-[#e7d5c4] bg-[#f3e8dc] text-[#4a0e17] font-medium",
}
