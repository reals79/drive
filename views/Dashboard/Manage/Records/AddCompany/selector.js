import { VENDOR_CATEGORIES } from '~/services/constants'

export const getVendorCategories = state => {
  // Iterate Predefind Categories for keeping orders.
  const activeCtgs = VENDOR_CATEGORIES.map(pCat => {
    const ctg = state.vendor.categories.all.find(cat => pCat.name === cat.name)
    if (ctg) return { ...pCat, ...ctg }
    return false
  }).filter(Boolean)

  return activeCtgs
}
