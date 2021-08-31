import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import "../../styles.css";
import logo from "../logob.png";

import { getFormDetails } from "../../actions/forms";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
import { PlusIcon } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";

class SubmissionManagement extends Component {
  static propTypes = {
    detailedForm: PropTypes.object.isRequired,
    getFormDetails: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getFormDetails(this.props.match.params.id);
  }

  render() {
    if (!this.props.detailedForm.id) {
      return <p>loading</p>;
    }
    const submissions = this.props.detailedForm.submissions.map(
      (submission) => <FormTr key={submission.id} submission={submission} />
    );
    return (
      <div>
        <Navbar />
        <div className="p-12">
          <table className="table table-fixed w-full border-collapse">
            <thead className="border-b-4 border-black">
              <tr>
                {this.props.detailedForm.questions.map((q) => (
                  <th key={q.id}>{q.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>{submissions}</tbody>
          </table>
          {!submissions.length ? (
            <span className="inline-flex w-full mt-1 justify-center text-xl text-gray-600">
              It looks pretty empty here!
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

class FormTr extends Component {
  render() {
    let answers = [];
    if (this.props.submission.text_answers) {
      answers = [...answers, ...this.props.submission.text_answers];
    }
    if (this.props.submission.number_answers) {
      answers = [...answers, ...this.props.submission.number_answers];
    }
    answers.sort((a, b) => (a.question > b.question ? 1 : -1));
    return (
      <tr className="border-2 border-black rounded">
        {answers.map((a) => (
          <td key={a.question}>{a.answer}</td>
        ))}
      </tr>
    );
  }
}

const mapStateToProps = (state) => ({
  detailedForm: state.forms.detailedForm,
});

export default connect(mapStateToProps, { getFormDetails })(
  SubmissionManagement
);
