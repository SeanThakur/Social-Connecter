import React, {Component} from 'react';
import { BrowserRouter as Router , Route} from "react-router-dom";
import './App.css';
import Navbar from "../components/layouts/Navbar";
import Landing from "../components/layouts/Landing";
import Register from "../components/authentication/Register";
import Login from "../components/authentication/Login";

class App extends Component{
    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <div className="container">
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
