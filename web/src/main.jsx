import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// PrimeReact core styles (required for OrganizationChart and other components)
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
