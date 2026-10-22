import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/Home";
import MyShelf from "./pages/MyShelf";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2b2420] selection:bg-[#d4a574] selection:text-[#2b2420]">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:ml-60 xl:ml-65">
        <Header />
        <main className="flex-1 px-5 md:px-10 xl:px-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/my-shelf" element={<MyShelf />} />
          </Routes>
        </main>
        <div className="px-5 md:px-10 xl:px-16">
          <Footer />
        </div>
      </div>
    </div>
  );
}

