import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PlantDetail from './pages/PlantDetail'
import PlantForm from './pages/PlantForm'
import Stats from './pages/Stats'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plant/:id" element={<PlantDetail />} />
        <Route path="/add" element={<PlantForm />} />
        <Route path="/plant/:id/edit" element={<PlantForm />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  )
}
