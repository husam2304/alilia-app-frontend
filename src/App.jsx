import "./App.css";
import AppRoute from "./routes/AppRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundry/ErrorBoundry";
import {
  persistQueryClient,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // optional
        retry: 1, // retry failed requests once
      },
    },
  });
  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  // Persist cache
  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
  });
  return (
    <>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppRoute />
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
