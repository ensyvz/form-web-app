import React, { Component, useState, Fragment } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import "../../styles.css";
import logo from "../logob.png";

import { createForm, getFormDetails, editForm } from "../../actions/forms";
import { deleteMessage } from "../../actions/messages";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";

import Navbar from "./Navbar";

import DateTimePicker from "react-datetime-picker";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon, PlusIcon } from "@heroicons/react/solid";

class Create extends Component {
  static propTypes = {
    createForm: PropTypes.func.isRequired,
    message: PropTypes.object,
    getFormDetails: PropTypes.func.isRequired,
    detailedForm: PropTypes.object,
    editForm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      formId: "",
      formName: "",
      closeDate: new Date(),
      selectedStatus: "Inactive",
      questions: [],
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getFormDetails(this.props.match.params.id);
    }
  }
  componentDidUpdate() {
    if (this.props.detailedForm.id && this.state.formId === "") {
      const form = this.props.detailedForm;
      this.setState({
        formId: form.id,
        formName: form.name,
        closeDate: new Date(form.close_date),
        selectedStatus: form.status ? "Active" : "Inactive",
        questions: form.questions,
      });
    }
  }

  changeHandler = (event) => {
    event.preventDefault();
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  dateChange = (date) => {
    this.setState({ closeDate: date });
  };

  changeStatus = (status) => {
    this.setState({ selectedStatus: status });
  };

  create = (event) => {
    event.preventDefault();
    const form = {
      name: this.state.formName,
      close_date: this.state.closeDate,
      status: this.state.selectedStatus == "Inactive" ? 0 : 1,
      questions: this.state.questions,
    };
    if (this.props.detailedForm.id) {
      this.props.editForm(this.props.detailedForm.id, form);
    } else {
      this.props.createForm(form);
    }
  };

  addNewQuestion = (event) => {
    event.preventDefault();
    let order;
    if (this.state.questions.length) {
      order = this.state.questions[this.state.questions.length - 1].order + 1;
    } else order = 0;
    this.setState({
      questions: [
        ...this.state.questions,
        {
          title: "",
          description: "",
          data_type: "text",
          order: order,
        },
      ],
    });
  };

  onQuestionDelete = (index) => {
    let questions = [...this.state.questions];
    questions.splice(index, 1);
    this.setState({ questions: questions });
  };

  questionChangeHandler = (event, index) => {
    let nam;
    let val;

    if (event.target) {
      nam = event.target.name;
      val = event.target.value;
    } else {
      nam = "data_type";
      val = event;
    }

    // 1. Make a shallow copy of the items
    let questions = [...this.state.questions];
    // 2. Make a shallow copy of the item you want to mutate
    let question = {
      ...questions[index],
      [nam]: val,
    };
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    questions[index] = question;
    // 5. Set the state to our new copy
    this.setState({ questions });
  };

  render() {
    const statuses = ["Inactive", "Active"];

    if (this.props.message.formCreated) {
      this.props.deleteMessage();
      return <Redirect to="/dashboard" />;
    } else {
      const questions = this.state.questions?.map((question, index) => (
        <QuestionTr
          key={index}
          index={index}
          question={question}
          onDelete={(index) => this.onQuestionDelete(index)}
          onChange={(event, index) => this.questionChangeHandler(event, index)}
        />
      ));
      return (
        <div>
          <Navbar />
          <form className="flex flex-row flex-wrap m-4 gap-4">
            <InputField
              name="formName"
              placeholder="Form Name"
              value={this.state.formName}
              type="text"
              onChange={(event) => this.changeHandler(event)}
            />
            <div className="relative">
              <label
                htmlFor="closeDate"
                className="absolute z-10 top-1 ml-2 bg-white duration-300 rounded-lg origin-left transform scale-75 -translate-y-5 text-black;"
              >
                Close Date
              </label>
              <DateTimePicker
                name="closeDate"
                onChange={this.dateChange}
                value={this.state.closeDate}
              />
            </div>
            <ListboxInput
              array={statuses}
              value={this.state.selectedStatus}
              onChange={this.changeStatus}
            />
            <button
              className="btn bg-green-500 hover:bg-green-600 focus:bg-green-700"
              onClick={(event) => this.create(event)}
            >
              Create
            </button>
          </form>
          <form className="flex flex-col m-4 space-y-4">
            <div className="w-full">
              <div className="w-full sm:inline-block hidden px-2 sm:px-4 border-black">
                <span className="inline-block w-2/6">Title</span>
                <span className="inline-block w-2/6">Description</span>
                <span className="inline-block w-1/6">Type</span>
                <span className="inline-block w-1/6">Order</span>
              </div>
              <div className="space-y-4">{questions}</div>
            </div>
            <button
              className="text-white rounded mt-2 bg-green-500 hover:bg-green-600 focus:bg-green-700"
              onClick={(event) => this.addNewQuestion(event)}
            >
              <PlusIcon className="h-10 w-5 mx-auto" />
            </button>
          </form>
        </div>
      );
    }
  }
}

