import { HomeIcon } from '@heroicons/react/24/outline';
/* import Home from 'app/pages/dashboards/example'; */
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_DASHBOARDS = '/dashboards'

const path = (root, item) => `${root}${item}`;

export const dashboards = {
    id: 'dashboards',
    type: NAV_TYPE_ROOT,
    path: '/dashboards',
    title: 'Dashboards',
    transKey: 'nav.dashboards.dashboards',
    Icon: DashboardsIcon,
    childs: [
        {
            id: 'dashboards.home',
            path: path(ROOT_DASHBOARDS, '/home'),
            type: NAV_TYPE_ITEM,
            title: 'Home',
            transKey: 'nav.dashboards.home',
            Icon: HomeIcon,
        },
        {
            id: 'dashboards.PerfilAtleta',
            path: path(ROOT_DASHBOARDS, '/PerfilAtleta'),
            type: NAV_TYPE_ITEM,
            title: 'Perfil',
            Icon: HomeIcon,
        },
        {
            id: 'dashboards.atletas',
            path: path(ROOT_DASHBOARDS, '/Atleta'),
            type: NAV_TYPE_ITEM,
            title: 'Atletas',
            transKey: 'Atletas',
            Icon: HomeIcon,
        },
    ]
}

