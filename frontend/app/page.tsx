
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const NexoraCore = dynamic(
  () => import("@/components/three/NexoraCore"),
  { ssr: false }
);

const services = [
  {
    number: "01",
    title: "AI & Automation",
    description:
      "Intelligent automation solutions that simplify workflows, improve efficiency and help businesses grow.",
  },
  {
    number: "02",
    title: "Web Development",
    description:
      "Modern, responsive and high-performance websites designed to create meaningful digital experiences.",
  },
  {
    number: "03",
    title: "Digital Solutions",
    description:
      "Innovative technology solutions that solve business challenges and support digital transformation.",
  },
];

function BrandLogo() {
  return (
    <Link href="/" className="brand-logo-wrap" aria-label="Nexora home">
      <img
        src="/images/nexora-logo.jpg"
        alt="Nexora Technology"
        className="brand-logo"
      />
    </Link>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      {/* NAVBAR */}
      <header className="navbar">
        <BrandLogo />

        <nav className="nav-links" aria-label="Main navigation">
          <Link href="#home">Home</Link>
          <Link href="#about">About Us</Link>
          <Link href="#services">Services</Link>
          <Link href="#contact">Contact</Link>
        </nav>

        <Link href="#contact" className="nav-cta">
          Let&apos;s Talk <span>↗</span>
        </Link>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot" />
            TECHNOLOGY · INNOVATION · GROWTH
          </div>

          <h1>
            Technology
            <br />
            That Shapes
            <br />
            <span>Tomorrow.</span>
          </h1>

          <p className="hero-description">
            We combine technology, intelligent systems and creative
            engineering to help businesses transform ideas into
            powerful digital solutions.
          </p>

          <div className="hero-actions">
            <Link href="#services" className="primary-button">
              Explore Our Services <span>↗</span>
            </Link>

            <Link href="#about" className="secondary-button">
              Discover Nexora <span>→</span>
            </Link>
          </div>

          <div className="hero-caption">
            <span>INNOVATION</span>
            <span className="caption-line" />
            <span>TECHNOLOGY</span>
            <span className="caption-line" />
            <span>EXCELLENCE</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow" />
          <NexoraCore />

          <div className="visual-label">
            <span>01 / NEXORA</span>
            <span>ENGINEERING THE FUTURE</span>
          </div>
        </div>

        <div className="hero-index">NEXORA INTERNATIONAL</div>
      </section>

      {/* ABOUT */}
      <section className="intro-section" id="about">
        <div className="section-kicker">/ ABOUT NEXORA</div>

        <div className="intro-content">
          <h2>
            We turn complex challenges into{" "}
            <span>intelligent digital possibilities.</span>
          </h2>

          <p>
            Nexora International brings technology and creative
            engineering together to build meaningful digital
            experiences and intelligent business solutions. Our
            focus is on practical innovation, thoughtful execution
            and technology that creates real value.
          </p>

          <Link href="#services" className="text-link">
            Discover our capabilities <span>→</span>
          </Link>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section" id="services">
        <div className="section-heading">
          <div>
            <div className="section-kicker">/ OUR EXPERTISE</div>
            <h2>
              Technology solutions
              <br />
              built for your future.
            </h2>
          </div>

          <p>
            Purposeful technology and thoughtful execution
            to help businesses work smarter and move forward.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-top">
                <span className="service-number">{service.number}</span>
                <span className="service-icon">↗</span>
              </div>

              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <Link href="#contact" className="service-arrow">
                Discuss your project <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="section-kicker">/ LET&apos;S WORK TOGETHER</div>

        <h2>
          Have an idea?
          <br />
          <span>Let&apos;s build it.</span>
        </h2>

        <p>
          Every great digital experience starts with an idea.
          Tell us what you are planning, and let&apos;s explore
          what&apos;s possible together.
        </p>

        <a
          href="mailto:info@nexoratechnology.com"
          className="primary-button"
        >
          Contact Our Team <span>↗</span>
        </a>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <BrandLogo />

        <span>
          © {new Date().getFullYear()} Nexora International.
        </span>

        <Link href="#home" className="back-to-top">
          Back to top ↑
        </Link>
      </footer>
    </main>
  );
}
