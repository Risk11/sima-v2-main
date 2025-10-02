// App.tsx

import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArcGisProvider } from './components/arcgis/context/ArcGisProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArcGisProvider>
        <BrowserRouter>
          <div className='h-screen bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]'>
            <Router />
          </div>
        </BrowserRouter>
      </ArcGisProvider>
    </QueryClientProvider>
  );
}

export default App;