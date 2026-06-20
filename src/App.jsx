import { useEffect, useState } from "react";
import { weddingData } from "./data";

function useCountdown(targetDate) {
  const calculate = () => {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    const diff = Math.max(target - now, 0);

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculate);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft(calculate());
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [targetDate]);

  return timeLeft;
}

function useRevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".reveal-on-scroll"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.16 }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);
}

function Timeline() {
  return (
    <div className="itinerary">
      {weddingData.days.map((day) => (
        <section className="day-card reveal-on-scroll" key={day.label}>
          <div className="day-card__header">
            <p className="section__kicker">{day.label}</p>
            <h3>{day.date}</h3>
            <p className="day-card__theme">{day.theme}</p>
          </div>
          <div className="day-card__events">
            {day.events.map((event) => (
              <article className="event-card" key={`${day.label}-${event.title}`}>
                <span className="event-card__time">{event.time}</span>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CoupleCards() {
  return (
    <div className="couple-grid">
      {weddingData.coupleCards.map((person) => (
        <article className="portrait-card reveal-on-scroll" key={person.role}>
          <div className="portrait-card__image">
            <span>{person.role}</span>
          </div>
          <p className="section__kicker">{person.role}</p>
          <h3>{person.name}</h3>
          <p className="portrait-card__location">{person.location}</p>
          <p>{person.blurb}</p>
        </article>
      ))}
    </div>
  );
}

export default function App() {
  const countdown = useCountdown(weddingData.weddingStart);

  useRevealOnScroll();

  return (
    <div className="page-shell">
      <header className="hero" id="top">
        <div className="hero__media" aria-hidden="true">
          <img className="hero__background-image" src="/hero-tanjai-floral-hd.png" alt="" />
          <div className="hero__media-overlay" />
          <div className="hero__paper-glow hero__paper-glow--left" />
          <div className="hero__paper-glow hero__paper-glow--right" />
        </div>

        <nav className="topbar">
          <span className="topbar__date">{weddingData.weddingDateLabel}</span>
          <div className="topbar__nav">
            <a className="topbar__link" href="#story">
              Story
            </a>
            <a className="topbar__link" href="#events">
              Events
            </a>
            <a className="topbar__link" href="#details">
              Details
            </a>
          </div>
        </nav>

        <div className="hero__content">
          <div className="hero-frame reveal-on-scroll">
            <p className="hero-frame__label">{weddingData.heroLabel}</p>
            <div className="journey">
              {weddingData.journey.map((place) => (
                <span className="journey__chip" key={place}>
                  {place}
                </span>
              ))}
            </div>
            <p className="eyebrow">{weddingData.blessing}</p>
            <h1>
              {weddingData.couple[0]} <span>&amp;</span> {weddingData.couple[1]}
            </h1>
            <p className="hero__lede">{weddingData.heroMessage}</p>
            <div className="countdown" aria-live="polite">
              <div className="countdown__item">
                <strong>{countdown.days}</strong>
                <span>Days</span>
              </div>
              <div className="countdown__item">
                <strong>{countdown.hours}</strong>
                <span>Hours</span>
              </div>
              <div className="countdown__item">
                <strong>{countdown.minutes}</strong>
                <span>Minutes</span>
              </div>
            </div>
            <div className="hero__actions">
              <a className="button" href="#events">
                View itinerary
              </a>
              <a className="button button--secondary" href="#details">
                Venue and RSVP
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section section--invite">
          <div className="section__inner">
            <div className="invite-card reveal-on-scroll">
              <p className="section__kicker">The invitation</p>
              <h2>{weddingData.inviteTitle}</h2>
              <p>{weddingData.inviteCopy}</p>
              <div className="invite-card__families">
                {weddingData.families.map((family) => (
                  <span key={family}>{family}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section--story" id="story">
          <div className="section__inner">
            <div className="section-heading reveal-on-scroll">
              <p className="section__kicker">Meet the couple</p>
              <h2>{weddingData.storyTitle}</h2>
              <p>{weddingData.storyCopy}</p>
            </div>
            <CoupleCards />
          </div>
        </section>

        <section className="section section--events" id="events">
          <div className="section__inner">
            <div className="section-heading reveal-on-scroll">
              <p className="section__kicker">Wedding events</p>
              <h2>{weddingData.weddingDateTitle}</h2>
              <p>Two days of rituals, blessings, and celebration.</p>
            </div>
            <Timeline />
          </div>
        </section>

        <section className="section section--details" id="details">
          <div className="section__inner details-grid">
            <article className="details-card details-card--venue reveal-on-scroll">
              <p className="section__kicker">Venue</p>
              <h3>{weddingData.venueName}</h3>
              <p>{weddingData.venueAddress}</p>
              <a className="text-link" href={weddingData.mapHref}>
                Open map
              </a>
            </article>
            <article className="details-card details-card--rsvp reveal-on-scroll">
              <p className="section__kicker">RSVP</p>
              <h3>{weddingData.rsvpTitle}</h3>
              <p>{weddingData.rsvpCopy}</p>
              <a className="text-link" href={weddingData.rsvpHref}>
                {weddingData.rsvpLabel}
              </a>
            </article>
          </div>
        </section>

        <section className="section section--gallery">
          <div className="section__inner">
            <div className="section-heading reveal-on-scroll">
              <p className="section__kicker">Gallery</p>
              <h2>{weddingData.galleryTitle}</h2>
            </div>
            <div className="gallery-grid">
              {weddingData.gallery.map((item, index) => (
                <article className={`gallery-tile gallery-tile--${(index % 4) + 1} reveal-on-scroll`} key={item}>
                  <span>{item}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--notes">
          <div className="section__inner notes-grid">
            <article className="details-card reveal-on-scroll">
              <p className="section__kicker">Dress code</p>
              <h3>{weddingData.dressTitle}</h3>
              <p>{weddingData.dressCopy}</p>
            </article>
            <article className="details-card reveal-on-scroll">
              <p className="section__kicker">Guest guidance</p>
              <h3>{weddingData.travelTitle}</h3>
              <p>{weddingData.travelCopy}</p>
            </article>
            {weddingData.notes.map((note) => (
              <article className="mini-note reveal-on-scroll" key={note.title}>
                <p className="section__kicker">{note.title}</p>
                <p>{note.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--closing">
          <div className="section__inner">
            <div className="closing-card reveal-on-scroll">
              <p className="section__kicker">With love</p>
              <h2>{weddingData.closingTitle}</h2>
              <p>{weddingData.closingCopy}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
