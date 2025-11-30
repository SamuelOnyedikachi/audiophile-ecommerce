import { query } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

// Type definitions
type DashboardKPI = {
  period: string;
  kpis: Array<{
    label: string;
    value: string;
    change: string;
    trend: string;
  }>;
};

/**
 * Calculate real COGS for items in an order
 * Uses cost from product schema, falls back to 40% of price if cost not set
 */
function calculateOrderCOGS(
  items: Array<{ price: number; cost?: number; qty: number }>
): number {
  return items.reduce((sum, item) => {
    const unitCost = item.cost ?? item.price * 0.4; // Fallback to 40% COGS
    return sum + unitCost * item.qty;
  }, 0);
}

/**
 * Calculate total refunds for an order
 */
function calculateTotalRefunds(refunds?: Array<{ amount: number }>): number {
  return refunds?.reduce((sum, r) => sum + r.amount, 0) ?? 0;
}

/**
 * Calculate total discounts for an order
 */
function calculateTotalDiscounts(
  discounts?: Array<{ amount: number }>
): number {
  return discounts?.reduce((sum, d) => sum + d.amount, 0) ?? 0;
}

/**
 * Calculate net revenue after refunds and discounts
 */
function calculateNetRevenue(
  grossTotal: number,
  refunds: number,
  discounts: number
): number {
  return Math.max(0, grossTotal - refunds - discounts);
}

/**
 * Parse date string to Date object (handles YYYY-MM-DD format)
 */
function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Get all orders and calculate detailed financial metrics
 * Includes: revenue, COGS, profit, margins, time-series data, YoY/MoM deltas
 */
