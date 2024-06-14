/* Este archivo contiene los nombres de las rutas para los breadcrumbs de cada página para rol de usuario con su
respectivo título. Aparecerán conforme se vaya adentrando en el árbol de carpetas. El título estará tanto en el
breadcrumb como en el header de la página.
*/


export const tutorBreadcrumbNames = {
  '/tutor/sesion': 'Sesión de Tutoría',

  '/tutor/alumnos': 'Alumnos Asignados',
  '/tutor/alumnos/planaccion': 'Plan de Acción',

  '/tutor/calendario': 'Disponibilidad semanal',
  
  '/tutor/citas': 'Lista de Citas',
  '/tutor/citas/detalle': 'Detalle de Cita',
  '/tutor/citas/detalle/planaccion': 'Plan de Acción',

  '/tutor/solicitudes': 'Solicitudes',
  '/tutor/encuestas': 'Encuestas',
}

export const alumnoBreadcrumbNames = {
  '/alumno/tutores': 'Lista de Tutores',
  '/alumno/horario': 'Agendar citas',
  '/alumno/citas': 'Lista de Citas',
  '/alumno/encuestas': 'Encuestas',
}

export const coordinadorBreadcrumbNames = {
  '/coordinador/usuarios': 'Lista de Usuarios',
  '/coordinador/tipos': 'Tipos de Tutoría',
  '/coordinador/astipo': 'Asignar Tipo de Tutoría',
  '/coordinador/astipomas': 'Asignación masiva de alumnos a tipo de tutoría',
  '/coordinador/astutor': 'Asignar Tutor',
  '/coordinador/regusuarios': 'Registro masivo de Usuarios',
  '/coordinador/uapoyo': 'Unidades de Apoyo',
  '/coordinador/docs': 'Registro de histórico académico',
  '/coordinador/reportes': 'Reportes',
}

export const adminBreadcrumbNames = {
  '/admin/institucion': 'Institución',
  '/admin/facultad': 'Facultades',
  '/admin/programa': 'Programas',
  '/admin/roles': 'Roles',
  '/admin/regusuarios': 'Registro masivo de Usuarios',
}