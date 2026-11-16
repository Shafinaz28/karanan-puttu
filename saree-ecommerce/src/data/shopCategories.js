/** Shared shop collection labels + category card imagery (public/categories). */
export const shopCategoryCards = [
  {
    id: "soft",
    label: "Silk collection",
    note: "Elegant & rich",
    image: "/categories/category-silk.avif",
    alt: "Silk sarees in rich colours with gold zari borders",
  },
  {
    id: "tissue",
    label: "Tissue Sarees",
    note: "Light & graceful",
    image: "/categories/category-tissue.avif",
    alt: "Handwoven tissue silk sarees in soft tones",
  },
  {
    id: "party",
    label: "Party Wear",
    note: "For special moments",
    image: "/categories/category-party.avif",
    alt: "Vibrant party-wear silk sarees on display",
  },
  {
    id: "traditional",
    label: "Traditional",
    note: "Heritage & craft",
    image: "/categories/category-traditional.avif",
    alt: "Traditional Kanchipuram silk with intricate zari",
  },
]

export const shopFilterCategories = [
  { id: "", label: "View all" },
  ...shopCategoryCards.map(({ id, label }) => ({
    id,
    label: id === "soft" ? "Silk collection" : id === "tissue" ? "Tissue" : id === "party" ? "Party wear" : "Traditional wear",
  })),
]

export const shopOccasions = [
  { id: "wedding", label: "Wedding" },
  { id: "party", label: "Party" },
  { id: "festivals", label: "Festivals" },
]

const categoryLabels = [
  [/^(silk collection|soft silk|soft|silk)$/i, "soft"],
  [/^(tissue|tissue sarees|tissue collection)$/i, "tissue"],
  [/^(party wear|party)$/i, "party"],
  [/^(traditional wear|traditional)$/i, "traditional"],
]

/** Map a saved category name onto one of the four shop categories. */
export function categoryIdFromText(value) {
  const text = String(value || "").trim()
  if (!text) return ""
  for (const [pattern, id] of categoryLabels) {
    if (pattern.test(text)) return id
  }
  return ""
}

export function categoryLabel(id) {
  return shopFilterCategories.find((item) => item.id === id)?.label || "Silk collection"
}
