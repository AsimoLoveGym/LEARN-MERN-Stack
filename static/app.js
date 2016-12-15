// import React from 'react';
// import ReactDOM from 'react-dom';
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var BugFilter = React.createClass({
  displayName: 'BugFilter',

  render() {
    console.log("Rendering Bugfilter");
    return React.createElement(
      'div',
      null,
      'A way to filterthe list of bugs would come here'
    );
  }
});

var BugRow = React.createClass({
  displayName: 'BugRow',

  render() {
    console.log("Rendering BugRow:", this.props.bug);
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        null,
        this.props.bug._id
      ),
      React.createElement(
        'td',
        null,
        this.props.bug.status
      ),
      React.createElement(
        'td',
        null,
        this.props.bug.priority
      ),
      React.createElement(
        'td',
        null,
        this.props.bug.owner
      ),
      React.createElement(
        'td',
        null,
        this.props.bug.title
      )
    );
  }
});

var BugTable = React.createClass({
  displayName: 'BugTable',

  render() {
    console.log("Rendering bug table, num items:", this.props.bugs.length);
    var bugRows = this.props.bugs.map(function (bug) {
      return React.createElement(BugRow, { key: bug._id, bug: bug });
    });

    return React.createElement(
      'table',
      null,
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Id'
          ),
          React.createElement(
            'th',
            null,
            'Status'
          ),
          React.createElement(
            'th',
            null,
            'Priority'
          ),
          React.createElement(
            'th',
            null,
            'Owner'
          ),
          React.createElement(
            'th',
            null,
            'Title'
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        bugRows
      )
    );
  }
});

var BugAdd = React.createClass({
  displayName: 'BugAdd',

  render() {
    console.log("Rendering BugAdd");
    return React.createElement(
      'div',
      null,
      React.createElement(
        'form',
        { name: 'bugAdd' },
        React.createElement('input', { type: 'text', name: 'owner', placeholder: 'Owner' }),
        React.createElement('input', { type: 'text', name: 'title', placeholder: 'Title' }),
        React.createElement(
          'button',
          { onClick: this.handleSubmit },
          'Add Bug'
        )
      )
    );
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var form = document.forms.bugAdd;
    this.props.addBug({ owner: form.owner.value, title: form.title.value, status: 'New', priority: 'P1' });
    // clear the form for the next input
    form.owner.value = "";
    form.title.value = "";
  }
});

// var bugData = [
//   { id: 1, priority: 'P1', status: 'Open', owner: 'Ravan', title: 'App crashes on open' },
//   { id: 2, priority: 'P2', status: 'New', owner: 'Eddie', title: 'Misaligned border on panel' },
// ];

var BugList = React.createClass({
  displayName: 'BugList',

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
      }
    });
  },

  componentDidMount: function () {
    $.ajax('/api/bugs').done(function (data) {
      this.setState({ bugs: data });
    }.bind(this));
  },

  render() {
    console.log("Rendering bug list, num items:", this.state.bugs.length);
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        'Bug Tracker'
      ),
      React.createElement(BugFilter, null),
      React.createElement('hr', null),
      React.createElement(BugTable, { bugs: this.state.bugs }),
      React.createElement('hr', null),
      React.createElement(BugAdd, { addBug: this.addBug })
    );
  }
});

ReactDOM.render(React.createElement(BugList, null), document.getElementById('main'));