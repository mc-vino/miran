import { useEffect } from 'react'
import usePlantsStore from '../store/usePlantsStore'

export function usePlants() {
  const {
    plants, loading, error,
    subscribe, unsubscribeAll,
    addPlant, updatePlant, deletePlant,
    uploadPhoto, deletePhoto
  } = usePlantsStore()

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub()
  }, [])

  return {
    plants, loading, error,
    addPlant, updatePlant, deletePlant,
    uploadPhoto, deletePhoto
  }
}
