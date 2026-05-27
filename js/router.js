let pageUrls = {
  about: '/index.html?about',
  contact: '/index.html?contact',
  gallery: '/index.html?gallery'
};

function OnStartUp() {
  popStateHandler();
}
OnStartUp();

document.querySelector('#about-link').addEventListener('click', (event) => {
  let stateObj = { page: 'about' };
  document.title = 'O mnie';
  history.pushState(stateObj, "about", "?about");
  RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', (event) => {
  let stateObj = { page: 'contact' };
  document.title = 'Kontakt';
  history.pushState(stateObj, "contact", "?contact");
  RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', (event) => {
  let stateObj = { page: 'gallery' };
  document.title = 'Galeria';
  history.pushState(stateObj, "gallery", "?gallery");
  RenderGalleryPage();
});

function RenderAboutPage() {
  document.querySelector('main').innerHTML = `
    <h1 class="title">O mnie</h1>
    <p>Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym...</p>`;
}

function RenderContactPage() {
  document.querySelector('main').innerHTML = `
    <h1 class="title">Kontakt</h1>
    <form id="contact-form">
      <label for="name">Imię:</label>
      <input type="text" id="name" name="name" required>
      <label for="email">E-mail:</label>
      <input type="email" id="email" name="email" required>
      <label for="message">Wiadomość:</label>
      <textarea id="message" name="message" required></textarea>
      <button type="submit">Wyślij</button>
    </form>`;

  document.getElementById('contact-form').addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Formularz wysłany!');
  });
}

function RenderGalleryPage() {
  document.querySelector('main').innerHTML = `
    <h1 class="title">Galeria</h1>
    <div class="gallery-grid" id="gallery-grid"></div>
    <div id="modal" class="modal">
      <span class="modal-close" id="modal-close">&times;</span>
      <img id="modal-img" src="">
    </div>`;

  const grid = document.getElementById('gallery-grid');
  const imageUrls = Array.from({length: 9}, (_, i) => `https://picsum.photos/400/400?random=${i}`);

  imageUrls.forEach(url => {
    const img = document.createElement('img');
    img.dataset.src = url;
    img.className = 'lazy';
    grid.appendChild(img);
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        fetch(img.dataset.src)
          .then(res => res.blob())
          .then(blob => {
            img.src = URL.createObjectURL(blob);
            img.classList.remove('lazy');
          });
        obs.unobserve(img);
      }
    });
  });

  document.querySelectorAll('.lazy').forEach(img => observer.observe(img));

  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');

  grid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      modal.style.display = 'flex';
      modalImg.src = e.target.src;
    }
  });

  document.getElementById('modal-close').addEventListener('click', () => modal.style.display = 'none');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

function popStateHandler() {
  let loc = window.location.href.toString().split(window.location.host)[1];
  if (loc === pageUrls.contact) { RenderContactPage(); }
  if (loc === pageUrls.about) { RenderAboutPage(); }
  if (loc === pageUrls.gallery) { RenderGalleryPage(); }
}
window.onpopstate = popStateHandler;

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});