export const getFinancialMetrics = query({
  args: {
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const allOrders = await ctx.db.query('orders').collect();

    const startParsed = parseDate(args.startDate);
    const endParsed = parseDate(args.endDate);
    endParsed.setHours(23, 59, 59, 999);

    // Filter orders in date range
    const filteredOrders = allOrders.filter((order) => {
      const orderDate = parseDate(order.createdAt);
      return orderDate >= startParsed && orderDate <= endParsed;
    });

    // Calculate aggregate metrics
    let totalGrossRevenue = 0;
    let totalRefunds = 0;
    let totalDiscounts = 0;
    let totalCOGS = 0;
    let deliveredOrders = 0;

    const ordersByDay: Record<
      string,
      {
        revenue: number;
        cogs: number;
        refunds: number;
        discounts: number;
        count: number;
        shippingCost: number;
      }
    > = {};

    filteredOrders.forEach((order) => {
      const orderDate = parseDate(order.createdAt);
      const dateKey = orderDate.toISOString().split('T')[0];

      // Initialize day bucket
      if (!ordersByDay[dateKey]) {
        ordersByDay[dateKey] = {
          revenue: 0,
          cogs: 0,
          refunds: 0,
          discounts: 0,
          count: 0,
          shippingCost: 0,
        };
      }

      const orderCOGS = calculateOrderCOGS(order.items || []);
      const orderRefunds = calculateTotalRefunds(order.refunds);
      const orderDiscounts = calculateTotalDiscounts(order.discounts);
      const orderNetRevenue = calculateNetRevenue(
        order.totals.total,
        orderRefunds,
        orderDiscounts
      );

      // Aggregate totals
      totalGrossRevenue += order.totals.total;
      totalRefunds += orderRefunds;
      totalDiscounts += orderDiscounts;
      totalCOGS += orderCOGS;
      if (order.status === 'delivered') {
        deliveredOrders += 1;
      }

      // Daily breakdown
      ordersByDay[dateKey].revenue += orderNetRevenue;
      ordersByDay[dateKey].cogs += orderCOGS;
      ordersByDay[dateKey].refunds += orderRefunds;
      ordersByDay[dateKey].discounts += orderDiscounts;
      ordersByDay[dateKey].count += 1;
      ordersByDay[dateKey].shippingCost += order.totals.shipping;
    });

    // Calculate net metrics
    const totalNetRevenue = calculateNetRevenue(
      totalGrossRevenue,
      totalRefunds,
      totalDiscounts
    );
    const totalProfit = totalNetRevenue - totalCOGS;
    const grossMargin =
      totalNetRevenue > 0
        ? ((totalProfit / totalNetRevenue) * 100).toFixed(2)
        : '0.00';
    const avgOrderValue =
      filteredOrders.length > 0 ? totalNetRevenue / filteredOrders.length : 0;

    // Build daily time-series
    const timeSeries = Object.entries(ordersByDay)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, metrics]) => {
        const dayProfit = metrics.revenue - metrics.cogs;
        const dayMargin =
          metrics.revenue > 0
            ? ((dayProfit / metrics.revenue) * 100).toFixed(2)
            : '0.00';
        return {
          date,
          revenue: parseFloat(metrics.revenue.toFixed(2)),
          cogs: parseFloat(metrics.cogs.toFixed(2)),
          profit: parseFloat(dayProfit.toFixed(2)),
          margin: parseFloat(dayMargin),
          orders: metrics.count,
          refunds: parseFloat(metrics.refunds.toFixed(2)),
          discounts: parseFloat(metrics.discounts.toFixed(2)),
          shippingCost: parseFloat(metrics.shippingCost.toFixed(2)),
        };
      });

    // Calculate YoY (Year-over-Year) previous period
    const currentStart = parseDate(args.startDate);
    const currentEnd = parseDate(args.endDate);
    const daysDiff =
      (currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24) +
      1;

    const yoyStartDate = new Date(currentStart);
    yoyStartDate.setFullYear(yoyStartDate.getFullYear() - 1);
    const yoyEndDate = new Date(currentEnd);
    yoyEndDate.setFullYear(yoyEndDate.getFullYear() - 1);

    const yoyOrders = allOrders.filter((order) => {
      const orderDate = parseDate(order.createdAt);
      return orderDate >= yoyStartDate && orderDate <= yoyEndDate;
    });

    let yoyRevenue = 0;
    let yoyCOGS = 0;
    yoyOrders.forEach((order) => {
      const orderRefunds = calculateTotalRefunds(order.refunds);
      const orderDiscounts = calculateTotalDiscounts(order.discounts);
      yoyRevenue += calculateNetRevenue(
        order.totals.total,
        orderRefunds,
        orderDiscounts
      );
      yoyCOGS += calculateOrderCOGS(order.items || []);
    });

    const yoyProfit = yoyRevenue - yoyCOGS;
    const yoyDelta =
      ((totalProfit - yoyProfit) / Math.max(yoyProfit, 0.01)) * 100;

    // Calculate MoM (Month-over-Month) previous period
    const momStartDate = new Date(currentStart);
    momStartDate.setMonth(momStartDate.getMonth() - 1);
    const momEndDate = new Date(currentEnd);
    momEndDate.setMonth(momEndDate.getMonth() - 1);

    const momOrders = allOrders.filter((order) => {
      const orderDate = parseDate(order.createdAt);
      return orderDate >= momStartDate && orderDate <= momEndDate;
    });

    let momRevenue = 0;
    let momCOGS = 0;
    momOrders.forEach((order) => {
      const orderRefunds = calculateTotalRefunds(order.refunds);
      const orderDiscounts = calculateTotalDiscounts(order.discounts);
      momRevenue += calculateNetRevenue(
        order.totals.total,
        orderRefunds,
        orderDiscounts
      );
      momCOGS += calculateOrderCOGS(order.items || []);
    });

    const momProfit = momRevenue - momCOGS;
    const momDelta =
      ((totalProfit - momProfit) / Math.max(momProfit, 0.01)) * 100;

    // Gross margin trend (compare first half vs second half of period)
    const midpoint = new Date(currentStart);
    midpoint.setDate(midpoint.getDate() + Math.floor(daysDiff / 2));

    const firstHalfOrders = filteredOrders.filter((order) => {
      const orderDate = parseDate(order.createdAt);
      return orderDate < midpoint;
    });

    const secondHalfOrders = filteredOrders.filter((order) => {
      const orderDate = parseDate(order.createdAt);
      return orderDate >= midpoint;
    });

    let firstHalfRevenue = 0,
      firstHalfCOGS = 0;
    let secondHalfRevenue = 0,
      secondHalfCOGS = 0;

    firstHalfOrders.forEach((order) => {
      const refunds = calculateTotalRefunds(order.refunds);
      const discounts = calculateTotalDiscounts(order.discounts);
      firstHalfRevenue += calculateNetRevenue(
        order.totals.total,
        refunds,
        discounts
      );
      firstHalfCOGS += calculateOrderCOGS(order.items || []);
    });

    secondHalfOrders.forEach((order) => {
      const refunds = calculateTotalRefunds(order.refunds);
      const discounts = calculateTotalDiscounts(order.discounts);
      secondHalfRevenue += calculateNetRevenue(
        order.totals.total,
        refunds,
        discounts
      );
      secondHalfCOGS += calculateOrderCOGS(order.items || []);
    });

    const firstHalfMargin =
      firstHalfRevenue > 0
        ? (
            ((firstHalfRevenue - firstHalfCOGS) / firstHalfRevenue) *
            100
          ).toFixed(2)
        : '0.00';
    const secondHalfMargin =
      secondHalfRevenue > 0
        ? (
            ((secondHalfRevenue - secondHalfCOGS) / secondHalfRevenue) *
            100
          ).toFixed(2)
        : '0.00';

    const marginTrend =
      parseFloat(secondHalfMargin) >= parseFloat(firstHalfMargin)
        ? 'up'
        : 'down';
    const marginDelta = (
      parseFloat(secondHalfMargin) - parseFloat(firstHalfMargin)
    ).toFixed(2);

    return {
      summary: {
        totalOrders: filteredOrders.length,
        deliveredOrders,
        grossRevenue: parseFloat(totalGrossRevenue.toFixed(2)),
        netRevenue: parseFloat(totalNetRevenue.toFixed(2)),
        totalRefunds: parseFloat(totalRefunds.toFixed(2)),
        totalDiscounts: parseFloat(totalDiscounts.toFixed(2)),
        totalCOGS: parseFloat(totalCOGS.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        grossMargin: parseFloat(grossMargin),
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        deliveryRate:
          filteredOrders.length > 0
            ? ((deliveredOrders / filteredOrders.length) * 100).toFixed(2)
            : '0.00',
      },
      timeSeries,
      comparison: {
        yoY: {
          previousProfit: parseFloat(yoyProfit.toFixed(2)),
          currentProfit: parseFloat(totalProfit.toFixed(2)),
          delta: parseFloat(yoyDelta.toFixed(2)),
          direction: yoyDelta >= 0 ? 'up' : 'down',
        },
        moM: {
          previousProfit: parseFloat(momProfit.toFixed(2)),
          currentProfit: parseFloat(totalProfit.toFixed(2)),
          delta: parseFloat(momDelta.toFixed(2)),
          direction: momDelta >= 0 ? 'up' : 'down',
        },
        marginTrend: {
          firstHalfMargin: parseFloat(firstHalfMargin),
          secondHalfMargin: parseFloat(secondHalfMargin),
          direction: marginTrend,
          delta: parseFloat(marginDelta),
        },
      },
    };
  },
});

