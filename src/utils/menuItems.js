import {
  IconSchool, IconUsersGroup, IconCalendarWeek, IconList, IconBook, IconNotes, IconSquarePlus,
  IconHeartHandshake, IconUserPlus, IconFirstAidKit, IconFileTypeDoc, IconReportAnalytics,
  IconUsers,
  IconBuildingBank,
  IconBuilding
} from "@tabler/icons-react";

function getItem(label, key, icon, link, visible, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
    link,
    visible
  };
}

export const tutorItems = [
  getItem("Sesión de Tutoría", "1", <IconSchool size={20}/>, "/tutor/sesion", true),
  getItem("Alumnos Asignados", "2", <IconUsersGroup size={20} />, "/tutor/alumnos", true),
  getItem("Calendario", "3", <IconCalendarWeek size={20} />, "/tutor/calendario", true),
  getItem("Lista de Citas", "4", <IconList size={20} />, "/tutor/citas", true),
  getItem("Solicitudes", "5", <IconBook size={20} />, "/tutor/solicitudes", true),
  getItem("Encuestas", "6", <IconNotes size={20} />, "/tutor/encuestas", true),
];

export const coordinadorItems = [
  getItem("Usuarios", "1", <IconUsersGroup size={20}/>, "/coordinador/usuarios", true),
  getItem("Tipos de Tutoría", "2", <IconSchool size={20} />, "/coordinador/tipos", true),
  getItem("Asignación Individual Tipo de Tutoría", "3", <IconSquarePlus size={20} />, "/coordinador/astipo", true),
  getItem("Asignación Masiva Tipo de Tutoría", "4", <IconSquarePlus size={20} />, "/coordinador/astipomas", true),
  getItem("Asignar Tutor", "5", <IconHeartHandshake size={20} />, "/coordinador/astutor", true),
  getItem("Registro de Usuarios", "6", <IconUserPlus size={20} />, "/coordinador/regusuarios", true),
  getItem("Unidades de Apoyo", "7", <IconFirstAidKit size={20} />, "/coordinador/uapoyo", true),
  getItem("Agregar Documentos", "8", <IconFileTypeDoc size={20} />, "/coordinador/docs", true),
  getItem("Reportes", "9", <IconReportAnalytics size={20} />, "/coordinador/reportes", false),
];

export const alumnoItems = [
  getItem("Lista de tutores", "1", <IconUsers size={20}/>, "/alumno/tutores", true),
  getItem("Horario de citas", "2", <IconCalendarWeek size={20} />, "/alumno/horario", true),
  getItem("Lista de citas", "3", <IconList size={20} />, "/alumno/citas", true),
  getItem("Encuestas", "4", <IconNotes size={20} />, "/alumno/encuestas", true),
];

export const adminItems = [
  getItem("Institucion", "1", <IconBuildingBank size={20}/>, "/admin/institucion", true),
  getItem("Facultad", "2", <IconBuilding size={20} />, "/admin/facultad", true),
  getItem("Programa", "3", <IconSchool size={20} />, "/admin/programa", true),
  getItem("Roles", "4", <IconUsersGroup size={20} />, "/admin/roles", true),
  getItem("Registro de Usuarios", "5", <IconNotes size={20} />, "/admin/regusuarios", true),
];