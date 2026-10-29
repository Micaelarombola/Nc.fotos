
document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // =====================================
  // UTILIDADES
  // =====================================

  const year = $("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const progress = $("scrollProgress");
  const header = $("header");

  function updateScroll() {
    const max =
      document.documentElement.scrollHeight - innerHeight;

    if (progress) {
      progress.style.width =
        `${max > 0 ? scrollY / max * 100 : 0}%`;
    }

    header?.classList.toggle("scrolled", scrollY > 40);
  }

  window.addEventListener("scroll", updateScroll, {
    passive: true
  });

  updateScroll();

  // =====================================
  // MENÚ
  // =====================================

  const menuBtn = $("menuBtn");
  const navigation = $("navigation");

  menuBtn?.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");

    menuBtn.textContent = open ? "×" : "☰";
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute(
      "aria-label",
      open ? "Cerrar menú" : "Abrir menú"
    );
  });

  navigation?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  // =====================================
  // PORTADA PRINCIPAL
  // =====================================

  const slides = [...document.querySelectorAll(".hero-slide")];
  let slideIndex = 0;

  function showSlide(index) {
    if (!slides.length) return;

    slideIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === slideIndex);
    });

    if ($("slideNumber")) {
      $("slideNumber").textContent =
        `${String(slideIndex + 1).padStart(2, "0")} / ` +
        `${String(slides.length).padStart(2, "0")}`;
    }
  }

  $("prevSlide")?.addEventListener("click", () => {
    showSlide(slideIndex - 1);
  });

  $("nextSlide")?.addEventListener("click", () => {
    showSlide(slideIndex + 1);
  });

  showSlide(0);

  if (slides.length > 1 && !reducedMotion) {
    setInterval(() => {
      if (!document.hidden) {
        showSlide(slideIndex + 1);
      }
    }, 6000);
  }

  // =====================================
  // ANIMACIONES DE SCROLL
  // =====================================

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08
    });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // =====================================
  // PORTFOLIO: FILTROS
  // =====================================

  const filterButtons = document.querySelectorAll(
    ".filters button"
  );

  const portfolioPhotos = [
    ...document.querySelectorAll(".photo")
  ];

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter;

      portfolioPhotos.forEach(photo => {
        photo.hidden =
          filter !== "todos" &&
          photo.dataset.category !== filter;
      });
    });
  });

  // =====================================
  // PORTFOLIO: VISOR
  // =====================================

  const lightbox = $("lightbox");
  const lightboxImage = $("lightboxImage");
  const lightboxCaption = $("lightboxCaption");

  let photoIndex = 0;
  let portfolioTrigger = null;

  function visiblePortfolioPhotos() {
    return portfolioPhotos.filter(photo => !photo.hidden);
  }

  function updatePortfolioViewer(index) {
    const items = visiblePortfolioPhotos();
    if (!items.length) return;

    photoIndex = (index + items.length) % items.length;

    const photo = items[photoIndex];
    const image = photo.querySelector("img");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightboxCaption.textContent =
      photo.dataset.title || "";
  }

  function openPortfolioViewer(photo) {
    portfolioTrigger = photo;

    updatePortfolioViewer(
      visiblePortfolioPhotos().indexOf(photo)
    );

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");
    $("closeLightbox").focus();
  }

  function closePortfolioViewer() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImage.removeAttribute("src");

    document.body.classList.remove("no-scroll");
    portfolioTrigger?.focus();
  }

  portfolioPhotos.forEach(photo => {
    photo.addEventListener("click", () => {
      openPortfolioViewer(photo);
    });
  });

  $("closeLightbox")?.addEventListener(
    "click",
    closePortfolioViewer
  );

  $("lightboxPrev")?.addEventListener("click", () => {
    updatePortfolioViewer(photoIndex - 1);
  });

  $("lightboxNext")?.addEventListener("click", () => {
    updatePortfolioViewer(photoIndex + 1);
  });

  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) {
      closePortfolioViewer();
    }
  });

  // =====================================
  // COMPARADOR DE FOTOGRAFÍAS
  // =====================================

  const compareRange = $("compareRange");
  const comparisonTop = $("comparisonTop");
  const comparisonLine = $("comparisonLine");
  const comparison = $("comparison");

  function updateComparison() {
    if (!compareRange) return;

    comparisonTop.style.width = `${compareRange.value}%`;
    comparisonLine.style.left = `${compareRange.value}%`;
  }

  function resizeComparison() {
    if (!comparison) return;

    const image = comparisonTop.querySelector("img");

    image.style.width = `${comparison.clientWidth}px`;
    image.style.height = `${comparison.clientHeight}px`;
  }

  compareRange?.addEventListener("input", updateComparison);
  window.addEventListener("resize", resizeComparison);

  updateComparison();
  resizeComparison();

  // =====================================
  // COLECCIONES FOTOGRÁFICAS
  // =====================================

  // Para agregar fotografías, escribí sus rutas
  // dentro de la colección correspondiente.

  const albums = {
    retratos: {
      title: "Retratos",
      description: "Miradas, expresiones y momentos que cuentan quién sos.",
      photos: [
        "img/3.jpg",
        "img/5.JPG",
        "img/18.jpg",
        "img/20.jpg",
        "img/21.jpg",
        "img/22.jpg",
        "img/23.jpg",
        "img/29.jpg",
        "img/30.jpg"
      ]
    },

    mascotas: {
      title: "Mascotas",
      description: "Pequeños gestos y grandes compañeros.",
      photos: [
        "img/7.jpg",
        "img/1.jpg",
        "img/2.jpg",
        "img/11.jpg",
        "img/17.jpg",
        "img/32.jpg"
      ]
    },

    eventos: {
      title: "Eventos",
      description: "Celebraciones, encuentros y recuerdos especiales.",
      photos: [
        "img/4.jpg"
      ]
    },

    arte: {
      title: "Arte y espectáculos",
      description: "Movimiento, emoción y expresión en cada imagen.",
      photos: [
        "img/26.jpg",
        "img/27.jpg",
        "img/28.jpg"
      ]
    },

    naturaleza: {
      title: "Naturaleza",
      description: "Paisajes, colores, texturas y pequeños detalles que nos regala la naturaleza.",
      photos: [
        "img/34.jpg",
        "img/33.jpg",
        "img/24.jpg",
        "img/16.jpg",
        "img/15.jpg",
        "img/14.jpg",
        "img/13.jpg",
        "img/12.jpg",
        "img/8.jpg",
        "img/6.jpg"
      ]
    },

    urbano: {
      title: "Urbano",
      description: "Calles, arquitectura, luces y rincones de la ciudad.",
      photos: [
        "img/10.jpg",
        "img/25.jpg",
        "img/35.jpg"
      ]
    }
  };

  const albumOverlay = $("albumOverlay");
  const albumGallery = $("albumGallery");
  const albumViewer = $("albumViewer");
  const viewerImage = $("viewerImage");

  let currentAlbum = null;
  let currentAlbumIndex = 0;
  let albumTrigger = null;
  let viewerTrigger = null;

  function openAlbum(key, trigger) {
    const album = albums[key];
    if (!album) return;

    currentAlbum = album;
    albumTrigger = trigger;

    $("albumTitle").textContent = album.title;
    $("albumDescription").textContent = album.description;

    albumGallery.replaceChildren();

    album.photos.forEach((src, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "album-thumb";
      button.setAttribute(
        "aria-label",
        `Ampliar fotografía ${index + 1} de ${album.title}`
      );

      const image = document.createElement("img");
      image.src = src;
      image.alt = `${album.title}, fotografía ${index + 1}`;
      image.loading = "lazy";

      button.appendChild(image);

      button.addEventListener("click", () => {
        viewerTrigger = button;
        openAlbumViewer(index);
      });

      albumGallery.appendChild(button);
    });

    const message =
      `¡Hola, Nahiara! Quisiera consultar por una sesión de ${album.title}.`;

    $("albumContact").href =
      "https://wa.me/5491127235727?text=" +
      encodeURIComponent(message);

    albumOverlay.classList.add("open");
    albumOverlay.setAttribute("aria-hidden", "false");
    albumOverlay.scrollTop = 0;

    document.body.classList.add("no-scroll");

    $("albumClose").focus();
  }

  function closeAlbum() {
    if (albumViewer.classList.contains("open")) {
      closeAlbumViewer();
    }

    albumOverlay.classList.remove("open");
    albumOverlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");
    albumTrigger?.focus();
  }

  function updateAlbumViewer(index) {
    if (!currentAlbum || !currentAlbum.photos.length) return;

    const total = currentAlbum.photos.length;

    currentAlbumIndex = (index + total) % total;

    viewerImage.src =
      currentAlbum.photos[currentAlbumIndex];

    viewerImage.alt =
      `${currentAlbum.title}, fotografía ${currentAlbumIndex + 1}`;

    $("viewerCounter").textContent =
      `${String(currentAlbumIndex + 1).padStart(2, "0")} / ` +
      `${String(total).padStart(2, "0")}`;
  }

  function openAlbumViewer(index) {
    updateAlbumViewer(index);

    albumViewer.classList.add("open");
    albumViewer.setAttribute("aria-hidden", "false");

    $("viewerClose").focus();
  }

  function closeAlbumViewer() {
    if (!albumViewer.classList.contains("open")) return;

    albumViewer.classList.remove("open");
    albumViewer.setAttribute("aria-hidden", "true");

    viewerImage.removeAttribute("src");

    viewerTrigger?.focus();
  }

  document.querySelectorAll("[data-album]").forEach(card => {
    card.addEventListener("click", () => {
      openAlbum(card.dataset.album, card);
    });
  });

  $("albumClose")?.addEventListener("click", closeAlbum);

  $("viewerClose")?.addEventListener(
    "click",
    closeAlbumViewer
  );

  $("viewerPrev")?.addEventListener("click", () => {
    updateAlbumViewer(currentAlbumIndex - 1);
  });

  $("viewerNext")?.addEventListener("click", () => {
    updateAlbumViewer(currentAlbumIndex + 1);
  });

  albumOverlay?.addEventListener("click", event => {
    if (event.target === albumOverlay) {
      closeAlbum();
    }
  });

  albumViewer?.addEventListener("click", event => {
    if (event.target === albumViewer) {
      closeAlbumViewer();
    }
  });

  // =====================================
  // DESLIZAR FOTOGRAFÍAS EN CELULAR
  // =====================================

  let touchStartX = 0;

  albumViewer?.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
  }, {
    passive: true
  });

  albumViewer?.addEventListener("touchend", event => {
    if (!albumViewer.classList.contains("open")) return;

    const difference =
      event.changedTouches[0].screenX - touchStartX;

    if (Math.abs(difference) < 50) return;

    updateAlbumViewer(
      currentAlbumIndex + (difference < 0 ? 1 : -1)
    );
  }, {
    passive: true
  });

  // =====================================
  // TECLADO Y NAVEGACIÓN DE GALERÍAS
  // =====================================

  document.addEventListener("keydown", event => {
    if (albumViewer.classList.contains("open")) {
      if (event.key === "Escape") {
        closeAlbumViewer();
      } else if (event.key === "ArrowRight") {
        updateAlbumViewer(currentAlbumIndex + 1);
      } else if (event.key === "ArrowLeft") {
        updateAlbumViewer(currentAlbumIndex - 1);
      }
      return;
    }

    if (albumOverlay.classList.contains("open")) {
      if (event.key === "Escape") {
        closeAlbum();
      }
      return;
    }

    if (lightbox.classList.contains("open")) {
      if (event.key === "Escape") {
        closePortfolioViewer();
      } else if (event.key === "ArrowRight") {
        updatePortfolioViewer(photoIndex + 1);
      } else if (event.key === "ArrowLeft") {
        updatePortfolioViewer(photoIndex - 1);
      }
    }
  });

  // Mantener el foco dentro del diálogo visible.

  document.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;

    const activeDialog =
      albumViewer.classList.contains("open")
        ? albumViewer
        : albumOverlay.classList.contains("open")
          ? albumOverlay
          : lightbox.classList.contains("open")
            ? lightbox
            : null;

    if (!activeDialog) return;

    const controls = [
      ...activeDialog.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled])'
      )
    ].filter(el => el.getClientRects().length > 0);

    if (!controls.length) return;

    const first = controls[0];
    const last = controls[controls.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  });

  // =====================================
  // FORMULARIO DE CONTACTO
  // =====================================

  const dateInput = $("fecha");

  if (dateInput) {
    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  $("quoteForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const form = $("quoteForm");

    if (!form.reportValidity()) return;

    const nombre = $("nombre").value.trim();
    const servicio = $("servicio").value;
    const fecha = $("fecha").value || "A coordinar";
    const horas = $("horas").value || "A definir";
    const ubicacion =
      $("ubicacion").value.trim() || "A coordinar";
    const mensaje =
      $("mensaje").value.trim() || "Sin detalles adicionales";

    const text = [
      "¡Hola, Nahiara! 📸",
      "",
      "Quiero consultar por una sesión fotográfica.",
      "",
      `Nombre: ${nombre}`,
      `Servicio: ${servicio}`,
      `Fecha: ${fecha}`,
      `Duración: ${horas}`,
      `Localidad: ${ubicacion}`,
      `Mi idea: ${mensaje}`,
      "",
      "¿Podrías indicarme disponibilidad y presupuesto?"
    ].join("\n");

    const url =
      "https://wa.me/5491127235727?text=" +
      encodeURIComponent(text);

    window.open(url, "_blank", "noopener,noreferrer");
  });

  // =====================================
  // MÚSICA
  // =====================================

  const music = $("backgroundMusic");
  const musicToggle = $("musicToggle");
  const muteToggle = $("muteToggle");
  const musicBars = $("musicBars");
  const musicStatus = $("musicStatus");

  if (
    music &&
    musicToggle &&
    muteToggle &&
    musicBars &&
    musicStatus
  ) {
    music.volume = 0.25;

    function updateMusicUI() {
      const playing = !music.paused;

      musicToggle.textContent = playing ? "Ⅱ" : "▶";

      musicToggle.setAttribute(
        "aria-label",
        playing ? "Pausar música" : "Reproducir música"
      );

      musicToggle.setAttribute(
        "aria-pressed",
        String(playing)
      );

      musicToggle.title =
        playing ? "Pausar música" : "Reproducir música";

      musicBars.classList.toggle("playing", playing);

      musicStatus.textContent = playing
        ? "Reproduciendo"
        : "Música pausada";

      muteToggle.textContent = music.muted ? "✕" : "♫";

      muteToggle.setAttribute(
        "aria-label",
        music.muted ? "Activar sonido" : "Silenciar música"
      );

      muteToggle.setAttribute(
        "aria-pressed",
        String(music.muted)
      );
    }

    musicToggle.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();
        } catch (error) {
          musicStatus.textContent =
            "No se pudo reproducir el audio";
        }
      } else {
        music.pause();
      }
    });

    muteToggle.addEventListener("click", () => {
      music.muted = !music.muted;
      updateMusicUI();
    });

    music.addEventListener("play", updateMusicUI);
    music.addEventListener("pause", updateMusicUI);
    music.addEventListener("volumechange", updateMusicUI);

    music.addEventListener("error", () => {
      musicStatus.textContent = "Audio no disponible";
      musicToggle.disabled = true;
      muteToggle.disabled = true;
    });

    updateMusicUI();
  }

  // =====================================
  // PORTADA DE BIENVENIDA CON VIDEO
  // =====================================

  const welcomeScreen = $("welcomeScreen");
  const enterSite = $("enterSite");
  const welcomeVideo = document.querySelector(".welcome-video");

  if (welcomeScreen && enterSite) {
    document.body.classList.add("no-scroll");

    if (welcomeVideo) {
      welcomeVideo.muted = true;

      welcomeVideo.play().catch(() => {
        // Si el navegador bloquea la reproducción,
        // se mantiene visible la imagen de portada.
      });
    }

    enterSite.addEventListener("click", () => {
      welcomeScreen.classList.add("hide");
      document.body.classList.remove("no-scroll");

      setTimeout(() => {
        if (welcomeVideo) {
          welcomeVideo.pause();
        }

        welcomeScreen.remove();
      }, 1200);
    });
  }

});
