//#region Price Slider

// Tutorial used to help make code in this region:
//Coding Artist (7 June 2021) Double Range Slider | HTML, CSS, Javascript | With Source Code [video], Coding Artist, YouTube, accessed 6 September 2023. https://www.youtube.com/watch?v=DfSYmk_6vk8

window.onload = function(){
   slideOne();
   slideTwo();
   filterAndSortEvents();
}

let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let displayValOne = document.getElementById("range1");
let displayValTwo = document.getElementById("range2");
let minGap = 10;
let sliderTrack = document.querySelector(".slider-track");
let sliderMaxValue = document.getElementById("slider-1").max;

function slideOne(){
   if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
       sliderOne.value = parseInt(sliderTwo.value) - minGap;
   }
   displayValOne.textContent = "$" + sliderOne.value;
   fillColor();
   filterEvents();
}
function slideTwo(){
   if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
       sliderTwo.value = parseInt(sliderOne.value) + minGap;
   }
   displayValTwo.textContent = "$" + sliderTwo.value;
   fillColor();
   filterEvents();
}
function fillColor(){
   percent1 = (sliderOne.value / sliderMaxValue) * 100;
   percent2 = (sliderTwo.value / sliderMaxValue) * 100;
   sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
}
//#endregion

//#region shopping cart

// Tutorial used to help make code in this region:
// Lun Dev Code (8 March 2023) Add To Cart Shopping using HTML CSS and Javascript [video], Lun Dev Code, YouTube, accessed 7 September 2023. https://www.youtube.com/watch?v=bCTd1eRX7Iw


let openShopping = document.querySelector('#shoppingcart-button');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.body;
let total = document.querySelector('.total');

openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})
closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})


