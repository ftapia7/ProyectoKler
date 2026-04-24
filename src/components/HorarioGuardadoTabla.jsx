import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table.tsx'

//Dias que se muestran como columnas
const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
//Horas del día que se muestran como filas
const hourSlots = Array.from({ length: 16 }, (_, index) => 7 + index)

//Convierte a formato 12h
const formatHourLabel = (hour) => {
  if (hour === 12) {
    return '12:00 p.m'
  }

  if (hour > 12) {
    return `${hour - 12}:00 p.m`
  }

  return `${hour}:00 a.m`
}

const parseTimeToMinutes = (value) => {
  const normalizedValue = value.trim().toLowerCase().replace(/\./g, '')
  const [time, period] = normalizedValue.split(' ')
  const [rawHour, rawMinute] = time.split(':').map(Number)
  let hour = rawHour

  if (period === 'pm' && hour !== 12) {
    hour += 12
  }

  if (period === 'am' && hour === 12) {
    hour = 0
  }

  return hour * 60 + rawMinute
}

const parseRange = (range) => {
  const [start, end] = range.split('-').map((item) => item.trim())

  return {
    start: parseTimeToMinutes(start),
    end: parseTimeToMinutes(end),
  }
}

//Funcion para mostrar el horario tipo calendario
function HorarioGuardadoTabla({ schedules, hourLabel = 'Hora' }) {
  //Convierte materias en eventos con duración
  const events = schedules.map((schedule) => {
    const { start, end } = parseRange(schedule.time)

    return {
      ...schedule,
      start,
      end,
      duration: Math.max(1, Math.ceil((end - start) / 60)), //duracion en bloques de minimo 1h
    }
  })

  //Busca si hay eventos que inicien a una hora y día específico
  const getEventStartingAt = (day, hour) => {
    const slotStart = hour * 60

    return events.find((event) => event.day === day && event.start === slotStart)
  }

  //Verifica si una celda ya tiene otro event, para evitar duplicar
  const isCoveredByPreviousEvent = (day, hour) => {
    const slotStart = hour * 60

    return events.some(
      (event) => event.day === day && event.start < slotStart && event.end > slotStart
    )
  }

  return ( 
    <Table className="saved-schedule-table">
      <colgroup>
        <col className="saved-schedule-table__hour-col" />
        {days.map((day) => (
          <col key={day} className="saved-schedule-table__day-col" />
        ))}
      </colgroup>

      <TableHeader>
        <TableRow>
          <TableHead className="saved-schedule-table__hour-head">{hourLabel}</TableHead>
          {days.map((day) => (
            <TableHead key={day}>{day}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {hourSlots.map((hour) => (
          <TableRow key={hour}>
            <TableCell className="saved-schedule-table__hour">
              {formatHourLabel(hour)}
            </TableCell>

            {days.map((day) => {
              const startingEvent = getEventStartingAt(day, hour)

              if (startingEvent) {
                return (
                  <TableCell
                    key={`${day}-${hour}`}
                    rowSpan={startingEvent.duration}
                    className="saved-schedule-table__course-cell"
                  >
                    <div className="saved-schedule-table__course">
                      <strong>{startingEvent.code}</strong>
                      <span>{startingEvent.name}</span>
                      <span>{startingEvent.time}</span>
                      <span>{startingEvent.mode}</span>
                      <span>{startingEvent.classroom}</span>
                    </div>
                  </TableCell>
                )
              }

              // Si la celda está llena por otro evento, no la cubre
              if (isCoveredByPreviousEvent(day, hour)) {
                return null
              }

              return (
                <TableCell
                  key={`${day}-${hour}`}
                  className="saved-schedule-table__empty-cell"
                ></TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default HorarioGuardadoTabla