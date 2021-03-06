class StickyNotesApp {
  //init sticky notes app
  constructor(){
    this.notesContainer = document.getElementById('notes-container');
    this.noteMessageInput = document.getElementById('message');
    this.addNoteButton = document.getElementById('save');
    this.notesSectionTitle = document.getElementById('notes-section-title');

    // Saves notes on button click.
    this.addNoteButton.addEventListener('click', () => this.saveNote());

    // Toggle for the button.
    this.noteMessageInput.addEventListener('keyup', ()=> this.toggleButton());

    // Loads all the notes.
    for (let key in localStorage) {
    this.displayNote(key, localStorage[key]);
    }
    //listen for updates to notes from other windows
    window.addEventListener('storage', e=> this.displayNote(e.key, e.newValue))
  }

  //saves a new sticky note on localstorage
  saveNote(element){
    if (this.noteMessageInput.value) {
      let key = Date.now().toString();
      localStorage.setItem(key, this.noteMessageInput.value);
      this.displayNote(key, this.noteMessageInput.value);
      this.resetMaterialTextField(this.noteMessageInput);
      this.toggleButton();
    }
  }

  //resets the given MaterialTextField
  resetMaterialTextField(element) {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
    element.blur();
  }

  //creates/updates/deletes a note in the UI
  displayNote(key,message){
    let note = document.getElementById(key);
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
  toggleButton(){
    if (this.noteMessageInput.value) {
      this.addNoteButton.removeAttribute('disabled');
    } else {
      this.addNoteButton.setAttribute('disabled', 'true');
    }
  }
}

 //on load start the app
 window.addEventListener('load', () => new StickyNotesApp());

class StickyNote extends HTMLElement{
  //fires when an instance of the element is created
  createdCallback(){
    this.classList.add(...StickyNote.CLASSES);
    this.innerHTML = StickyNote.TEMPLATE;
    this.messageElement = this.querySelector('.message');
    this.dateElement = this.querySelector('.date');
    this.deleteButton = this.querySelector('.delete');
    this.deleteButton.addEventListener('click', () => this.deleteNote());
  };

  //fires when an attribute of the element is added/deleted/modified
  attributeChangedCallback(attributeName){
    // We display/update the created date message if the id changes.
    if (attributeName == 'id') {
      let date;
      // if (this.id) {

      // } else {
      //   date = new Date();
      // }
      let dateFormatterOptions = {day: 'numeric', month: 'short'};
      let shortDate = new Intl.DateTimeFormat("en-US", dateFormatterOptions).format(date);
      this.dateElement.textContent = `Created on ${shortDate}`
    }
  }

  //sets the message of the note
  setMessage(message){
    this.messageElement.textContent = message;
    // Replace all line breaks by <br>.
    this.messageElement.innerHTML = this.messageElement.innerHTML.replace(/\n/g, '<br>');
  }

  //deletes the note by removing the element from the DOM and the data from
  //the local storage
  deleteNote(){
    localStorage.removeItem(this.id);
    this.parentNode.removeChild(this);
  }
}

 //initial content of the element
 StickyNote.TEMPLATE =`
  <div class="message"></div>
  <div class="date"></div>
  <button class="delete mdl-button mdl-js-button mdl-js-ripple-effect">
   'Delete'
  </button>`;

 //StickyNote elements top level style classes
 StickyNote.CLASSES =['mdl-cell--4-col-desktop', 'mdl-card__supporting-text', 'mdl-cell--12-col',
  'mdl-shadow--2dp', 'mdl-cell--4-col-tablet', 'mdl-card', 'mdl-cell', 'sticky-note'];

 //list of shortened month names
 StickyNote.MONTHS =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


 document.registerElement('sticky-note', StickyNote);

