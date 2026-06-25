export const PLANT_TYPES = [
  "Alocasia",
  "Philodendron",
  "Spathiphyllum",
  "Anthurium",
  "Hoya",
  "Monstera",
  "Caladium",
  "Syngonium",
  "Alpinia",
  "Carnivora",
  "Calathea",
  "Aglaonema",
  "Tacca",
  "Zamioculcas",
  "Pteridophyta"
]

export const detectTypeFromName = (name) => {
  if (!name) return ''
  const firstWord = name.trim().split(/\s+/)[0]
  const match = PLANT_TYPES.find(
    t => t.toLowerCase() === firstWord.toLowerCase()
  )
  return match || ''
}
