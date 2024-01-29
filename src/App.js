import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/authentication/login';
import Home from './pages/home/home';
import Register from './pages/authentication/register';
import Mypost from "./pages/mypost/mypost";

function App() {
  return (
    <>  
      <BrowserRouter>
        <Routes>
          <Route exact element={<Login />} path='/' />
          <Route element={<Register/>} path='/register'/> 
          <Route element={<Home />} path='/calendar' />
          <Route element={<Mypost />} path='/mypost' />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
