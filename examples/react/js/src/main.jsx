import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

let container
if (import.meta.env.MODE === 'development') {
  container = document.getElementById('root')
} else {
  container = document.querySelector('div[data-component-id$=":my-component"]')
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