/**
 * Get high-level KPI summary for dashboard
 */
export const getDashboardKPIs = query({
  args: {
    daysBack: v.number(), // Number of days to look back (default 30)
  },
  handler: async (ctx, args): Promise<DashboardKPI> => {
    const endDate = new Date();
    const startDate = new Date(
      Date.now() - args.daysBack * 24 * 60 * 60 * 1000
    );

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    // Use getFinancialMetrics under the hood
    const metricsResult = await ctx.runQuery(
      api.analytics.getFinancialMetrics,
      {
        startDate: startStr,
        endDate: endStr,
      }
    );

    const metrics = metricsResult as {
      summary: {
        netRevenue: number;
        grossMargin: number;
        totalProfit: number;
        avgOrderValue: number;
      };
      comparison: {
        moM: { delta: number; direction: string };
        marginTrend: { delta: number; direction: string };
      };
    };

    const result: DashboardKPI = {
      period: `Last ${args.daysBack} days`,
      kpis: [
        {
          label: 'Total Revenue',
          value: `₦${metrics.summary.netRevenue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          change:
            metrics.comparison.moM.delta >= 0
              ? `+${metrics.comparison.moM.delta.toFixed(1)}%`
              : `${metrics.comparison.moM.delta.toFixed(1)}%`,
          trend: metrics.comparison.moM.direction,
        },
        {
          label: 'Gross Margin',
          value: `${metrics.summary.grossMargin.toFixed(1)}%`,
          change:
            metrics.comparison.marginTrend.delta >= 0
              ? `+${metrics.comparison.marginTrend.delta}%`
              : `${metrics.comparison.marginTrend.delta}%`,
          trend: metrics.comparison.marginTrend.direction,
        },
        {
          label: 'Total Profit',
          value: `₦${metrics.summary.totalProfit.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          change:
            metrics.comparison.moM.delta >= 0
              ? `+${metrics.comparison.moM.delta.toFixed(1)}%`
              : `${metrics.comparison.moM.delta.toFixed(1)}%`,
          trend: metrics.comparison.moM.direction,
        },
        {
          label: 'Avg Order Value',
          value: `₦${metrics.summary.avgOrderValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          change: '—',
          trend: 'neutral',
        },
      ],
    };

    return result;
  },
});
