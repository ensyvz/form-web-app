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
      (submission) => (
        <FormTr
          key={submission.id}
          submission={submission}
          questions={this.props.detailedForm.questions}
        />
      )
    );
    return (
      <div>
        <Navbar />
        <div className="p-4 sm:px-12 sm:py-4">
          <div className="w-full">
            <div className="grid grid-cols-auto w-full sm:inline-block hidden px-2 sm:px-4 border-black">
              {this.props.detailedForm.questions.map((q) => (
                <span className="" key={q.id}>
                  {q.title}
                </span>
              ))}
            </div>
            <div className="space-y-4">{submissions}</div>
          </div>
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
      <div className="flex flex-col bg-gray-100 shadow p-2 sm:p-4 rounded">
        {answers.map((a) => (
          <div key={a.question} className="w-full sm:w-2/5 relative">
            <span className="w-2/5 sm:hidden inline-block">
              {this.props.questions.find((q) => a.question === q.id).title +
                " :"}
            </span>
            <span className="w-3/5 sm:w-full inline-block">{a.answer}</span>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  detailedForm: state.forms.detailedForm,
});

export default connect(mapStateToProps, { getFormDetails })(
  SubmissionManagement
);
