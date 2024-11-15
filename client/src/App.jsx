import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './components/dashboard'
import LoginUser from './components/loginUser'
import RegisterUser from './components/registerUser'
import AuthenticateUser from './components/authenticateUser'

function App() {

  return(
    <Router>
      <Routes>
        <Route path='/' element={<AuthenticateUser/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/login' element={<LoginUser/>} />
        <Route path='/register' element={<RegisterUser/>} />
      </Routes>
    </Router>
  );
}

export default App;
