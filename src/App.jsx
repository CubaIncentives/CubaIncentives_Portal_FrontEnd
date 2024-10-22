import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/routes/ProtectedRoutes.jsx';
import routes from '@/routes/RoutesFile.js';

import './index.css';
import './assets/externalCSS/index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'leaflet/dist/leaflet.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import MaintenanceMode from './layout/MaintenanceMode';
import PageNotFound from './layout/PageNotFound';
import api from './utils/api';
import { getLocalStorageItem } from './utils/helper';

function App() {
  const [isMaintenanceModeOn, setMaintenanceModeFlag] = useState(false);
  const navigate = useNavigate();

  const getMaintenanceModeData = async () => {
    const res = await api.get(`/maintenance-mode`);

    return res.data;
  };

  const { isFetching: isMaintenanceModeDataLoading } = useQuery(
    ['get-maintenance-mode'],
    () => getMaintenanceModeData(),
    {
      onSuccess: (data) => {
        const maintenanceModeStatus =
          data?.data?.frontend === '1' ? true : false;

        setMaintenanceModeFlag(maintenanceModeStatus);
        if (
          !maintenanceModeStatus &&
          window.location.pathname === '/under-maintenance'
        ) {
          setTimeout(() => {
            if (
              getLocalStorageItem('token') &&
              getLocalStorageItem('userData')
            ) {
              navigate('/home');
            } else {
              navigate('/sign-in');
            }
          }, 100);
        }
      },
    }
  );

  if (isMaintenanceModeDataLoading) {
    return null;
  }

  return isMaintenanceModeOn ? (
    <Routes>
      <Route path='*' element={<MaintenanceMode />} />
    </Routes>
  ) : (
    <>
      <Routes>
        {routes?.map((route, index) => {
          if (route.private) {
            return (
              <Route
                key={index}
                path='/'
                element={<ProtectedRoute route={route}></ProtectedRoute>}
              >
                <Route path={route.path} element={<route.component />}>
                  {/* Render nested routes */}
                  {route.children &&
                    route.children.map((childRoute, childIndex) => (
                      <Route
                        key={childIndex}
                        path={childRoute.path}
                        element={<childRoute.component />}
                      />
                    ))}
                </Route>
              </Route>
            );
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          );
        })}
        <Route element={<ProtectedRoute />} />
        <Route path='/under-maintenance' element={<MaintenanceMode />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
