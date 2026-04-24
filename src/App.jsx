import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Horarios from './pages/Horarios.jsx'
import MiHorario from './pages/MiHorario.jsx'

const CONFIRMED_SCHEDULES_STORAGE_KEY = 'confirmed-student-schedule'
const SCHEDULE_EDIT_MODE_STORAGE_KEY = 'student-schedule-edit-mode'

function App() {

  // controla qué pagina se muestra
  const [currentPage, setCurrentPage] = useState('home')
  //estado con materias confirmadas
  const [confirmedSchedules, setConfirmedSchedules] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try { 
      //obtiene datos guardados
      const storedSchedules = window.localStorage.getItem(
        CONFIRMED_SCHEDULES_STORAGE_KEY
      )

      //array vacio si no hay nada guardado
      if (!storedSchedules) {
        return []
      }

      const parsedSchedules = JSON.parse(storedSchedules)
      //verifica que el array sea válido
      return Array.isArray(parsedSchedules) ? parsedSchedules : []
    } catch {
      return []
    }
  })

  //Para saber si está en modo edición
  const [isScheduleEditMode, setIsScheduleEditMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      return window.localStorage.getItem(SCHEDULE_EDIT_MODE_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    //guarda materias en localStorage cuando cambian
    window.localStorage.setItem(
      CONFIRMED_SCHEDULES_STORAGE_KEY,
      JSON.stringify(confirmedSchedules)
    )
  }, [confirmedSchedules])

  useEffect(() => {
    window.localStorage.setItem(
      SCHEDULE_EDIT_MODE_STORAGE_KEY,
      String(isScheduleEditMode)
    )
  }, [isScheduleEditMode])

  //guarda horarios confirmados y sale del modo edición
  const handleConfirmSchedules = (schedules) => {
    setConfirmedSchedules(schedules)
    setIsScheduleEditMode(false)
    setCurrentPage('mi-horario')
  }

  //activa modo edicion
  const handleEnableScheduleEditing = () => {
    setIsScheduleEditMode(true)
    setCurrentPage('horarios')
  }

  const renderPage = () => {
    //pestaña de seleccion de horarios
    if (currentPage === 'horarios') {
      return (
        <Horarios
          initialConfirmedSchedules={confirmedSchedules}
          isEditModeEnabled={isScheduleEditMode}
          onConfirmSchedule={handleConfirmSchedules}
        />
      )
    }
    //pestaña de horario final
    if (currentPage === 'mi-horario') {
      return (
        <MiHorario
          schedules={confirmedSchedules}
          isEditModeEnabled={isScheduleEditMode}
          onEditSchedule={handleEnableScheduleEditing}
        />
      )
    }
    //pestaña home
    return <Home onNavigate={setCurrentPage} />
  }

  return ( // UI: Navbar y contenido de la página actual
    <div className="app-shell">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="main-content">{renderPage()}</main>
    </div>
  )
}

export default App