let products = [
  {
      id: 1,
      name: 'PowerStrike Soccer Jersey',
      // Jersey Nike Sleeve Adidas Shirt, soccer jerseys, tshirt, blue, sport png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-hjfrs
      image: 'jersey.png',
      rating: 4,
      price: 39,
      clothingType: 'jersey'
  },
  {
      id: 2,
      name: 'TurboFit Running Shoes',
      // Shoe Nike Free Air Force, Nike Shoes, image File Formats, fashion, outdoor Shoe png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-bhina
      image: 'shoes.png',
      rating: 3,
      price: 79,
      clothingType: 'shoes'
  },
  {
      id: 3,
      name: 'Champion\'s Pride Shorts',
      // T-shirt Shorts Adidas, Shorts s, blue, trunks, electric Blue png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-byxnd
      image: 'shorts.png',
      rating: 4,
      price: 29,
      clothingType: 'shorts'
  },
  {
      id: 4,
      name: 'StormGuard Sports Jacket',
      // Hoodie Jumper Clothing Sweater Jacket, jacket, adidas, hoodie, black png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-hslmf
      image: 'jacket.png',
      rating: 4,
      price: 59,
      clothingType: 'jacket'
  },
  {
      id: 5,
      name: 'PrecisionStrike Soccer Ball',
      // Football Ball game, Soccer Ball, soccer ball artwork, sport, sports Equipment, pallone png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-bbxrr
      image: 'other.png',
      rating: 5,
      price: 24,
      clothingType: 'other'
  },
  {
      id: 6,
      name: 'Victory Vibe Baseball Hat',
      // Baseball cap Hat Swim Caps, baseball cap, hat, black, clothing Accessories png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-xewju
      image: 'hat.png',
      rating: 4,
      price: 19,
      clothingType: 'hat'
  },
  {
      id: 7,
      name: 'ProFit Compression Leggings',
      // Football Ball game, Soccer Ball, soccer ball artwork, sport, sports Equipment, pallone png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-bbxrr
      image: 'other.png',
      rating: 3,
      price: 34,
      clothingType: 'other'
  },
  {
      id: 8,
      name: 'Team Spirit Fan Scarf',
      // Football Ball game, Soccer Ball, soccer ball artwork, sport, sports Equipment, pallone png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-bbxrr
      image: 'other.png',
      rating: 5,
      price: 14,
      clothingType: 'other'
  },
  {
      id: 9,
      name: 'EliteStriker Soccer Cleats',
      // Shoe Nike Free Air Force, Nike Shoes, image File Formats, fashion, outdoor Shoe png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-bhina
      image: 'shoes.png',
      rating: 4,
      price: 89,
      clothingType: 'shoes'
  },
  {
      id: 10,
      name: 'All-Star Basketball Jersey',
      // Jersey Nike Sleeve Adidas Shirt, soccer jerseys, tshirt, blue, sport png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-hjfrs
      image: 'jersey.png',
      rating: 3,
      price: 49,
      clothingType: 'jersey'
  },
  {
      id: 11,
      name: 'StealthRunner Performance Socks',
      // Football Ball game, Soccer Ball, soccer ball artwork, sport, sports Equipment, pallone png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-bbxrr
      image: 'other.png',
      rating: 4,
      price: 9,
      clothingType: 'other'
  },
  {
      id: 12,
      name: 'Goalkeeper\'s Pride Gloves',
      // Football Ball game, Soccer Ball, soccer ball artwork, sport, sports Equipment, pallone png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-bbxrr
      image: 'other.png',
      rating: 2,
      price: 29,
      clothingType: 'other'
  },
  {
      id: 13,
      name: 'Fanatic Fleece Hoodie',
      // Hoodie Jumper Clothing Sweater Jacket, jacket, adidas, hoodie, black png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-hslmf
      image: 'jacket.png',
      rating: 4,
      price: 44,
      clothingType: 'jacket'
  },
  {
      id: 14,
      name: 'TrainingGround Agility Cones',
      // Football Ball game, Soccer Ball, soccer ball artwork, sport, sports Equipment, pallone png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-bbxrr
      image: 'other.png',
      rating: 3,
      price: 14,
      clothingType: 'other'
  },
  {
      id: 15,
      name: 'Champion\'s Pride Backpack',
      // Football Ball game, Soccer Ball, soccer ball artwork, sport, sports Equipment, pallone png (n.d.) [photograph], PNGWING, accessed 13 September 2023. https://www.pngwing.com/en/free-png-bbxrr
      image: 'other.png',
      rating: 5,
      price: 39,
      clothingType: 'other'
  },
  {
    id: 16,
    name: 'Soccer Fusion Team Logo Shirt',
    // T SHIRT PNG BLACK SHIRT PNG TRANSPARENT IMAGE (4 August 2019) [photograph], FREEPNGLOGOS, accessed 13 September 2023. https://www.freepnglogos.com/images/t-shirt-10872.html
    image: 'shirt.png',
    rating: 4,
    price: 29,
    clothingType: 'shirt'
},
{
    id: 17,
    name: 'SportsMania Team Pride Shirt',
    // T SHIRT PNG BLACK SHIRT PNG TRANSPARENT IMAGE (4 August 2019) [photograph], FREEPNGLOGOS, accessed 13 September 2023. https://www.freepnglogos.com/images/t-shirt-10872.html
    image: 'shirt.png',
    rating: 1,
    price: 25,
    clothingType: 'shirt'
},
{
    id: 18,
    name: 'Goalkeeper Hero Shirt',
    // T SHIRT PNG BLACK SHIRT PNG TRANSPARENT IMAGE (4 August 2019) [photograph], FREEPNGLOGOS, accessed 13 September 2023. https://www.freepnglogos.com/images/t-shirt-10872.html
    image: 'shirt.png',
    rating: 3,
    price: 32,
    clothingType: 'shirt'
}
];


let listCards  = [];
function initApp(){
    products.forEach((value, key) =>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        
        newDiv.setAttribute('data-rating', value.rating);
        newDiv.setAttribute('data-price', value.price);
        newDiv.setAttribute('data-title', value.name);
        newDiv.setAttribute('data-clothingType', value.clothingType);

        newDiv.innerHTML = `
            <img src="images/Products/${value.image}">
            <div class="title">${value.name}</div>
            <div class="rating">${generateStars(value.rating)}</div>
            <div class="price">$${value.price.toLocaleString()}</div>
            <button onclick="addToCard(${key})">Add To Card</button>`;
        list.appendChild(newDiv);
    })
}
initApp();

// Function is used to turn the rating from a number value to a string of the amount of stars
function generateStars(rating) {
  const starSymbol = '★';
  let stars = '';
  for (let i = 0; i < rating; i++) {
      stars += starSymbol;
  }
  return stars;
}



function addToCard(key){
    if(listCards[key] == null){
        // copy product form list to list card
        listCards[key] = JSON.parse(JSON.stringify(products[key]));
        listCards[key].quantity = 1;
    } else {
      changeQuantity(key, listCards[key].quantity + 1)
    }
    reloadCard();
}

function reloadCard(){
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCards.forEach((value, key)=>{
    totalPrice = totalPrice + value.price;
    count = count + value.quantity;
    if(value != null){
        let newDiv = document.createElement('li');
        newDiv.innerHTML = `
            <div><img src="images/Products/${value.image}"/></div>
            <div>${value.name}</div>
            <div>$${value.price.toLocaleString()}</div>
            <div>
                <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                <div class="count">${value.quantity}</div>
                <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
            </div>`;
            listCard.appendChild(newDiv);
        }
    })
    total.innerText = "$" + totalPrice.toLocaleString();
}

