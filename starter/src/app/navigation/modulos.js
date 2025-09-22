
/* import Home from 'app/pages/dashboards/example'; */
import PrototypesIcon from 'assets/dualicons/prototypes.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'


const ROOT_MODULOS = '/Modulos'

const path = (root, item) => `${root}${item}`;

export const modulos = {
    id: 'modulos',
    type: NAV_TYPE_ROOT,
    path: '/Modulos',
    title: 'Modulos',
    transKey: 'Modulos',
    Icon: PrototypesIcon,
    childs: [
        
        {
            id: 'modulos.AgendarCitas', // Unique identifier
            path: path(ROOT_MODULOS, '/Agendar-Citas'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Agendar Citas', // Title
            transKey: 'Agendar Citas', // Translation key (optional)
            /*Icon: HomeIcon, // Icon component (optional) */
        },

        {
            id: 'modulos.Consultas', // Unique identifier
            path: path(ROOT_MODULOS, '/Consultas'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Consultas', // Title
            transKey: 'Consultas', // Translation key (optional)
            /*Icon: HomeIcon, // Icon component (optional) */
        },

         {
            id: 'modulos.ProgramasEntrenamiento', // Unique identifier
            path: path(ROOT_MODULOS, '/Programas-Entrenamiento'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Programas-Entrenamiento', // Title
            transKey: 'Programas Entrenamiento', // Translation key (optional)
            /*Icon: HomeIcon, // Icon component (optional) */
        },

        {
            id: 'modulos.AsignarProgramas', // Unique identifier
            path: path(ROOT_MODULOS, '/asignar-programas'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Asignar Programas', // Title
            transKey: 'Asignar Programas', // Translation key (optional)
            /*Icon: HomeIcon, // Icon component (optional) */
        },
       

        {
            id: 'modulos.ReportesCitas', // Unique identifier
            path: path(ROOT_MODULOS, '/ReportesCitas'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Reportes de citas', // Title
            transKey: 'Reportes de citas', // Translation key (optional)
            /*Icon: HomeIcon, // Icon component (optional) */
        },

        {
            id: 'modulos.ReportesConsultas', // Unique identifier
            path: path(ROOT_MODULOS, '/ReportesConsultas'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Reportes de consultas', // Title
            transKey: 'Reportes de consultas', // Translation key (optional)
            /*Icon: HomeIcon, // Icon component (optional) */
        },
       
       
       
    ]
}

