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
