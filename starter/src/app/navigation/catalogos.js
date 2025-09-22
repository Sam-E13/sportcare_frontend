
/* import Home from 'app/pages/dashboards/example'; */
import ComponentsIcon from 'assets/dualicons/components.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_CATALOGOS = '/Catalogos'

const path = (root, item) => `${root}${item}`;

export const catalogos = {
    id: 'catalogos',
    type: NAV_TYPE_ROOT,
    path: '/Catalogos',
    title: 'Catalogos',
    transKey: 'Catálogos',
    Icon: ComponentsIcon,
    childs: [
        
        {
            id: 'catalogos.deporte', // Unique identifier
            path: path(ROOT_CATALOGOS, '/deporte'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Deportes', // Title
            transKey: 'Deportes', // Translation key (optional)
            /* Icon: HomeIcon, // Icon component (optional) */
        },
        {
            id: 'catalogos.grupoDeportivo', // Unique identifier
            path: path(ROOT_CATALOGOS, '/grupoDeportivo'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Grupo Deportivo', // Title
            transKey: 'Grupo Deportivo', // Translation key (optional)
            /* Icon: HomeIcon, // Icon component (optional) */
        },
        {
            id: 'catalogos.metodologo', // Unique identifier
            path: path(ROOT_CATALOGOS, '/metodologo'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Metodólogo', // Title
            transKey: 'Metodólogo', // Translation key (optional)
            /* Icon: HomeIcon, // Icon component (optional) */
        },
        {
            id: 'catalogos.horarios', // Unique identifier
            path: path(ROOT_CATALOGOS, '/horarios'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Horarios', // Title
            transKey: 'Horarios', // Translation key (optional)
            /* Icon: HomeIcon, // Icon component (optional) */
        },
        {
            id: 'catalogos.disponibilidad-temporal', // Unique identifier
            path: path(ROOT_CATALOGOS, '/disponibilidad-temporal'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Horarios Temporales', // Title
            transKey: 'Horarios Temporales', // Translation key (optional)
            /* Icon: HomeIcon, // Icon component (optional) */
        },
        {
            id: 'dashboards.atleta', // Unique identifier
            path: path(ROOT_CATALOGOS, '/atleta'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Atletas', // Title
            transKey: 'Atletas', // Translation key (optional)
            /* Icon: HomeIcon, // Icon component (optional) */
        },
        {
            id: 'dashboards.entrenadores', // Unique identifier
            path: path(ROOT_CATALOGOS, '/entrenadores'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Entrenadores', // Title
            transKey: 'Entrenadores', // Translation key (optional)
            /* Icon: HomeIcon, // Icon component (optional) */
        },
        {
            id: 'dashboards.categorias', // Unique identifier
            path: path(ROOT_CATALOGOS, '/categorias'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Categorias', // Title
            transKey: 'Categorias', // Translation key (optional)
            /* Icon: HomeIcon, // Icon component (optional) */
        },
        {
            id: 'dashboards.consultorios', // Unique identifier
            path: path(ROOT_CATALOGOS, '/consultorios'), // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Consultorios', // Title
            transKey: 'Consultorios', // Translation key (optional)
            /* Icon: HomeIcon, // Icon component (optional) */
        },
       
    ]
}

