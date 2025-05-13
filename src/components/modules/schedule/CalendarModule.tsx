/*
import { useState, useMemo } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Search, Menu, X, CalendarPlus, Clock3 } from "lucide-react"
import { Calendar, dateFnsLocalizer, Event, SlotInfo } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, addMinutes, addDays, startOfMonth, endOfMonth, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { Input} from "../../shared/Input"
import { PrimaryButton } from "../../shared/PrimaryButton"
import { CrudModal } from "../../shared/Modal"
import { Field } from "../../../Interfaces/TypesData"
import { cn } from "../../shared/cn"
import "react-big-calendar/lib/css/react-big-calendar.css"

// Tipos de datos
type Client = {
  id: string
  name: string
}

type Pet = {
  id: string
  name: string
  species: string
  clientId: string
}

type AppointmentStatus = "Pendiente" | "Confirmada" | "Completada" | "Cancelada"

type Appointment = {
  id: string
  clientId: string
  petId: string
  date: string
  time: string
  reason: string
  notes: string
  status: AppointmentStatus
  duration: number
}

type CalendarEvent = Event & {
  id: string
  status: AppointmentStatus
  resource: Appointment
}

// Configuración del calendario
const locales = { es }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Datos de ejemplo
const mockClients: Client[] = [
  { id: "1", name: "Juan Pérez" },
  { id: "2", name: "María González" },
  { id: "3", name: "Carlos Rodríguez" },
  { id: "4", name: "Ana Martínez" },
  { id: "5", name: "Luis Sánchez" },
]

const mockPets: Pet[] = [
  { id: "1", name: "Max", species: "Perro", clientId: "1" },
  { id: "2", name: "Luna", species: "Gato", clientId: "2" },
  { id: "3", name: "Rocky", species: "Perro", clientId: "3" },
  { id: "4", name: "Coco", species: "Ave", clientId: "4" },
  { id: "5", name: "Nala", species: "Gato", clientId: "5" },
]

const today = new Date()
const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientId: "1",
    petId: "1",
    date: format(today, "yyyy-MM-dd"),
    time: "09:00",
    reason: "Vacunación anual",
    notes: "Primera dosis",
    status: "Confirmada",
    duration: 30,
  },
  // ... otros appointments
]

// Campos del formulario
const appointmentFields: Field[] = [
  {
    name: "clientId",
    label: "Cliente",
    type: "select",
    required: true,
    options: mockClients.map(c => ({ label: c.name, value: c.id }))
  },
  {
    name: "petId",
    label: "Mascota",
    type: "select",
    required: true,
    options: [], // Se llena dinámicamente
    //dependency: "clientId"
  },
  { name: "date", label: "Fecha", type: "date", required: true },
  { name: "time", label: "Hora", type: "time", required: true },
  { name: "reason", label: "Motivo", type: "text", required: true },
  { name: "notes", label: "Notas", type: "textarea", required: false },
  {
    name: "status",
    label: "Estado",
    type: "select",
    required: true,
    options: [
      { label: "Pendiente", value: "Pendiente" },
      { label: "Confirmada", value: "Confirmada" },
      { label: "Completada", value: "Completada" },
      { label: "Cancelada", value: "Cancelada" }
    ]
  },
  {
    name: "duration",
    label: "Duración (min)",
    type: "select",
    required: true,
    options: [
      { label: "15 minutos", value: "15" },
      { label: "30 minutos", value: "30" },
      { label: "45 minutos", value: "45" },
      { label: "60 minutos", value: "60" },
      { label: "90 minutos", value: "90" },
      { label: "120 minutos", value: "120" }
    ]
  }
]

export default function CalendarModule() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [calendarView, setCalendarView] = useState<CalendarView>("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Convertir citas a eventos del calendario
  const events = useMemo(() => {
    return mockAppointments.map(appointment => {
      const startDate = new Date(`${appointment.date}T${appointment.time}`)
      const endDate = addMinutes(startDate, appointment.duration)
      const client = mockClients.find(c => c.id === appointment.clientId)
      const pet = mockPets.find(p => p.id === appointment.petId)

      return {
        id: appointment.id,
        title: `${client?.name || 'Cliente'} - ${pet?.name || 'Mascota'} (${appointment.reason})`,
        start: startDate,
        end: endDate,
        status: appointment.status,
        resource: appointment
      }
    })
  }, [])

  // Filtrar eventos basados en búsqueda
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events
    const query = searchQuery.toLowerCase()
    return events.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.resource.notes?.toLowerCase().includes(query)
    )
  }, [events, searchQuery])

  // Manejar selección de cita
  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedAppointment(event.resource)
    setIsModalOpen(true)
  }

  // Manejar selección de slot en calendario
  const handleCalendarSelect = ({ start }: SlotInfo) => {
    setSelectedAppointment({
      id: '',
      clientId: '',
      petId: '',
      date: format(start, 'yyyy-MM-dd'),
      time: format(start, 'HH:mm'),
      reason: '',
      notes: '',
      status: 'Pendiente',
      duration: 30
    })
    setIsModalOpen(true)
  }

  // Obtener mascotas por cliente
  const getPetsByClient = (clientId: string) => {
    return mockPets
      .filter(pet => pet.clientId === clientId)
      .map(pet => ({ label: `${pet.name} (${pet.species})`, value: pet.id }))
  }

  // Manejar envío del formulario
  const handleSubmit = (data: any) => {
    console.log("Appointment data:", data)
    setIsModalOpen(false)
  }

  // Componente de toolbar personalizado
  const CustomToolbar = (toolbar: any) => {
    return (
      <div className="flex justify-between items-center mb-2 px-4 py-2 bg-white border-b">
        <div className="flex items-center space-x-2">
          <PrimaryButton variant="outline" size="sm" onClick={() => toolbar.onNavigate("PREV")}>
            <ChevronLeft className="h-4 w-4" />
          </PrimaryButton>
          <PrimaryButton variant="outline" size="sm" onClick={() => toolbar.onNavigate("TODAY")}>
            Hoy
          </PrimaryButton>
          <PrimaryButton variant="outline" size="sm" onClick={() => toolbar.onNavigate("NEXT")}>
            <ChevronRight className="h-4 w-4" />
          </PrimaryButton>
          <span className="text-lg font-semibold ml-2">
            {format(toolbar.date, "MMMM yyyy", { locale: es })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {["month", "week", "day", "agenda"].map(view => (
            <PrimaryButton
              key={view}
              variant={calendarView === view ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCalendarView(view as CalendarView)
                toolbar.onView(view)
              }}
              className={calendarView === view ? "bg-turquoise-600 hover:bg-turquoise-700" : ""}
            >
              {view === "month" ? "Mes" : view === "week" ? "Semana" : view === "day" ? "Día" : "Agenda"}
            </PrimaryButton>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {}
      <div className={cn(
        "bg-gray-50 border-r transition-all duration-300 overflow-hidden",
        isSidebarOpen ? "w-64" : "w-0"
      )}>
        {}
      </div>

      {}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b flex justify-between items-center bg-white">
          <div className="flex items-center">
            {!isSidebarOpen && (
              <PrimaryButton variant="ghost" size="sm" className="mr-2" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </PrimaryButton>
            )}
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar citas..."
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <PrimaryButton onClick={() => setIsModalOpen(true)} className="bg-turquoise-600 hover:bg-turquoise-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Nueva Cita
          </PrimaryButton>
        </div>

        {}
        <div className="flex-1 overflow-auto">
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "calc(100vh - 180px)" }}
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            view={calendarView}
            onView={setCalendarView}
            date={currentDate}
            onNavigate={setCurrentDate}
            selectable
            onSelectSlot={handleCalendarSelect}
            onSelectEvent={handleEventSelect}
            components={{
              toolbar: CustomToolbar,
              event: ({ event }) => (
                <div className={cn(
                  "rounded px-2 py-1 text-xs border-l-4 overflow-hidden hover:bg-opacity-80 transition-colors mb-1 shadow-sm",
                  event.status === "Confirmada" ? "bg-green-100 border-green-500" :
                  event.status === "Pendiente" ? "bg-yellow-100 border-yellow-500" :
                  event.status === "Completada" ? "bg-blue-100 border-blue-500" :
                  "bg-red-100 border-red-500"
                )}>
                  {event.title}
                </div>
              )
            }}
            messages={{
              today: "Hoy",
              previous: "Anterior",
              next: "Siguiente",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda"
            }}
          />
        </div>
      </div>

      {}
      <div className="w-64 bg-gray-50 border-l overflow-y-auto">
        {}
      </div>

      {}
      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAppointment ? "Editar Cita" : "Nueva Cita"}
        fields={appointmentFields}
        initialData={selectedAppointment || {}}
        onSubmit={handleSubmit}
        getDynamicOptions={(fieldName, formData) => {
          if (fieldName === "petId" && formData.clientId) {
            return getPetsByClient(formData.clientId)
          }
          return []
        }}
      />
    </div>
  )
}*/