function changeQuantity(key, quantity){
    if(quantity == 0){
        delete listCards[key];
    }else{
        listCards[key].quantity = quantity;
        listCards[key].price = quantity * products[key].price;
    }
    reloadCard();
}

//#endregion

//#region Filtering And sorting shop

// clear filter button
const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearFilterAndSort);

// the selector
const clothingTypeSelect = document.getElementById("selectFilterClothingType");
clothingTypeSelect.addEventListener("input", filterEvents);

// the selector
const sortModeSelect = document.getElementById("sortMode");
sortModeSelect.addEventListener("input", sortEvents);

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', filterAndSortEvents);

const noResultsText = document.getElementById('no-results');

const storeItemList = document.getElementsByClassName("item");

function filterAndSortEvents() {
  filterEvents();
  sortEvents();
}


// clears the filter and sorts all events
function clearFilterAndSort (uiEvent) {

   clothingTypeSelect.value = "-";

   sortModeSelect.value = "relevancy";

   sliderOne.value = 0;
   slideOne();
   sliderTwo.value = 150;
   slideTwo();

   filterAndSortEvents();
}

// filters the event based on the filter term
function filterEvents () {
  const searchQuery = searchBar.value.toLowerCase();

  let hasResults = false;

  for (let i = 0; i < storeItemList.length; i++) {
    let price = parseInt(storeItemList[i].getAttribute("data-price"));

    storeItemList[i].style.display = "none";

    if(clothingTypeSelect.value != "-" && !storeItemList[i].getAttribute("data-clothingType").includes(clothingTypeSelect.value)) {
      continue;
    } 

    if(price < sliderOne.value || price > sliderTwo.value) {
      continue;
    }

    if(searchQuery != "" && !storeItemList[i].getAttribute("data-title").toLocaleLowerCase().includes(searchQuery.toLowerCase())) {
      continue;
    }

    storeItemList[i].style.display = "block";
    hasResults = true;
  }

  if(hasResults) {
    noResultsText.style.display = "none";
  } else {
    noResultsText.style.display = "block";
  }
}


function sortEvents() {
  const sortMode = sortModeSelect.value;

  const searchQuery = searchBar.value.toLowerCase();

  // Convert storeItemList (a list) to an array
  const itemListArray = Array.from(storeItemList);

  if (sortMode == 'relevancy') {
    itemListArray.sort((a, b) => {
      const titleA = a.getAttribute("data-title").toLowerCase();
      const titleB = b.getAttribute("data-title").toLowerCase();

      // Calculate relevance scores for items based on title
      const relevanceA = calculateRelevance(titleA, searchQuery);
      const relevanceB = calculateRelevance(titleB, searchQuery);

      return relevanceB - relevanceA; // Sort by relevance (high to low)
    });
    
  } else if (sortMode == 'hightolow') {
    itemListArray.sort((a, b) => {
      const priceA = parseInt(a.getAttribute("data-price"));
      const priceB = parseInt(b.getAttribute("data-price"));
      return priceB - priceA; // Sort high to low
    });
  } else if (sortMode == 'lowtohigh') {
    itemListArray.sort((a, b) => {
      const priceA = parseInt(a.getAttribute("data-price"));
      const priceB = parseInt(b.getAttribute("data-price"));
      return priceA - priceB; // Sort low to high
    });
  } else if (sortMode == 'titleaz') {
    // Sort items by title in alphabetical order (A - Z)
    itemListArray.sort((a, b) => {
      const titleA = a.getAttribute("data-title").toLowerCase();
      const titleB = b.getAttribute("data-title").toLowerCase();
      return titleA.localeCompare(titleB);
    });
  } else if (sortMode == 'titleza') {
    // Sort items by title in reverse alphabetical order (Z - A)
    itemListArray.sort((a, b) => {
      const titleA = a.getAttribute("data-title").toLowerCase();
      const titleB = b.getAttribute("data-title").toLowerCase();
      return titleB.localeCompare(titleA);
    });
  } else if (sortMode == 'popularity') {
    // Sorting by popularity (rating) logic
    itemListArray.sort((a, b) => {
      const ratingA = parseInt(a.getAttribute("data-rating"));
      const ratingB = parseInt(b.getAttribute("data-rating"));
      return ratingB - ratingA; // Sort by popularity (high to low)
    });
  }

  itemListArray.forEach(item => {
    list.appendChild(item);
  });
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

//#endregion


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