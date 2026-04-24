import { useEffect, useMemo, useState } from 'react'
import HorarioGuardadoTabla from '../components/HorarioGuardadoTabla.jsx'
import HorarioTabla from '../components/HorarioTabla.jsx'
import flechaIcon from '../assets/flecha.png'

function Horarios({ isEditModeEnabled = false, onConfirmSchedule }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSubjectId, setExpandedSubjectId] = useState('')
  const [selectedSchedules, setSelectedSchedules] = useState({})
  const [statusMessage, setStatusMessage] = useState(
    'Haz clic en una materia y selecciona el horario que deseas guardar.'
  )

  // Estado para materias ofertadas
  const [materias, setMaterias] = useState([])

  // Estado para materias ya matriculadas
  const [misMaterias, setMisMaterias] = useState([])

  // Carga materias ofertadas
  useEffect(() => {
    fetch("http://localhost:4000/api/materias")
      .then(res => res.json())
      .then(data => setMaterias(data))
      .catch(err => console.error(err));
  }, []);

  // Carga materias matriculadas
  useEffect(() => {
    fetch("http://localhost:4000/api/mis-materias")
      .then(res => res.json())
      .then(data => setMisMaterias(data))
      .catch(err => console.error(err));
  }, []);

  // Bloquea edición SOLO si ya se matriculó y no está en modo edición
  const hasConfirmedEnrollment = misMaterias.length > 0
  const isEnrollmentLocked = hasConfirmedEnrollment && !isEditModeEnabled

  // Agrupa materias por nombre
  const groupedSubjects = useMemo(() => {
    const map = {};
    materias.forEach(m => {
      if (!map[m.mat_nombre]) {
        map[m.mat_nombre] = {
          id: m.mat_nombre,
          code: m.codigo,
          name: m.mat_nombre,
          groups: []
        };
      }
      map[m.mat_nombre].groups.push({
        id: m.id_grupo,
        day: m.dia_sem,
        mode: m.modalidad,
        time: `${m.hora_inicio} - ${m.hora_fin}`,
        professor: m.prof_nombre,
        spots: m.cupo_disp,
        classroom: m.aula
      });
    });
    return Object.values(map);
  }, [materias]);

// Filtra materias según la búsqueda
  const filteredSubjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    if (!normalizedSearch) return groupedSubjects

    return groupedSubjects.filter((subject) => {
      const fullName = `${subject.code} ${subject.name}`.toLowerCase()
      return fullName.includes(normalizedSearch)
    })
  }, [searchTerm, groupedSubjects])

  //Obtiene las materias seleccionadas
  const selectedRows = groupedSubjects.flatMap((subject) => {
    const selectedScheduleId = selectedSchedules[subject.id]
    const selectedSchedule = subject.groups.find(
      (group) => group.id === selectedScheduleId
    )

    if (!selectedSchedule) return []

    return [
      {
        subjectId: subject.id,
        code: subject.code,
        name: subject.name,
        ...selectedSchedule,
      },
    ]
  })

// Para manejar horarios y conflictos 
  const parseTimeToMinutes = (value) => {
    const normalizedValue = value.trim().toLowerCase().replace(/\./g, '')
    const [time, period] = normalizedValue.split(' ')
    const [rawHour, rawMinute] = time.split(':').map(Number)
    let hour = rawHour

    if (period === 'pm' && hour !== 12) hour += 12
    if (period === 'am' && hour === 12) hour = 0

    return hour * 60 + rawMinute
  }

  const parseRange = (range) => {
    const [start, end] = range.split('-').map((item) => item.trim())
    return { start: parseTimeToMinutes(start), end: parseTimeToMinutes(end) }
  }

// Para ver si dos horarios chocan entre sí
  const hasScheduleConflict = (firstGroup, secondGroup) => {
    if (firstGroup.day !== secondGroup.day) return false
    const firstRange = parseRange(firstGroup.time)
    const secondRange = parseRange(secondGroup.time)
    return firstRange.start < secondRange.end && secondRange.start < firstRange.end
  }

  //Revisa si un horario debe estar deshabilitado
  const isScheduleDisabled = (subjectId, group) => {
    if (group.spots === 0) return true // Evita seleccionar sin cupo
    return selectedRows.some(
      (selectedRow) =>
        selectedRow.subjectId !== subjectId && hasScheduleConflict(selectedRow, group)
    )
  }

