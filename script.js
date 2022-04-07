'strict';

////////////////////////////////////
//// SCOLL INTO VIEW /////
const allLinks = document.querySelectorAll('a:link');

allLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const href = link.getAttribute('href');

    // Scroll back to top //

    if (href === '#')
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

    // Scroll to other links
    if (href !== '#' && href.startsWith('#')) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    }

    // close mobile nav
    // if (link.classList.contains('main-nav-link'))
    //   headerEl.classList.toggle('nav-open');
  });
});

//////////////////
// STICKY NAVIGATION

const sectionHeroEl = document.querySelector('.section-hero');

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    if (ent.isIntersecting === false) {
      document.body.classList.add('sticky');
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove('sticky');
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: '-80px',
  }
);
obs.observe(sectionHeroEl);

/////////////////////////////////////////////////
///// ABOUT SECTION: IMAGE SLIDER ///////////////

let slides = document.querySelectorAll('.slider-img');
let navLinks = document.querySelectorAll('.slider-dot');
const arrRight = document.querySelector('.arrow--right');
const arrLeft = document.querySelector('.arrow--left');

let curSlide = 0;

const changeSlide = function (mov) {
  if (mov >= slides.length) {
    mov = 0;
  }
  if (mov < 0) {
    mov = slides.length - 1;
  }

  slides[curSlide].classList.toggle('slide-active');
  slides[mov].classList.toggle('slide-active');
  navLinks[curSlide].classList.toggle('active');
  navLinks[mov].classList.toggle('active');

  curSlide = mov;
};

const slideTimer = function () {
  changeSlide(curSlide + 1);
  setTimeout(slideTimer, 5000);
};
slideTimer();

arrRight.addEventListener('click', () => {
  changeSlide(curSlide + 1);
});

arrLeft.addEventListener('click', () => {
  changeSlide(curSlide - 1);
});

document.querySelectorAll('.slider-dot').forEach((dot, dotIndex) => {
  dot.addEventListener('click', () => {
    if (curSlide !== dotIndex) {
      changeSlide(dotIndex);
    }
  });
});

//////////////////////////////////////////////////////////////
//////////// WEATHER APP ///////////////////////////////////

const options = {
  // Required: API key
  key: 'QbhAZx0YDpOGqyOdIi0eIasSRix05QWX', // REPLACE WITH YOUR KEY !!!

  // Put additional console output
  verbose: true,

  // Optional: Initial state of the map
  // lat: 26.9,
  // lon: 15.7,
  zoom: 10,
};

// 28°50'26.9"N 81°16'15.7"W

// Initialize Windy API
windyInit(options, (windyAPI) => {
  // windyAPI is ready, and contain 'map', 'store',
  // 'picker' and other usefull stuff

  const { map } = windyAPI;

  map.options.minZoom = 4;
  map.options.maxZoom = 17;

  var topLayer = L.tileLayer(
    'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        'Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, ',
      minZoom: 12,
      maxZoom: 17,
    }
  ).addTo(map);
  topLayer.setOpacity('0');

  map.on('zoomend', function () {
    if (map.getZoom() >= 12) {
      topLayer.setOpacity('.5');
    } else {
      topLayer.setOpacity('0');
    }
  });

  map.setView([28.838258, -81.267264], 12.5);
  // map.setZoom(12.5);

  L.marker([28.819167, -81.262017]).addTo(map).bindPopup('LMSA Ball');
  L.marker([28.818717, -81.264567]).addTo(map).bindPopup('Flag');
  L.marker([28.8355, -81.264]).addTo(map).bindPopup('Rum Mark');
  L.marker([28.83, -81.2525]).addTo(map).bindPopup('Gosling');
  L.marker([28.8214, -81.275133]).addTo(map).bindPopup('CM 12');
  L.marker([28.847517, -81.2486]).addTo(map).bindPopup('Manatee 1');
  L.marker([28.85335, -81.253533]).addTo(map).bindPopup('Manatee 2');
  L.marker([28.825017, -81.281617]).addTo(map).bindPopup('CM 10');
  L.marker([28.83135, -81.28655]).addTo(map).bindPopup('CM 8');
  L.marker([28.816733, -81.242767]).addTo(map).bindPopup('CM 2');
});

const center = document.querySelector('.center');
const conditions = document.querySelector('.conditions');

const forecast = async function () {
  const res = await fetch(
    'http://api.weatherapi.com/v1/current.json?key=1d86fe0989f945879c112630220802&q=32772&aqi=no'
  );
  const data = await res.json();
  console.log(data);
  console.log(data.current.gust_mph);
  let wind = {
    speed: data.current.wind_mph,
    gust: data.current.gust_mph,
    direction: data.current.wind_dir,
    heading: data.current.wind_degree,
  };

  const newHTML = `
    <div class="mod">
     <div class="wind">
      <p>CURRENT CONDITIONS</p>
      <p1>Wind Speed Mph: ${wind.speed}</p1>
      <p2>Wind Direction: ${wind.direction}</p2>
      <p3>Wind Gust Mph: ${wind.gust}</p3>
      <p4>Wind Heading: ${wind.heading}</p4>
     </div>
    </div>
  `;

  console.log(wind);
  conditions.insertAdjacentHTML('afterend', newHTML);
};
forecast();
