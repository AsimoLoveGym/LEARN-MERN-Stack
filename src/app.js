// import React from 'react';
// import ReactDOM from 'react-dom';
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var BugFilter = React.createClass({
  render() {
    console.log("Rendering Bugfilter");
    return (
      <div>A way to filterthe list of bugs would come here</div>
    );
  },
});

var BugRow = React.createClass({
  render() {
    console.log("Rendering BugRow:", this.props.bug);
    return (
      <tr>
        <td>{this.props.bug._id}</td>
        <td>{this.props.bug.status}</td>
        <td>{this.props.bug.priority}</td>
        <td>{this.props.bug.owner}</td>
        <td>{this.props.bug.title}</td>
      </tr>
    );
  },
});

var BugTable = React.createClass({
  render() {
    console.log("Rendering bug table, num items:", this.props.bugs.length);
    var bugRows = this.props.bugs.map(function (bug) {
      return <BugRow key={bug._id} bug={bug} />;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Owner</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {bugRows}
        </tbody>
      </table>
    );
  },
});

var BugAdd = React.createClass({
  render() {
    console.log("Rendering BugAdd");
    return (
      <div>
        <form name="bugAdd">
          <input type="text" name="owner" placeholder="Owner" />
          <input type="text" name="title" placeholder="Title" />
          <button onClick={this.handleSubmit}>Add Bug</button>
        </form>
      </div>
    );
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var form = document.forms.bugAdd;
    this.props.addBug({ owner: form.owner.value, title: form.title.value, status: 'New', priority: 'P1' });
    // clear the form for the next input
    form.owner.value = "";
    form.title.value = "";
  },
});

// var bugData = [
//   { id: 1, priority: 'P1', status: 'Open', owner: 'Ravan', title: 'App crashes on open' },
//   { id: 2, priority: 'P2', status: 'New', owner: 'Eddie', title: 'Misaligned border on panel' },
// ];

var BugList = React.createClass({
  getInitialState: function () {
    // return { bugs: bugData };
    return { bugs: [] };
  },

  addBug: function (bug) {
    console.log("Adding bug:", bug);

    // var bugsModified = this.state.bugs.slice();
    // bug.id = this.state.bugs.length + 1;
    // bugsModified.push(bug);
    // this.setState({ bugs: bugsModified });
    $.ajax({
      type: 'POST', url: '/api/bugs', contentType: 'application/json',
      data: JSON.stringify(bug),
      success: function (data) {
        var bug = data;

        // suggested to not to mody the state, it's immutable. make a copy
        var bugsModified = this.state.bugs.concat(bug);
        this.setState({ bugs: bugsModified });
      }.bind(this),
      error: function (xhr, status, err) {
        console.log("Error adding bug:", err);
      },
    });
  },

  componentDidMount: function () {
    $.ajax('/api/bugs').done(function (data) {
      this.setState({ bugs: data });
    }.bind(this));
  },

  render() {
    console.log("Rendering bug list, num items:", this.state.bugs.length);
    return (
      <div>
        <h1>Bug Tracker</h1>
        <BugFilter />
        <hr />
        <BugTable bugs={this.state.bugs}/>
        <hr />
        <BugAdd addBug={this.addBug} />
      </div>
    );
  },
});

ReactDOM.render(
  <BugList />,
  document.getElementById('main')
);
