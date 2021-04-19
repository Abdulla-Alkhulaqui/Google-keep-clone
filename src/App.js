let saveBtn = document.getElementById("save-btn");
//setting the keep notes item in the local strge if it does not already exist
if (localStorage.getItem("keep-notes") == null) {
  localStorage.setItem("keep-notes", "[]");
}
//getting the notes in the local storge
let noteList = JSON.parse(localStorage.getItem("keep-notes"));
console.log(noteList);

saveBtn.addEventListener("click", () => {
  let newNoteTitle = document.getElementById("note-title").value;
  let newNoteText = document.getElementById("note-text").value;
  let newNote = {};

  let emptyInputs =
    newNoteText.trim().length == 0 || newNoteTitle.trim().length == 0;

  if (!emptyInputs) {
    newNote.title = newNoteTitle;
    newNote.text = newNoteText;

    noteList.push(newNote);
    updateLocalStorge();
    document.getElementById("note-title").value = "";
    document.getElementById("note-text").value = "";
  }
});

let deleteBtnsEventListner = () => {
  let deleteBtns = document.getElementsByClassName("delete-btn");

  [...deleteBtns].forEach((btn) => {
    btn.addEventListener("click", () => {
      let elementTitle = btn.parentNode.parentNode.getElementsByTagName("h4")[0]
        .innerHTML;
      let elementText = btn.parentNode.parentNode.getElementsByTagName("p")[0]
        .innerHTML;
      deleteNote(elementTitle, elementText);
    });
  });
};

let updateLocalStorge = () => {
  localStorage.setItem("keep-notes", JSON.stringify(noteList));
  renderNotes();
};

let renderNotes = () => {
  let noteContainer = document.getElementsByClassName("notes-container")[0];
  noteContainer.innerHTML = "";
  if (noteList.length !== 0) {
    noteList.map((note) => {
      console.log(note.text);
      noteContainer.innerHTML += `
      <div class="note-element-container">
        <div class="note-element" onClick="lightBoxEventLister(this);">
          <div class="note-title">
            <h4>${note.title}</h4>
          </div>
          <div class="note-text">
            <p>${
              note.text.length > 120
                ? note.text.slice(0, 120) + "..."
                : note.text
            }</p>
          </div>
        </div>
        <div class="delete-btn-container">
          <i class="far fa-trash-alt delete-btn"></i>
        </div>
      </div>
        `;
    });
    deleteBtnsEventListner();
  }
};
let deleteNote = (title, note) => {
  noteList.forEach((element, index) => {
    let flag = note.length > 120;

    if (flag) {
      if (
        note.slice(0, 120) == element.text.slice(0, 120) &&
        element.title == title
      ) {
        noteList.splice(index, 1);
        updateLocalStorge();
      }
    } else if (element.title == title && element.text == note) {
      noteList.splice(index, 1);
      updateLocalStorge();

      for (let i = 0, j = str.length; i < j; i++, j--) {
        if (str[i] != str[j]) return false;
      }
      return true;
    }
  });
};

const lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);
// let lightbox = document.getElementById("lightbox");

let lightBoxEventLister = (e) => {
  let noteTitle = e.getElementsByTagName("h4")[0].innerHTML;
  let noteText = e.getElementsByTagName("p")[0].innerHTML;
  let flag = noteText.length > 120;

  if (flag) {
    noteList.map((note) => {
      if (note.text.slice(0, 120) == noteText.slice(0, 120)) {
        noteText = note.text;
      }
    });
  }
  lightbox.classList.add("active");
  /*   while (lightbox.firstChild) {
      lightbox.removeChild(lightbox.firstChild);
    } */
  lightbox.innerHTML = `
    <div class="note-element">
      <div class="title-input">
            <input type="text" id="note-title-lightbox" placeholder="Title" value="${noteTitle}" />
      </div>
      <div class="note-input">
        <textarea
          name="note"
          placeholder="Take a note..."
          cols="30"
          rows="10"
          id="note-text-lightbox"
        >${noteText}</textarea>
      </div>
      <div class="save-btn-container">
        <div class="save-note-btn"><button id="save-btn">Save</button></div>
      </div>
    </div> 
    `;

  lightbox.addEventListener("click", (r) => {
    if (r.target !== r.currentTarget) return;

    let newNoteTitle = document.getElementById("note-title-lightbox").value;
    let newNoteText = document.getElementById("note-text-lightbox").value;

    noteList.forEach((element, index) => {
      if (element.title == noteTitle && element.text == noteText) {
        element.title = newNoteTitle;
        element.text = newNoteText;
        updateLocalStorge();
      }
    });

    e.getElementsByTagName("h4")[0].innerHTML = newNoteTitle;
    e.getElementsByTagName("p")[0].innerHTML = newNoteText;
    lightbox.classList.remove("active");
  });
};

window.addEventListener("load", () => {
  renderNotes();
});
