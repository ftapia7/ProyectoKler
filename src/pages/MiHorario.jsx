import { useEffect, useState } from 'react'
import HorarioGuardadoTabla from '../components/HorarioGuardadoTabla.jsx'

//Funcion para mostrar el horario final del estudiante
function MiHorario({ isEditModeEnabled, onEditSchedule }) {
  const [schedules, setSchedules] = useState([])

  // FETCH para obtener materias matriculadas y formatearlas para HorarioGuardadoTabla
  useEffect(() => {
  fetch("http://localhost:4000/api/mis-materias")
    .then(res => res.json())
    .then(data => {
      console.log("Datos crudos desde backend:", data)

      const formatTime = (hora) => {
        const [h, m] = hora.split(':').map(Number) //De 24h a 12h
        const period = h >= 12 ? 'p.m' : 'a.m' //Si es AM o PM
        const hour12 = h % 12 === 0 ? 12 : h % 12 //Convierte a formato 12h
        return `${hour12}:${m.toString().padStart(2,'0')} ${period}`
      }

      const formatTimeRange = (inicio, fin) => {
        return `${formatTime(inicio)} - ${formatTime(fin)}`
      }

      // Transforma los datos para que tengan el formato de la tabla
      const formatted = data.map(m => ({
        subjectId: m.id_grupo,
        code: m.codigo,
        name: m.mat_nombre,
        day: m.dia_sem,
        time: formatTimeRange(m.hora_inicio, m.hora_fin), 
        professor: m.prof_nombre,
        mode: m.modalidad,
        classroom: m.aula
      }))

      console.log("Datos formateados para HorarioGuardadoTabla:", formatted)
      setSchedules(formatted) //Guarda el horario ya formateado
    })
    .catch(err => console.error(err))
}, [])


  //Para ver si hay materias matriculadas
  const hasSchedules = schedules.length > 0

  //UI: Encabezado, botón de editar, aviso de modo edición, tabla de horario o mensaje de horario vacío
  return (
    <section className="final-schedule-page">
      <div className="final-schedule-page__topbar">
        <div className="page-header final-schedule-page__header">
          <h1>Horario</h1>
        </div>
        {hasSchedules && (
          <button
            type="button"
            className="final-schedule-page__edit-button"
            onClick={onEditSchedule}
          >
            Editar horario
          </button>
        )}
      </div>

      {hasSchedules && isEditModeEnabled && (
        <p className="final-schedule-page__notice">
          Modo edición activo. Puedes cambiar tu matrícula y confirmar de nuevo.
        </p>
      )}

      {hasSchedules ? (
        <div className="final-schedule-page__table-wrap">
          <HorarioGuardadoTabla schedules={schedules} hourLabel="Horario" />
        </div>
      ) : (
        <p className="final-schedule-page__empty">
          Aún no tienes materias confirmadas en tu horario final.
        </p>
      )}
    </section>
  )
}

export default MiHorario
