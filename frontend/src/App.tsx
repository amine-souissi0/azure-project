import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RTLProvider from "./components/layout/RTLProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import QAChat from "./pages/QAChat";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RTLProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:slug" element={<ArticleDetail />} />
                <Route path="/qa" element={<QAChat />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </RTLProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
