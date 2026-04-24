function HorarioTabla({
  groups, //Grupos disponibles
  selectedScheduleId, //Id del grupo seleccionado
  onToggleSchedule, //Seleccionar/deseleccionar
  isScheduleDisabled, //Si el grupo está deshabilitado
  isEnrollmentLocked = false, //Si la matrícula está bloqueada
}) {
  return (
    <table className="subject-table">
      <thead>
        <tr>
          <th>Dia</th>
          <th>Modalidad</th>
          <th>Horario</th>
          <th>Clase</th>
          <th>Profesor</th>
          <th>Cupo</th>
          <th>Seleccionar</th>
        </tr>
      </thead>
      <tbody>
        {groups.map(group => ( //Recorre cada grupo y muestra su info en una fila
          <tr key={group.id} data-state={selectedScheduleId === group.id ? 'selected' : undefined}>
            <td>{group.day}</td>
            <td>{group.mode}</td>
            <td>{group.time}</td>
            <td>{group.classroom}</td>
            <td>{group.professor}</td>
            <td>{group.spots}</td>
            <td>
              <button
                type="button"
                className={`subject-table__button ${selectedScheduleId === group.id ? 'subject-table__button--active' : ''}`}
                
                onClick={() => onToggleSchedule(group)}
                disabled={ //Deshabilita el botón si la matrícula está bloqueada o si el grupo no está disponible
                  isEnrollmentLocked ||
                  (isScheduleDisabled(group) && selectedScheduleId !== group.id)
                }
              >
                {isEnrollmentLocked // Si la matricula está bloqueada
                  ? selectedScheduleId === group.id
                    ? 'Matriculada'
                    : 'Deshabilitada'
                  : selectedScheduleId === group.id // Si no está bloqueada
                    ? 'Quitar'
                    : isScheduleDisabled(group)
                      ? 'No disponible'
                      : 'Seleccionar'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default HorarioTabla
