import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PricingCards from './assets/componentes/tarjetasDePago.tsx'
//import App from './App.tsx'
//import  Input  from './App.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PricingCards/>
   
   
  </StrictMode>,
)
//    <Input/>
