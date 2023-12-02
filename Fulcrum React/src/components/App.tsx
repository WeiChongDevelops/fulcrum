import '../css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FulcrumApp from "./FulcrumApp.tsx";
import Signup from "./Signup.tsx";
import Login from "./Login.tsx";

export default function App() {

    return (
        <Router>
            <Routes>
                <Route path="/login" Component={Login} />
                <Route path="/signup" Component={Signup} />
                <Route path="/" Component={FulcrumApp} />
            </Routes>
        </Router>
    )
}