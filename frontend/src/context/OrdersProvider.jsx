import { useCallback, useMemo, useState } from 'react'
import { OrdersContext } from './orders-context.js'

const STORAGE_KEY = 'wearify_orders'

function readStoredOrders() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function nextOrderNo() {
  const t = String(Date.now())
  const tail = t.slice(-5)
  const r = Math.floor(Math.random() * 10)
  return `GS-${tail}${r}`
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => readStoredOrders())

  const placeOrder = useCallback(
    ({ lines, subtotal, discount, total }) => {
      const id = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      const order = {
        id,
        orderNo: nextOrderNo(),
        placedAt: new Date().toISOString().slice(0, 10),
        status: 'Processing',
        total: Number(total),
        subtotal: Number(subtotal),
        discount: Number(discount),
        lines: lines.map((l) => ({ ...l })),
      }
      setOrders((prev) => {
        const next = [order, ...prev]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
      return order
    },
    [],
  )

  const value = useMemo(
    () => ({
      orders,
      placeOrder,
    }),
    [orders, placeOrder],
  )

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  )
}
