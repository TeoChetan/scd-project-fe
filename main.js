import { addEvents, handleSearch } from './utils';
import { data } from 'autoprefixer';
import { addLoader, removeLoader } from './loader';
import { createOrderItem } from './createOrderItem';
import { createEventElement } from './createEventElement';
// Initialization for ES Users
import {
  Carousel,
  initTE,
} from "tw-elements";
initTE({ Carousel })


let events = null;


// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
  <div id="content" class="relative">
  <!-- Carousel container -->
  <div class="slider-container relative w-2/3 mx-auto overflow-hidden">
    <!-- Slides -->
    <div class="carousel-slide">
      <img src="./src/assets/electric.jpg" class="images-style block w-full" alt="Wild Landscape" />
    </div>
    <div class="carousel-slide ">
      <img src="./src/assets/Wine festival.jpg" class="images-style block w-full" alt="Camera" />
    </div>
    <div class="carousel-slide ">
      <img src="./src/assets/untold.jpg" class="images-style block w-full" alt="Exotic Fruits" />
    </div>
  </div>

  <!-- Carousel controls -->
  <button class="carousel-control prev hidden" type="button">
    <span class="inline-block h-8 w-8">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </span>
    <span class="hidden">Previous</span>
  </button>
  <button class="carousel-control next hidden" type="button">
    <span class="inline-block h-8 w-8">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </span>
    <span class="hidden">Next</span>
  </button>
</div>

  <hr>
    <div class="paragraph-container">
      <h1 >About Us</h1>
      <p>Welcome to our Ticket Category System, your one-stop destination for a seamless event ticketing experience.
        Discover a diverse range of ticket categories tailored to your interests, making event selection a breeze.
        From VIP access to family-friendly options, explore a variety of event types and pricing tiers.
        Browse, compare, and secure your tickets hassle-free, ensuring unforgettable moments for every occasion. 
        Join us and elevate your event experience with our user.</p>
    </div>
  <hr>
    <div class="events-tc-title">
      <div class="searchBar-events relative flex items-center">
        <h1 class="events-tc-title">Available Events </h1>
        <input
          id="searchInput"
          type="text"
          class="px-4 py-2 rounded-full text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Search Events"
        />
        <i class="search-bar-logo fas fa-search"></i>

        <!-- <button
          class="search-logo-btn absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          id="searchBtn"
          aria-label="Search"
        >
        </button> -->
      </div>
    </div>
    

      <div class="events flex items-center justify-center flex-wrap"/>
        
    `;
}

document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  let currentIndex = 0;
  let autoSlideInterval; 
  const autoSlideDelay = 3000; 

  
  function showSlide(index) {
      slides.forEach((slide, i) => {
          if (i === index) {
              slide.classList.remove('hidden');
              slide.classList.add('block');
          } else {
              slide.classList.remove('block');
              slide.classList.add('hidden');
          }
      });
  }

  function slidePrev() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
  }

  function slideNext() {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
  }

  function startAutoSlide() {
      autoSlideInterval = setInterval(slideNext, autoSlideDelay);
  }

  function stopAutoSlide() {
      clearInterval(autoSlideInterval);
  }

  if (prevBtn) {
      prevBtn.addEventListener('click', () => {
          stopAutoSlide();
          slidePrev();
          startAutoSlide();
      });
  }

  if (nextBtn) {
      nextBtn.addEventListener('click', () => {
          stopAutoSlide();
          slideNext();
          startAutoSlide();
      });
  }

  showSlide(currentIndex);
  startAutoSlide();
});


function getOrdersPageTemplate() {
  return `
      <div id="content" class="hidden">
        <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
        <div class="purchases ml-6 mr-6">
          <div class="bg-white px-4 py-3 gap-x-4 flex font-bold">
            <span class="flex-1">Name</span>
            <span class="flex-1 flex justify-start">Number of tickets</span>
            <span class="flex-1">Category</span>
            <span class="flex-1 hidden md:flex">Date</span>
            <span class="w-12 text-center hidden md:flex">Price</span>
            <span class="w-28 sm:w-8"></span>
          </div>
        </div>
      </div>
  `;  
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  setupFilterEvents();
  addLoader();

  fetchTicketEvents()
    .then((data) => {
      events = data;
      setTimeout(() => {
        removeLoader();
        
      }, 200);
      addEvents(events);
    });
}


function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  const purchasesDiv = document.querySelector('.purchases');
  addLoader();

  if (purchasesDiv) {
    fetchOrders()
      .then((orders) => {
        if (orders.length > 0) {
          setTimeout(() => {
            removeLoader();
          }, 200);
          orders.forEach((order) => {
            const newOrder = createOrderItem(categories, order);
            purchasesDiv.appendChild(newOrder);
          });
        } else {
          removeLoader();
        }
      });
  }
}
// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage();
  }
}



async function fetchTicketEvents() {
  const response = await fetch('https://localhost:7260/api/Event/GetAll');
  const data = await response.json();
  console.log(data);
  return data;
}


async function fetchOrders() {
  const response = await fetch('http://localhost:8080/orders');
  const orders = await response.json();
  return orders;
}

function renderEvents(events) {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML = '';

  events.forEach(event => {
    const eventElement = createEventElement(event);
    eventsContainer.appendChild(eventElement);
  });
}

function liveSearch() {
  const filterInput = document.querySelector('#searchInput');

  if(filterInput) {
    const searchValue = filterInput.value;
    
    if(searchValue !== undefined) {
      const filteredEvents = events.filter(event => event.eventName.toLowerCase().includes(searchValue.toLowerCase())
      );
      addEvents(filteredEvents);
    }
  }
}

function setupFilterEvents() {
  const nameFilterInput = document.querySelector('#searchInput');

  if(nameFilterInput) {
    const filterInterval = 500;
    nameFilterInput.addEventListener('keyup', () => {
      setTimeout(liveSearch, filterInterval);
    });
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
setupFilterEvents();
