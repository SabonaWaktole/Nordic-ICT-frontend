import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';

const router = createBrowserRouter([
  {
    path: '*',
    element: <App />,
  }
]);

export default function Root() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
