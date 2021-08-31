import React, { Component } from "react";
import ReactDOM from "react-dom";
import "../styles.css";
import logo from "./logob.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../actions/auth";

import PrivateRoute from "./common/PrivateRoute";
import Dashboard from "./dashboard/Dashboard";
import Create from "./dashboard/Create";
import Form from "./submission/Form";
import Login from "./accounts/Login";
import Register from "./accounts/Register";
import SubmissionManagement from "./dashboard/SubmissionManagement";

class Landing extends React.Component {
  render() {
    return (
      <div>
        <Head />
        <svg
          id="wave"
          className="relative -z-1"
          style={{ transform: "rotate(180deg)", transition: "0.3s" }}
          viewBox="0 0 1440 270"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="gradient-fill"
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#ff9068" />
              <stop offset="1" stopColor="#fd746c" />
            </linearGradient>
          </defs>
          <path
            fill="url(#gradient-fill)"
            fillOpacity="1"
            d="M0,189L48,193.5C96,198,192,207,288,180C384,153,480,90,576,90C672,90,768,153,864,153C960,153,1056,90,1152,63C1248,36,1344,45,1440,58.5C1536,72,1632,90,1728,99C1824,108,1920,108,2016,94.5C2112,81,2208,54,2304,54C2400,54,2496,81,2592,99C2688,117,2784,126,2880,148.5C2976,171,3072,207,3168,225C3264,243,3360,243,3456,243C3552,243,3648,243,3744,220.5C3840,198,3936,153,4032,126C4128,99,4224,90,4320,99C4416,108,4512,135,4608,135C4704,135,4800,108,4896,108C4992,108,5088,135,5184,126C5280,117,5376,72,5472,81C5568,90,5664,153,5760,184.5C5856,216,5952,216,6048,207C6144,198,6240,180,6336,171C6432,162,6528,162,6624,135C6720,108,6816,54,6864,27L6912,0L6912,270L6864,270C6816,270,6720,270,6624,270C6528,270,6432,270,6336,270C6240,270,6144,270,6048,270C5952,270,5856,270,5760,270C5664,270,5568,270,5472,270C5376,270,5280,270,5184,270C5088,270,4992,270,4896,270C4800,270,4704,270,4608,270C4512,270,4416,270,4320,270C4224,270,4128,270,4032,270C3936,270,3840,270,3744,270C3648,270,3552,270,3456,270C3360,270,3264,270,3168,270C3072,270,2976,270,2880,270C2784,270,2688,270,2592,270C2496,270,2400,270,2304,270C2208,270,2112,270,2016,270C1920,270,1824,270,1728,270C1632,270,1536,270,1440,270C1344,270,1248,270,1152,270C1056,270,960,270,864,270C768,270,672,270,576,270C480,270,384,270,288,270C192,270,96,270,48,270L0,270Z"
          ></path>
        </svg>
        <Body />
      </div>
    );
  }
}

class Head extends React.Component {
  render() {
    return (
      <div className="w-full bg-gradient-to-r from-gr-start to-gr-end">
        <Header />
        <Showcase />
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div className="flex flex-row px-4 h-16 items-center justify-between bg-transparent">
        <img src={logo} className="" height="48px" width="132px" />
        <div className="table rounded-lg bg-gray-200 bg-opacity-25 text-lg tracking-wide">
          <Link
            to="/dashboard"
            className="table-cell px-4 text-white py-2 rounded-l-lg bg-gray-700 bg-opacity-25"
          >
            Features
          </Link>
          <Link
            to="/create"
            className="table-cell px-4 text-white py-2 rounded-r-lg hover:bg-gray-500 hover:bg-opacity-25"
          >
            Create
          </Link>
        </div>
      </div>
    );
  }
}

class GradientText extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <span
        className={`w-min whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-${this.props.startColor} to-${this.props.endColor}`}
      >
        {this.props.text}
      </span>
    );
  }
}

class Showcase extends React.Component {
  constructor(props) {
    super(props);
    this.information = window.innerWidth > 799 ? " Information" : "";
  }
  render() {
    return (
      <div className="flex flex-col content-center pl-4 md:pl-20 lg:pl-32 py-4 space-y-6 text-7xl md:text-9xl font-sans font-black md:tracking-wide">
        <GradientText
          text="Forms"
          startColor="purple-50"
          endColor="purple-100"
        />

        <GradientText
          text="Create"
          startColor="purple-50"
          endColor="purple-200"
        />

        <GradientText
          text="Publish"
          startColor="purple-50"
          endColor="purple-300"
        />

        <GradientText
          text={"Collect" + this.information}
          startColor="purple-500"
          endColor="purple-900"
        />
      </div>
    );
  }
}

class Body extends React.Component {
  render() {
    return <div></div>;
  }
}

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <div>
        <Provider store={store}>
          <Switch>
            <PrivateRoute path="/create/:id" component={Create} />
            <PrivateRoute path="/create" component={Create} />
            <PrivateRoute
              path="/dashboard/form/:id"
              component={SubmissionManagement}
            />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route path="/submit/:id" component={Form} />
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <Landing />
            </Route>
          </Switch>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
