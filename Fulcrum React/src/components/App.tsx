import '../css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FulcrumApp from "./FulcrumApp.tsx";
import Register from "./Auth/Register.tsx";
import Login from "./Auth/Login.tsx";

export default function App() {

    return (
        <Router>
            <Routes>
                <Route path="/login" Component={Login} />
                <Route path="/register" Component={Register} />
                <Route path="/app" Component={FulcrumApp} />
            </Routes>
        </Router>
    )
}
