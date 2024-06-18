import { lazy, Suspense } from 'react';
import DashboardLayout from 'src/layouts/dashboard';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import { element } from 'prop-types';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const CheckPage = lazy(() => import('src/pages/check'));
export const StaffPage = lazy(() => import('src/pages/staff'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const PageList = lazy(() => import('src/sections/blog/view/PageList'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        {
          path: 'dvtt', element: <BlogPage />,
          children: [
            { path: 'staff/:id', element: <StaffPage /> },
            { path: 'pages', element: <PageList /> },
          ],
        },
        { path: 'check', element: <CheckPage /> }
      ]
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
