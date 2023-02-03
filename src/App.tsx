import { QueryClient, QueryClientProvider } from 'react-query';
import Main from './container/Main';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}

export default App;
