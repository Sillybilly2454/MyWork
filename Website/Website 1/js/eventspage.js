// the selector
let monthSelect = document.getElementById("selectFilterMonth");
monthSelect.addEventListener("input", filterAndSortEvents);

// the selector
let yearSelect = document.getElementById("selectFilterYear");
yearSelect.addEventListener("input", filterAndSortEvents);

const sortModeSelect = document.getElementById("sortMode");
sortModeSelect.addEventListener("input", sortEvents);

// clear filter button
let clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearFilter);

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', filterAndSortEvents);

const noResultsText = document.getElementById('no-results');

let list = document.querySelector('#events');


// the events in the document
let eventList = document.getElementsByClassName("event");

function filterAndSortEvents() {
   filterEvents();
   sortEvents();
 }
      
// filters the event based on the filter term
function filterEvents (uiEvent) {
   
   const searchQuery = searchBar.value.toLowerCase();

   let hasResults = false;

   // go through the list
   for (let i = 0; i < eventList.length; i++) {
      // does the event ID contain the filterTerm and if theres stuff in the search bar does the title contain it
      if (eventList[i].id.includes(monthSelect.value) && eventList[i].id.includes(yearSelect.value) && (searchQuery == "" || eventList[i].querySelector("h4").textContent.toLocaleLowerCase().includes(searchQuery.toLowerCase()))) {
         // yes - show
         eventList[i].style.display = "block";
         hasResults = true;
      } else  {
         // no - hide
         eventList[i].style.display = "none";
      }
   }

   // If there were results hide no results text, and if there werent any results show the no results text
   if(hasResults) {
      noResultsText.style.display = "none";
    } else {
      noResultsText.style.display = "block";
    }
}

function sortEvents() {
  const sortMode = sortModeSelect.value;

  const searchQuery = searchBar.value.toLowerCase();

  const eventListArray = Array.from(eventList);

  if (sortMode == 'relevancy') {
   eventListArray.sort((a, b) => {
      const titleA = a.querySelector("h4").textContent.toLowerCase();
      const titleB = b.querySelector("h4").textContent.toLowerCase();

      // Calculate relevance scores for items based on title
      const relevanceA = calculateRelevance(titleA, searchQuery);
      const relevanceB = calculateRelevance(titleB, searchQuery);

      return relevanceB - relevanceA; // Sort by relevance (high to low)
    });
  } else if (sortMode == 'oldtonew') {
   eventListArray.sort((a, b) => {
      const dateA = new Date(a.id);
      const dateB = new Date(b.id);
      return dateA - dateB;
    });
  } else if (sortMode == 'newtoold') {
   eventListArray.sort((a, b) => {
      const dateA = new Date(a.id);
      const dateB = new Date(b.id);
      return dateB - dateA;
    });
  }

  eventListArray.forEach(item => {
    list.appendChild(item);
  });
}

filterAndSortEvents();
  
// clears the filter and shows all events
function clearFilter (uiEvent) {
    // all events contain the "-" symbol
    monthSelect.value = "-";

    // all events contain the "-" symbol
    yearSelect.value = "-";

    sortModeSelect.value = "relevancy";

    filterAndSortEvents();
 }

 // Calculate relevance score for an item based on title and search query
function calculateRelevance(title, searchQuery) {
   let relevance = 0;
 
   // Split the title into words
   const titleWords = title.split(' ');
 
   for (const word of titleWords) {
     if (word.includes(searchQuery)) {
       relevance++;
     }
   }
 
   return relevance;
 }


 // Code below is to open and close the filters settings with the button
const filtersButton = document.getElementById("filters-button");
filtersButton.addEventListener("click", expandCloseFilters);

const filterControls = document.getElementById("filter-Controls");

let filtersOpen = false;
function expandCloseFilters() {
  if(filtersOpen == true) {
    filterControls.style.display = "block";
  } else {
    filterControls.style.display = "none";
  }

  filtersOpen = !filtersOpen;
}

expandCloseFilters();