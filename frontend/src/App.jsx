import { Button } from "@chakra-ui/react"
import { Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Chatpage from "./pages/ChatPage"
import "./App.css"
import { Toaster } from "./components/ui/toaster";


function App() {
  return (
    <div className="App">
      <Toaster/>
      <Routes>
        <Route path="/" element={<Homepage/>}  />
        <Route path="/chats" element={<Chatpage/>} />
      </Routes>
      
    </div>
  )
}

export default App