import './App.css'
import { ToastProvider } from './contexts/ToastContext'
import { RouterProvider } from 'react-router-dom'
import router from './router'

function App() {
  return (
    <>
      <ToastProvider>
        <RouterProvider router={router}></RouterProvider>
      </ToastProvider>
    </>
  )
}

export default App
