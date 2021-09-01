import React, { Component } from "react";
import { connect } from "react-redux";
import "../../styles.css";
import logo from "../logob.png";

import { logout } from "../../actions/auth";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

export class Navbar extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="flex flex-row px-2 sm:px-12 py-4 h-12 items-center justify-between bg-gray-200">
        <div className="flex flex-row">
          <img
            src={logo}
            className="table-cell mr-4"
            height="48px"
            width="132px"
          />
          <div className="table-cell btn rounded bg-green-500 hover:bg-green-600 focus:bg-green-700">
            <Link to={"/dashboard"} className="">
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
        <div className="table rounded-lg bg-gray-200 bg-opacity-25 text-base tracking-wide">
          <button
            className="table-cell btn bg-red-600 hover:bg-red-700 focus:bg-red-800"
            onClick={this.props.logout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
}

export default connect(null, { logout })(Navbar);
