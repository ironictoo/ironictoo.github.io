const publicationsList = document.getElementById("publications-list");
const publicationsEmpty = document.getElementById("publications-empty");
const lastUpdated = document.getElementById("last-updated");

const formatLinks = (links = []) => {
  if (!Array.isArray(links) || links.length === 0) {
    return null;
  }

  const container = document.createElement("div");
  container.className = "pub-links";

  links.forEach((link) => {
    if (!link || !link.url || !link.label) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.textContent = link.label;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    container.appendChild(anchor);
  });

  return container;
};

const renderPublication = (publication) => {
  const item = document.createElement("li");
  item.className = "pub-item";

  const title = document.createElement("h3");
  title.textContent = publication.title || "Untitled publication";

  const meta = document.createElement("p");
  meta.className = "pub-meta";
  const year = publication.year ? String(publication.year) : "";
  const venue = publication.venue ? String(publication.venue) : "";
  const authors = publication.authors ? String(publication.authors) : "";
  const bits = [authors, venue, year].filter(Boolean);
  meta.textContent = bits.join(" • ");

  item.appendChild(title);
  item.appendChild(meta);

  const links = formatLinks(publication.links);
  if (links) {
    item.appendChild(links);
  }

  return item;
};

const MAX_PUBLICATIONS = 5;

const loadPublications = async () => {
  try {
    const response = await fetch("data/publications.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load publications");
    }

    const publications = await response.json();
    if (!Array.isArray(publications) || publications.length === 0) {
      publicationsEmpty.hidden = false;
      return;
    }

    const sorted = publications.sort((a, b) => (b.year || 0) - (a.year || 0));
    const visible = sorted.slice(0, MAX_PUBLICATIONS);
    visible.forEach((publication) => {
      publicationsList.appendChild(renderPublication(publication));
    });

    publicationsEmpty.hidden = true;
  } catch (error) {
    publicationsEmpty.hidden = false;
    publicationsEmpty.textContent =
      "Unable to load publications. Check data/publications.json.";
  }
};

const updateLastModified = () => {
  if (!lastUpdated) return;
  const modified = new Date(document.lastModified);
  if (Number.isNaN(modified.valueOf())) {
    lastUpdated.textContent = "recently";
    return;
  }
  lastUpdated.textContent = modified.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

loadPublications();
updateLastModified();
