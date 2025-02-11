const characterID = document.getElementById('character-id');
const characterName = document.getElementById('character-name');
const size = document.getElementById('size');
const age = document.getElementById('age');
const bounty = document.getElementById('bounty');
const crewName = document.getElementById('crew-name');
const crewStatus = document.getElementById('crew-status');
const fruitName = document.getElementById('fruit-name');
const fruitDescription = document.getElementById('fruit-description');
const fruitImage = document.getElementById('fruit-image');
const characterInfo = document.getElementById('character-info');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const job = document.getElementById('job'); // Add job element to display job

const getCharacter = async () => {
  try {
    const characterNameOrId = searchInput.value.trim().toLowerCase(); // Convert input to lowercase and trim spaces

    // Fetch all characters from the API to search by name
    const charactersResponse = await fetch("https://api.api-onepiece.com/v2/characters/en");
    
    if (!charactersResponse.ok) {
      throw new Error('Error fetching characters');
    }

    const charactersData = await charactersResponse.json();

    // Find characters by partial match of name (case-insensitive)
    const matchedCharacter = charactersData.find(c =>
      c.name.toLowerCase().includes(characterNameOrId)
    );

    if (matchedCharacter) {
      // Fetch the character details using the found character's ID
      const characterResponse = await fetch(`https://api.api-onepiece.com/v2/characters/en/${matchedCharacter.id}`);
      
      if (characterResponse.ok) {
        const characterDetails = await characterResponse.json();

        // Display character information
        characterName.textContent = `${characterDetails.name}`;
        size.textContent = `Size: ${characterDetails.size}`;
        age.textContent = `Age: ${characterDetails.age.replace('ans', 'years')}`;
        bounty.textContent = `Bounty: ¥${characterDetails.bounty}`;

        // Crew information
        // crewName.textContent = `Crew: ${characterDetails.crew.name}`;
        // crewStatus.textContent = `Crew Status: ${characterDetails.crew.status}`;

        // Display job information if it exists
        job.textContent = `Job: ${characterDetails.job || 'No job specified'}`; // If no job, show "No job specified"

        // Check if the character has a fruit
        if (characterDetails.fruit) {
          // If the character has a fruit, display the fruit info
          fruitName.textContent = `Fruit: ${characterDetails.fruit.name}`;
          fruitDescription.textContent = `Description: ${characterDetails.fruit.description}`;
          fruitImage.src = characterDetails.fruit.filename;
          fruitImage.style.display = 'block'; // Ensure the image is visible
        } else {
          // If the character has no fruit, display "No fruit" and hide the image
          fruitName.textContent = `Fruit: No fruit`;
          fruitDescription.textContent = '';
          fruitImage.style.display = 'none'; // Hide the fruit image
        }

        // Show the character information card
        characterInfo.style.display = 'block';
      } else {
        // If unable to fetch character details, alert user
        alert('Failed to fetch character details.');
        resetDisplay();
      }
    } else {
      // If no character matches the search term
      alert('No character found with that name. Please try a different search term.');
      resetDisplay();
    }
  } catch (err) {
    // Handle error during fetch
    alert('An error occurred while searching for the character.');
    resetDisplay();
    console.error('Error fetching character:', err);
  }
};

const resetDisplay = () => {
  // Reset the character info display
  characterInfo.style.display = 'none';
  characterName.textContent = '';
  characterID.textContent = '';
  size.textContent = '';
  age.textContent = '';
  bounty.textContent = '';
  crewName.textContent = '';
  crewStatus.textContent = '';
  fruitName.textContent = '';
  fruitDescription.textContent = '';
  fruitImage.src = '';
  fruitImage.style.display = 'none'; // Hide the fruit image
  job.textContent = ''; // Reset job text
};

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  getCharacter();
});
