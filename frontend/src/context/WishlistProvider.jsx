import { useCallback, useMemo, useState } from 'react'
import { WishlistContext } from './wishlist-context.js'

const STORAGE_KEY = 'wearify_wishlist'

function readStoredItems() {
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

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => readStoredItems())

  const persist = useCallback((next) => {
    setItems(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const isInWishlist = useCallback(
    (productId) => items.some((i) => i.productId === String(productId)),
    [items],
  )

  const addItem = useCallback(
    (payload) => {
      const productId = String(payload.productId)
      setItems((prev) => {
        if (prev.some((i) => i.productId === productId)) return prev
        const next = [
          {
            productId,
            name: payload.name,
            image: payload.image,
            price: Number(payload.price),
            stock:
              payload.stock != null ? Number(payload.stock) : undefined,
            sold: payload.sold != null ? Number(payload.sold) : undefined,
          },
          ...prev,
        ]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [],
  )

  const removeItem = useCallback((productId) => {
    const id = String(productId)
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const toggleItem = useCallback(
    (payload) => {
      const productId = String(payload.productId)
      setItems((prev) => {
        const exists = prev.some((i) => i.productId === productId)
        let next
        if (exists) {
          next = prev.filter((i) => i.productId !== productId)
        } else {
          next = [
            {
              productId,
              name: payload.name,
              image: payload.image,
              price: Number(payload.price),
              stock:
                payload.stock != null ? Number(payload.stock) : undefined,
              sold: payload.sold != null ? Number(payload.sold) : undefined,
            },
            ...prev,
          ]
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [],
  )

  const count = useMemo(() => items.length, [items])

  const value = useMemo(
    () => ({
      items,
      count,
      isInWishlist,
      addItem,
      removeItem,
      toggleItem,
      clearWishlist: () => persist([]),
    }),
    [items, count, isInWishlist, addItem, removeItem, toggleItem, persist],
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}
