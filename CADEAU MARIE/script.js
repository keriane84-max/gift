
// INTRODUCTION : les bougies tombent une à une, puis les pétales apparaissent.
(() => {
    const intro = document.getElementById("intro-anniversaire");
    const bougies = document.getElementById("bougies-animees");
    const pluie = document.getElementById("pluie-petales");
    const voeu = document.getElementById("voeu-armenien");
    const traduction = document.getElementById("traduction-armenien");
    const bouton = document.getElementById("bouton-entrer");
    const carte = document.querySelector(".carte");
    if (!intro || !bougies || !pluie || !voeu || !traduction || !bouton || !carte) return;

    document.body.classList.add("intro-active");
    carte.setAttribute("aria-hidden", "true");
    const positions = [18, 28, 38, 48, 58, 68, 78];
    const delaiEntreBougies = 520;

    positions.forEach((position, index) => {
        const bougie = document.createElement("span");
        bougie.className = "bougie-animee";
        bougie.style.left = `${position}%`;
        bougie.style.setProperty("--delai", `${index * delaiEntreBougies}ms`);
        bougies.appendChild(bougie);
        window.setTimeout(() => bougie.classList.add("plantee"), 350 + index * delaiEntreBougies);
    });

    const finBougies = 350 + positions.length * delaiEntreBougies + 650;
    window.setTimeout(() => {
        const couleurs = ["#a83c35", "#e0bd8a", "#fff1d6", "#bd775b", "#f1d9b7"];
        for (let i = 0; i < 68; i++) {
            const petale = document.createElement("span");
            petale.className = "petale";
            petale.style.left = `${Math.random() * 100}%`;
            petale.style.setProperty("--duree", `${4 + Math.random() * 4}s`);
            petale.style.setProperty("--retard", `${Math.random() * 1.8}s`);
            petale.style.setProperty("--derive", `${Math.random() * 180 - 90}px`);
            petale.style.backgroundColor = couleurs[i % couleurs.length];
            pluie.appendChild(petale);
        }
        voeu.hidden = false;
        traduction.hidden = false;
        bouton.hidden = false;
        voeu.classList.add("apparait");
        traduction.classList.add("apparait");
        bouton.classList.add("apparait");
    }, finBougies);

    bouton.addEventListener("click", () => {
        intro.classList.add("intro-terminee");
        document.body.classList.remove("intro-active");
        carte.removeAttribute("aria-hidden");
        window.setTimeout(() => intro.remove(), 700);
    });
})();

const enveloppe = document.getElementById("enveloppe");
const instruction = document.getElementById("instruction");

function ouvrirEnveloppe() {
  const ouverte = enveloppe.classList.toggle("ouverte");

  enveloppe.setAttribute("aria-expanded", String(ouverte));

  instruction.textContent = ouverte
    ? "Joyeux 25 ans, Marie ! ❤️"
    : "Clique sur le cachet pour ouvrir ta surprise";
}

enveloppe.addEventListener("click", ouvrirEnveloppe);

enveloppe.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    ouvrirEnveloppe();
  }
});

const pageSecret = document.getElementById("page-secret");
const pageSurprise = document.getElementById("page-surprise");
const codeSecret = document.getElementById("code-secret");
const boutonValider = document.getElementById("valider-code");
const messageErreur = document.getElementById("message-erreur");

// Afficher le code après l'ouverture de l'enveloppe
let ouvertureProgrammee = false;

enveloppe.addEventListener("click", () => {
    if (enveloppe.classList.contains("ouverte")
        && !ouvertureProgrammee) {

        ouvertureProgrammee = true;

        setTimeout(() => {
            pageSecret.hidden = false;
            codeSecret.focus();
        }, 2000);
    }
});

// Vérifier le code secret
function verifierCode() {
    if (codeSecret.value.trim() === "12112001") {
        pageSecret.hidden = true;
        pageSurprise.hidden = false;
    } else {
        messageErreur.textContent =
            "Oups ! Ce n'est pas le bon code ❤️";
    }
}

boutonValider.addEventListener("click", verifierCode);

codeSecret.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        verifierCode();
    }
});
const coeursCode = document.querySelector(".coeurs-code");

codeSecret.addEventListener("input", () => {
    const nombreChiffres = codeSecret.value.length;
    coeursCode.textContent = "♥".repeat(nombreChiffres);
});

// ALBUM DE SOUVENIRS

const boutonSuite = document.getElementById("bouton-suite");
const pageAlbum = document.getElementById("page-album");

