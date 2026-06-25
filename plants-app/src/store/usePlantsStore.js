import { create } from 'zustand'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage'
import { db, storage } from '../firebase'

const usePlantsStore = create((set, get) => ({
  plants: [],
  loading: true,
  error: null,
  unsubscribe: null,

  subscribe: () => {
    const q = query(collection(db, 'plants'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const plants = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        set({ plants, loading: false })
      },
      (error) => {
        console.error('Firestore error:', error)
        set({ error: error.message, loading: false })
      }
    )
    set({ unsubscribe: unsub })
    return unsub
  },

  unsubscribeAll: () => {
    const { unsubscribe } = get()
    if (unsubscribe) unsubscribe()
  },

  addPlant: async (data) => {
    const docRef = await addDoc(collection(db, 'plants'), {
      ...data,
      photos: data.photos || [],
      createdAt: serverTimestamp(),
    })
    return docRef.id
  },

  updatePlant: async (id, data) => {
    const docRef = doc(db, 'plants', id)
    await updateDoc(docRef, data)
  },

  deletePlant: async (id) => {
    const { plants } = get()
    const plant = plants.find(p => p.id === id)
    if (plant?.photos?.length) {
      for (const photo of plant.photos) {
        if (photo.storagePath) {
          try {
            await deleteObject(ref(storage, photo.storagePath))
          } catch (e) {
            console.warn('Could not delete photo:', e)
          }
        }
      }
    }
    await deleteDoc(doc(db, 'plants', id))
  },

  uploadPhoto: async (plantId, file, date) => {
    const timestamp = Date.now()
    const storagePath = `plants/${plantId}/${timestamp}_${file.name}`
    const storageRef = ref(storage, storagePath)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return { url, date: date || new Date().toISOString().split('T')[0], storagePath }
  },

  deletePhoto: async (plantId, photo) => {
    if (photo.storagePath) {
      try {
        await deleteObject(ref(storage, photo.storagePath))
      } catch (e) {
        console.warn('Could not delete photo from storage:', e)
      }
    }
    const { plants } = get()
    const plant = plants.find(p => p.id === plantId)
    if (plant) {
      const newPhotos = plant.photos.filter(p => p.storagePath !== photo.storagePath)
      await updateDoc(doc(db, 'plants', plantId), { photos: newPhotos })
    }
  },
}))

export default usePlantsStore
