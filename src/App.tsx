import './index.css'
import Header from "./Components/Header"; 
import Main from "./Components/Main";
import Footer from './Components/Footer';


function App() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] w-screen">
      <Header />
      <Main/>
      <Footer/>
     
    </div>
  )
}

export default App
