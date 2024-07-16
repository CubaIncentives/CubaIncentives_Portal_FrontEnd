import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/routes/ProtectedRoutes.jsx';
import routes from '@/routes/RoutesFile.js';

import './index.css';
import './assets/externalCSS/index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  return (
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
        <Route element={<ProtectedRoute />}>
          <Route path='*' element={<h1>No Page Found</h1>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
