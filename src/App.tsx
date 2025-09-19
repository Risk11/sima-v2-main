// App.tsx
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Router from './routes/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className='bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]'>
          <Router />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