//Seleccionar o deseleccionar horarios
  const handleToggleSchedule = (subject, groupToToggle) => {
    if (isEnrollmentLocked) return

    const isSelected = selectedSchedules[subject.id] === groupToToggle.id

    if (isSelected) {
      setSelectedSchedules((currentSelection) => {
        const nextSelection = { ...currentSelection }
        delete nextSelection[subject.id]
        return nextSelection
      })
      setStatusMessage(`${subject.code} fue eliminada de tu horario guardado.`)
      return
    }

    if (groupToToggle.spots === 0) {
      setStatusMessage(`No hay cupo disponible para ${subject.code}.`)
      return
    }

    if (isScheduleDisabled(subject.id, groupToToggle)) {
      setStatusMessage(
        `El horario de ${subject.code} choca con otra materia ya seleccionada.`
      )
      return
    }

    setSelectedSchedules((currentSelection) => ({
      ...currentSelection,
      [subject.id]: groupToToggle.id,
    }))
    setStatusMessage(
      `${subject.code} fue agregada a tu horario en ${groupToToggle.day} de ${groupToToggle.time}.`
    )
  }

  // Confirma el horario seleccionado
  const handleConfirmSchedule = async () => {
  const selectedCount = selectedRows.length;
  if (selectedCount === 0) {
    setStatusMessage('Debes seleccionar al menos una materia antes de confirmar.');
    return;
  }

  // Array de id_grupo
  const gruposSeleccionados = selectedRows.map(row => row.id);
  // Envía id_grupo al backend para confirmar matrícula
  try {
    const res = await fetch("http://localhost:4000/api/confirmar-matricula", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grupos: gruposSeleccionados })
    });

    const data = await res.json();
    console.log("Respuesta del backend:", data);

    onConfirmSchedule(selectedRows);
    setStatusMessage(
      `Tu horario con ${selectedCount} materia${selectedCount > 1 ? 's' : ''} fue confirmado.`
    );
  } catch (err) {
    console.error("Error al confirmar matrícula:", err);
    setStatusMessage("Error al confirmar matrícula.");
  }
};

//UI: Encabzado, buscador, lista de materias, panel de selección y tabla de horario guardado
  return (
    <section className="enrollment-page">
      <div className="page-header">
        <h1>Matricula de horario</h1>
        <p>
          Revisa las materias ofertadas, valida el cupo disponible y marca las
          opciones que deseas matricular.
        </p>
      </div>

      <div className="term-label">Cuatrimestre VIII</div>

      {isEnrollmentLocked ? (
        <p className="enrollment-page__notice">
          Ya matriculaste para este cuatrimestre.
        </p>
      ) : null}

      {hasConfirmedEnrollment && isEditModeEnabled ? (
        <p className="enrollment-page__edit-notice">
          Modo edición activo. Ajusta tu horario y confirma los cambios.
        </p>
      ) : null}

      <label className="search-box" htmlFor="subject-search">
        <span className="search-icon" aria-hidden="true"></span>
        <input
          id="subject-search"
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Ingresa el código o nombre de la materia"
        />
      </label>

      <div className="selection-banner">
        <span>{Object.keys(selectedSchedules).length} materias en tu horario</span>
        <span>{statusMessage}</span>
      </div>

      <div className="subject-list">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => {
            const isExpanded = expandedSubjectId === subject.id
            return (
              <article
                key={subject.id}
                className={`subject-card ${
                  isEnrollmentLocked ? 'subject-card--disabled' : ''
                }`}
              >
                <button
                  type="button"
                  className="subject-card__header"
                  disabled={isEnrollmentLocked}
                  onClick={() =>
                    setExpandedSubjectId((currentId) =>
                      currentId === subject.id ? '' : subject.id
                    )
                  }
                >
                  <span>
                    {subject.code} {subject.name}
                  </span>
                  <img
                    src={flechaIcon}
                    className={`subject-card__arrow ${
                      isExpanded ? 'subject-card__arrow--open' : ''
                    }`}
                    alt=""
                    aria-hidden="true"
                  />
                </button>

                {isExpanded ? (
                  <div className="subject-card__content">
                    <HorarioTabla
                      groups={subject.groups}
                      selectedScheduleId={selectedSchedules[subject.id]}
                      onToggleSchedule={(group) => handleToggleSchedule(subject, group)}
                      isEnrollmentLocked={isEnrollmentLocked}
                      isScheduleDisabled={(group) =>
                        isScheduleDisabled(subject.id, group)
                      }
                    />
                  </div>
                ) : null}
              </article>
            )
          })
        ) : (
          <div className="empty-results">
            No se encontraron materias para la búsqueda actual.
          </div>
        )}
      </div>

      {!isEnrollmentLocked ? (
        <section className="selected-panel">
          <h2>
            {hasConfirmedEnrollment && isEditModeEnabled
              ? 'Horario en edición'
              : 'Horario guardado'}
          </h2>
          {selectedRows.length > 0 ? (
            <>
              <HorarioGuardadoTabla schedules={selectedRows} />
              <div className="selected-panel__actions">
                <button
                  type="button"
                  className="selected-panel__confirm-button"
                  onClick={handleConfirmSchedule}
                >
                  {hasConfirmedEnrollment && isEditModeEnabled
                    ? 'Confirmar cambios'
                    : 'Confirmar horario'}
                </button>
              </div>
            </>
          ) : (
            <p className="selected-panel__empty">
              Aún no has guardado materias en tu horario.
            </p>
          )}
        </section>
      ) : null}
    </section>
  )
}

export default Horarios
