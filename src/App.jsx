import { Navbar } from "@components/navigation/Navbar";
import { Routes } from "@routes/routes";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="bg-primary text-normal">
        <div className="max-w-6xl mx-auto">
          <Routes />
        </div>
      </main>
    </>
  )
}