class QuestionTr extends Component {
  render() {
    const types = ["number", "text"];

    return (
      <div className="flex flex-row flex-wrap sm:flex-nowrap w-full bg-gray-100 shadow p-2 sm:p-4 rounded gap-4">
        <div className="w-full sm:w-2/6 relative">
          <span className="w-2/5 sm:hidden inline-block">Title :</span>
          <div className="w-3/5 sm:w-full inline-block">
            <InputField
              name="title"
              placeholder="Question Title"
              value={this.props.question.title}
              type="text"
              onChange={(event) => this.props.onChange(event, this.props.index)}
            />
          </div>
        </div>
        <div className="w-full sm:w-2/6 relative">
          <span className="w-2/5 sm:hidden inline-block">Description :</span>
          <div className="w-3/5 sm:w-full inline-block">
            <InputField
              name="description"
              placeholder="Question Description"
              value={this.props.question.description}
              type="text"
              onChange={(event) => this.props.onChange(event, this.props.index)}
            />
          </div>
        </div>
        <div className="w-full sm:w-1/6 relative">
          <span className="w-2/5 sm:hidden inline-block">Type :</span>
          <div className="w-3/5 sm:w-full inline-block">
            <ListboxInput
              array={types}
              value={this.props.question.data_type}
              onChange={(type) => this.props.onChange(type, this.props.index)}
            />
          </div>
        </div>
        <div className="w-full sm:w-1/6 relative">
          <span className="w-2/5 sm:hidden inline-block">Order :</span>
          <div className="w-3/5 sm:w-full inline-block">
            <button
              type="button"
              className="btn bg-red-500 hover:bg-red-700 focus:bg-red-900"
              onClick={() => this.props.onDelete(this.props.index)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class InputField extends Component {
  render() {
    return (
      <div className="relative">
        <input
          className={
            "relative border z-10 appearance-none bg-transparent block w-full focus:ring-2 ring-opacity-50 focus:shadow-inner focus:outline-none px-1.5 py-1 rounded " +
            "border-blue-500 ring-blue-500"
          }
          name={this.props.name}
          value={this.props.value}
          type={this.props.type}
          placeholder=" "
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
        />
        <label
          htmlFor={this.props.name}
          className="absolute text-gray-400 top-1 ml-2 bg-white duration-300 rounded-lg origin-left"
        >
          {this.props.placeholder}
        </label>
      </div>
    );
  }
}

function ListboxInput(props) {
  return (
    <div className="w-auto">
      <Listbox value={props.value} onChange={props.onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <span className="block truncate">{props.value}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-30 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {props.array.map((status, statusIdx) => (
                <Listbox.Option
                  key={statusIdx}
                  className={({ active }) =>
                    `${active ? "text-amber-900 bg-amber-100" : "text-gray-900"}
                        cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                  value={status}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? "font-medium" : "font-normal"
                        } block truncate`}
                      >
                        {status}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? "text-amber-600" : "text-amber-600"
                          }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

const mapStateToProps = (state) => ({
  message: state.messages,
  detailedForm: state.forms.detailedForm,
});

export default connect(mapStateToProps, {
  createForm,
  deleteMessage,
  getFormDetails,
  editForm,
})(Create);
