import { useCallback, useMemo, useState } from 'react'
import { CartContext } from './cart-context.js'

const STORAGE_KEY = 'wearify_cart'

function readStoredLines() {
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

function lineKey(productId, size, colorId) {
  return `${productId}::${size}::${colorId}`
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => readStoredLines())

  const persist = useCallback((next) => {
    setLines(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addItem = useCallback(
    (item) => {
      const {
        productId,
        name,
        image,
        price,
        quantity = 1,
        size,
        colorId,
        colorLabel,
      } = item
      const key = lineKey(productId, size, colorId)
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.lineKey === key)
        let next
        if (idx >= 0) {
          next = prev.map((l, i) =>
            i === idx ? { ...l, quantity: l.quantity + quantity } : l,
          )
        } else {
          next = [
            ...prev,
            {
              lineKey: key,
              productId: String(productId),
              name,
              image,
              price: Number(price),
              quantity,
              size: String(size),
              colorId: String(colorId),
              colorLabel: colorLabel || '',
            },
          ]
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [],
  )

  const setLineQuantity = useCallback((lineKeyStr, quantity) => {
    const q = Math.max(0, Math.floor(Number(quantity)))
    setLines((prev) => {
      let next
      if (q <= 0) {
        next = prev.filter((l) => l.lineKey !== lineKeyStr)
      } else {
        next = prev.map((l) =>
          l.lineKey === lineKeyStr ? { ...l, quantity: q } : l,
        )
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const incrementLine = useCallback((lineKeyStr, delta) => {
    setLines((prev) => {
      const next = prev
        .map((l) => {
          if (l.lineKey !== lineKeyStr) return l
          const q = l.quantity + delta
          return q <= 0 ? null : { ...l, quantity: q }
        })
        .filter(Boolean)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeLine = useCallback((lineKeyStr) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.lineKey !== lineKeyStr)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    persist([])
  }, [persist])

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  )

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines],
  )

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      addItem,
      setLineQuantity,
      incrementLine,
      removeLine,
      clearCart,
    }),
    [
      lines,
      itemCount,
      subtotal,
      addItem,
      setLineQuantity,
      incrementLine,
      removeLine,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