boutonSuite.addEventListener("click", () => {

    // Masquer la lettre
    pageSurprise.hidden = true;

    // Afficher l'album
    pageAlbum.hidden = false;
    pageAlbum.scrollTop = 0;

    // Animer les Polaroids au défilement
    const photos = pageAlbum.querySelectorAll(".polaroid");

    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (entree.isIntersecting) {
                entree.target.classList.add("visible");
                observateur.unobserve(entree.target);
            }
        });
    }, {
        root: pageAlbum,
        threshold: 0.15
    });

    photos.forEach((photo) => {
        observateur.observe(photo);
    });
});

/* =========================================
   SURPRISE FINALE - VIDÉO AUTOMATIQUE
========================================= */

(() => {
    const pageGateau = document.getElementById("page-gateau");
    const pageAlbum = document.getElementById("page-album");
    const boutonSuite = document.getElementById("suite-album");
    const video = document.getElementById("video-anniversaire");
    const messageGateau = document.getElementById("message-gateau");
    const compteRebours = document.getElementById("compte-rebours");
    const messageFinal = document.getElementById("message-final");
    const canvas = document.getElementById("canvas-feux");

    if (!pageGateau || !pageAlbum || !boutonSuite ||
        !video || !messageGateau || !compteRebours ||
        !messageFinal || !canvas) {
        console.error("Un élément de la scène finale est introuvable.");
        return;
    }

    const ctx = canvas.getContext("2d");
    const attendre = ms => new Promise(resolve => setTimeout(resolve, ms));

    let animationEnCours = false;
    let animationFeux = null;

    // Quand Marie termine l'album Polaroid
    boutonSuite.addEventListener("click", async () => {
        if (animationEnCours) return;
        animationEnCours = true;

        // Masquer l'album
        pageAlbum.hidden = true;
        pageAlbum.style.display = "none";

        // Afficher la scène finale
        pageGateau.hidden = false;
        pageGateau.scrollTop = 0;

        // Préparer la vidéo sur sa première image
        video.pause();
        video.currentTime = 0;
        video.style.opacity = "1";

        messageGateau.textContent =
            "Ferme les yeux et fais un vœu... ✨";

        compteRebours.textContent = "";
        messageFinal.hidden = true;

        // Arrêter les anciens feux d'artifice
        if (animationFeux !== null) {
            cancelAnimationFrame(animationFeux);
            animationFeux = null;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1 secondes de suspense
        await attendre(1000);

        messageGateau.textContent =
            "Attention Marie... la magie commence ! ❤️";

        // Lancement automatique du film
        try {
            await video.play();
        } catch (erreur) {
            console.error("Lecture automatique bloquée :", erreur);
            messageGateau.textContent =
                "Clique sur la vidéo pour lancer la surprise ❤️";
            video.controls = true;
        }
    });

    // Quand la vidéo se termine
    video.addEventListener("ended", () => {
        messageGateau.textContent =
            "Que tous tes rêves se réalisent ! 💕";

        messageFinal.hidden = false;

        lancerFeuxArtifice();
        animationEnCours = false;
    });

    // FEUX D'ARTIFICE
    function lancerFeuxArtifice() {
        const largeur = canvas.clientWidth;
        const hauteur = canvas.clientHeight;

        canvas.width = largeur;
        canvas.height = hauteur;

        const couleurs = [
            "#f4e4c4", "#b85b4a", "#fff8eb",
            "#d4b477", "#913f36", "#e4d0b2"
        ];

        let particules = [];
        let frame = 0;

        function explosion(x, y) {
            for (let i = 0; i < 70; i++) {
                const angle = Math.random() * Math.PI * 2;
                const vitesse = Math.random() * 4 + 1;

                particules.push({
                    x, y,
                    vx: Math.cos(angle) * vitesse,
                    vy: Math.sin(angle) * vitesse,
                    vie: 1,
                    couleur: couleurs[
                        Math.floor(Math.random() * couleurs.length)
                    ]
                });
            }
        }

        function animer() {
            ctx.clearRect(0, 0, largeur, hauteur);

            if (frame % 22 === 0 && frame < 300) {
                explosion(
                    Math.random() * largeur,
                    Math.random() * hauteur * 0.65
                );
            }

            particules.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.035;
                p.vie -= 0.012;

                ctx.globalAlpha = Math.max(0, p.vie);
                ctx.fillStyle = p.couleur;
                ctx.shadowColor = p.couleur;
                ctx.shadowBlur = 12;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
            });

            particules = particules.filter(p => p.vie > 0);
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            frame++;

            if (frame < 300 || particules.length > 0) {
                animationFeux = requestAnimationFrame(animer);
            } else {
                animationFeux = null;
            }
        }

        animer();
    }
})();
