import { pool } from '../config/db.js'

function pctChange(current, previous) {
  if (previous == null || previous === 0) {
    if (current > 0) return 100
    return 0
  }
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export async function getAdminAnalytics() {
  const [
    userRow,
    userTrendRow,
    productRow,
    productTrendRow,
    categoryCountRow,
    categoryTrendRow,
    unitsSoldRow,
    revenueRow,
    categoryStats,
    topProducts,
  ] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS n FROM app_users`),
    pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS curr,
         COUNT(*) FILTER (
           WHERE created_at >= NOW() - INTERVAL '60 days'
             AND created_at < NOW() - INTERVAL '30 days'
         )::int AS prev
       FROM app_users`,
    ),
    pool.query(
      `SELECT COUNT(*)::int AS n FROM products WHERE NOT COALESCE(is_deleted, FALSE)`,
    ),
    pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS curr,
         COUNT(*) FILTER (
           WHERE created_at >= NOW() - INTERVAL '60 days'
             AND created_at < NOW() - INTERVAL '30 days'
         )::int AS prev
       FROM products
       WHERE NOT COALESCE(is_deleted, FALSE)`,
    ),
    pool.query(`SELECT COUNT(*)::int AS n FROM categories`),
    pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS curr,
         COUNT(*) FILTER (
           WHERE created_at >= NOW() - INTERVAL '60 days'
             AND created_at < NOW() - INTERVAL '30 days'
         )::int AS prev
       FROM categories`,
    ),
    pool.query(
      `SELECT COALESCE(SUM(sold), 0)::bigint AS n
       FROM products
       WHERE NOT COALESCE(is_deleted, FALSE)`,
    ),
    pool.query(
      `SELECT COALESCE(SUM(price * sold), 0)::numeric AS n
       FROM products
       WHERE NOT COALESCE(is_deleted, FALSE)`,
    ),
    pool.query(
      `SELECT c.id,
              c.name,
              c.slug,
              c.sort_order,
              COUNT(p.id)::int AS product_count,
              COALESCE(SUM(p.sold), 0)::bigint AS units_sold,
              COALESCE(AVG(p.price), 0)::float8 AS avg_price,
              COALESCE(MAX(p.price), 0)::float8 AS max_price,
              COALESCE(SUM(p.price * p.sold), 0)::float8 AS revenue_estimate
       FROM categories c
       LEFT JOIN products p
         ON p.category_slug = c.slug AND NOT COALESCE(p.is_deleted, FALSE)
       GROUP BY c.id, c.name, c.slug, c.sort_order
       ORDER BY c.sort_order ASC, c.id ASC`,
    ),
    pool.query(
      `SELECT id,
              sku,
              name,
              price::float8 AS price,
              sold,
              image_url,
              category_slug
       FROM products
       WHERE NOT COALESCE(is_deleted, FALSE)
       ORDER BY sold DESC
       LIMIT 8`,
    ),
  ])

  const users = userRow.rows[0].n
  const products = productRow.rows[0].n
  const categories = categoryCountRow.rows[0].n
  const totalUnitsSold = Number(unitsSoldRow.rows[0].n)
  const revenueEstimate = Number(revenueRow.rows[0].n)

  const ut = userTrendRow.rows[0]
  const pt = productTrendRow.rows[0]
  const ct = categoryTrendRow.rows[0]

  const catRows = categoryStats.rows.map((r) => ({
    id: String(r.id),
    name: r.name,
    slug: r.slug,
    sortOrder: r.sort_order,
    productCount: r.product_count,
    unitsSold: Number(r.units_sold),
    avgPrice: Math.round(Number(r.avg_price) * 100) / 100,
    maxPrice: Math.round(Number(r.max_price) * 100) / 100,
    revenueEstimate: Math.round(Number(r.revenue_estimate) * 100) / 100,
  }))

  const withProducts = catRows.filter((c) => c.productCount > 0)
  const bySold = [...withProducts].sort((a, b) => b.unitsSold - a.unitsSold)
  const byAvg = [...withProducts].sort((a, b) => b.avgPrice - a.avgPrice)
  const byRev = [...withProducts].sort((a, b) => b.revenueEstimate - a.revenueEstimate)

  const chartSeries = catRows.map((c) => ({
    label: c.name,
    slug: c.slug,
    unitsSold: c.unitsSold,
    avgPrice: c.avgPrice,
    revenue: c.revenueEstimate,
  }))

  const lineSeries = [...catRows]
    .filter((c) => c.unitsSold > 0 || c.productCount > 0)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 8)

  const barTop = [...catRows]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 7)

  const maxBar = Math.max(1, ...barTop.map((c) => c.unitsSold))

  const totalSoldAcrossCats = catRows.reduce((s, c) => s + c.unitsSold, 0)
  const topShare =
    bySold[0] && totalSoldAcrossCats > 0
      ? Math.round((bySold[0].unitsSold / totalSoldAcrossCats) * 100)
      : 0

  return {
    totals: {
      users,
      products,
      categories,
      totalUnitsSold,
      revenueEstimate: Math.round(revenueEstimate * 100) / 100,
    },
    trends: {
      usersPct: pctChange(ut.curr, ut.prev),
      productsPct: pctChange(pt.curr, pt.prev),
      categoriesPct: pctChange(ct.curr, ct.prev),
      usersCurr: ut.curr,
      usersPrev: ut.prev,
      productsCurr: pt.curr,
      productsPrev: pt.prev,
      categoriesCurr: ct.curr,
      categoriesPrev: ct.prev,
    },
    categories: catRows,
    highlights: {
      mostPurchased: bySold[0] || null,
      highestAvgPrice: byAvg[0] || null,
      highestRevenue: byRev[0] || null,
    },
    chart: {
      lineByUnitsSold: lineSeries,
      barsByUnitsSold: barTop,
      maxBarUnits: maxBar,
      topCategorySharePct: topShare,
      series: chartSeries,
    },
    topProducts: topProducts.rows.map((r) => ({
      id: String(r.id),
      sku: r.sku,
      name: r.name,
      price: Number(r.price),
      sold: r.sold,
      image: r.image_url,
      category: r.category_slug,
      revenue: Math.round(Number(r.price) * Number(r.sold) * 100) / 100,
    })),
  }
}
