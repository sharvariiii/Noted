// Name: manage.js 
// Description: Linked with manage.html to handle events

document.addEventListener('DOMContentLoaded', function () {
  const noteListContainer = document.getElementById('noteList');
  const addButton = document.getElementById('addButton');
  const nicknameInput = document.getElementById('nickname');
  const valueInput = document.getElementById('value');
  const shortcutInput = document.getElementById('shortcut');

  // Load existing notes from local storage
  chrome.storage.local.get({ notes: [] }, function (result) {
    const notes = result.notes;

    // Display existing notes
    displayNotes(notes);
  });

  // Add event listener for the "Add Note" button
  addNoteButton.addEventListener('click', function () {
    // Get the values from the input fields
    const nickname = nicknameInput.value;
    const value = valueInput.value;
    const shortcut = shortcutInput.value;

    // Validate inputs
    if (nickname.trim() !== '' && value.trim() !== '' && shortcut.trim() !== '') {
      // Retrieve existing notes from local storage
      chrome.storage.local.get({ notes: [] }, function (result) {
        const existingNotes = result.notes;

        // Create a new note object
        const newNote = { nickname, value, shortcut };

        // Add the new note to the array of existing notes
        existingNotes.push(newNote);

        // Save the updated notes array back to local storage
        chrome.storage.local.set({ notes: existingNotes }, function () {
          // Display the updated notes
          displayNotes(existingNotes);

          // Clear the input fields after adding the note
          nicknameInput.value = '';
          valueInput.value = '';
          shortcutInput.value = '';
        });
      });
    }
  });

  // Function to display notes in the UI
  function displayNotes(notes) {
    noteListContainer.innerHTML = ''; // Clear existing content

    if (notes.length === 0) {
      noteListContainer.innerHTML = '<p>No notes available.</p>';
    } else {
      notes.forEach(function (note, index) {
        // Create card element
        const card = document.createElement('div');
        card.className = 'card fixed block';

        // Create heading with note text
        const heading = document.createElement('h2');
        heading.textContent = note.nickname;
        card.appendChild(heading);

        // Create paragraph with additional note details
        const paragraph = document.createElement('p');
        paragraph.textContent = `Value: ${note.value}, Shortcut: ${note.shortcut}`;
        card.appendChild(paragraph);

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'block';
        deleteButton.textContent = 'Delete';

        // Add event listener to delete button
        deleteButton.addEventListener('click', function () {
          deleteNote(index);
        });

        card.appendChild(deleteButton);

        // Append the card to the noteListContainer
        noteListContainer.appendChild(card);
      });
    }
  }

  // Function to delete a note
  function deleteNote(index) {
    // Retrieve existing notes from local storage
    chrome.storage.local.get({ notes: [] }, function (result) {
      const existingNotes = result.notes;

      // Remove the note at the specified index
      existingNotes.splice(index, 1);

      // Save the updated notes array back to local storage
      chrome.storage.local.set({ notes: existingNotes }, function () {
        // Display the updated notes
        displayNotes(existingNotes);
      });
    });
  }
});

 

