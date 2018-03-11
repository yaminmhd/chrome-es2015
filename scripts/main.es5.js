'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StickyNotesApp = function () {
  //init sticky notes app
  function StickyNotesApp() {
    var _this = this;

    _classCallCheck(this, StickyNotesApp);

    this.notesContainer = document.getElementById('notes-container');
    this.noteMessageInput = document.getElementById('message');
    this.addNoteButton = document.getElementById('save');
    this.notesSectionTitle = document.getElementById('notes-section-title');

    // Saves notes on button click.
    this.addNoteButton.addEventListener('click', function () {
      return _this.saveNote();
    });

    // Toggle for the button.
    this.noteMessageInput.addEventListener('keyup', function () {
      return _this.toggleButton();
    });

    // Loads all the notes.
    for (var key in localStorage) {
      this.displayNote(key, localStorage[key]);
    }
    //listen for updates to notes from other windows
    window.addEventListener('storage', function (e) {
      return _this.displayNote(e.key, e.newValue);
    });
  }

  //saves a new sticky note on localstorage


  _createClass(StickyNotesApp, [{
    key: 'saveNote',
    value: function saveNote(element) {
      if (this.noteMessageInput.value) {
        var key = Date.now().toString();
        localStorage.setItem(key, this.noteMessageInput.value);
        this.displayNote(key, this.noteMessageInput.value);
        this.resetMaterialTextField(this.noteMessageInput);
        this.toggleButton();
      }
    }

    //resets the given MaterialTextField

  }, {
    key: 'resetMaterialTextField',
    value: function resetMaterialTextField(element) {
      element.value = '';
      element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
      element.blur();
    }

    //creates/updates/deletes a note in the UI

  }, {
    key: 'displayNote',
    value: function displayNote(key, message) {
      var note = document.getElementById(key);
      // If no element with the given key exists we create a new note.
      if (!note) {
        note = document.createElement('sticky-note');
        note.id = key;
        this.notesContainer.insertBefore(note, this.notesSectionTitle.nextSibling);
      }
      // If the message is null we delete the note.
      if (!message) {
        return note.deleteNote();
      }
      note.setMessage(message);
    }

    //enables or disables the submit button depending on the values of the input

  }, {
    key: 'toggleButton',
    value: function toggleButton() {
      if (this.noteMessageInput.value) {
        this.addNoteButton.removeAttribute('disabled');
      } else {
        this.addNoteButton.setAttribute('disabled', 'true');
      }
    }
  }]);

  return StickyNotesApp;
}();

//on load start the app


window.addEventListener('load', function () {
  return new StickyNotesApp();
});

var StickyNote = function (_HTMLElement) {
  _inherits(StickyNote, _HTMLElement);

  function StickyNote() {
    _classCallCheck(this, StickyNote);

    return _possibleConstructorReturn(this, (StickyNote.__proto__ || Object.getPrototypeOf(StickyNote)).apply(this, arguments));
  }

  _createClass(StickyNote, [{
    key: 'createdCallback',

    //fires when an instance of the element is created
    value: function createdCallback() {
      var _classList,
          _this3 = this;

      (_classList = this.classList).add.apply(_classList, _toConsumableArray(StickyNote.CLASSES));
      this.innerHTML = StickyNote.TEMPLATE;
      this.messageElement = this.querySelector('.message');
      this.dateElement = this.querySelector('.date');
      this.deleteButton = this.querySelector('.delete');
      this.deleteButton.addEventListener('click', function () {
        return _this3.deleteNote();
      });
    }
  }, {
    key: 'attributeChangedCallback',


    //fires when an attribute of the element is added/deleted/modified
    value: function attributeChangedCallback(attributeName) {
      // We display/update the created date message if the id changes.
      if (attributeName == 'id') {
        var date = void 0;
        // if (this.id) {

        // } else {
        //   date = new Date();
        // }
        var dateFormatterOptions = { day: 'numeric', month: 'short' };
        var shortDate = new Intl.DateTimeFormat("en-US", dateFormatterOptions).format(date);
        this.dateElement.textContent = 'Created on ' + shortDate;
      }
    }

    //sets the message of the note

  }, {
    key: 'setMessage',
    value: function setMessage(message) {
      this.messageElement.textContent = message;
      // Replace all line breaks by <br>.
      this.messageElement.innerHTML = this.messageElement.innerHTML.replace(/\n/g, '<br>');
    }

    //deletes the note by removing the element from the DOM and the data from
    //the local storage

  }, {
    key: 'deleteNote',
    value: function deleteNote() {
      localStorage.removeItem(this.id);
      this.parentNode.removeChild(this);
    }
  }]);

  return StickyNote;
}(HTMLElement);

//initial content of the element


StickyNote.TEMPLATE = '\n  <div class="message"></div>\n  <div class="date"></div>\n  <button class="delete mdl-button mdl-js-button mdl-js-ripple-effect">\n   \'Delete\'\n  </button>';

//StickyNote elements top level style classes
StickyNote.CLASSES = ['mdl-cell--4-col-desktop', 'mdl-card__supporting-text', 'mdl-cell--12-col', 'mdl-shadow--2dp', 'mdl-cell--4-col-tablet', 'mdl-card', 'mdl-cell', 'sticky-note'];

//list of shortened month names
StickyNote.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

document.registerElement('sticky-note', StickyNote);

//# sourceMappingURL=main.es5.js.map