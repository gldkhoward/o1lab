"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cursor follower
    const dot = cursorDotRef.current;
    if (!dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    function animateDot() {
      dotX += (mouseX - dotX) * 0.12;
      dotY += (mouseY - dotY) * 0.12;
      if (dot) {
        dot.style.left = (dotX - 8) + "px";
        dot.style.top = (dotY - 8) + "px";
      }
      animationId = requestAnimationFrame(animateDot);
    }

    document.addEventListener("mousemove", handleMouseMove);
    animateDot();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={cursorDotRef}></div>

      {/* NAV */}
      <nav>
        <div className="logo">
          o1 <span>lab</span>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#manifesto">About</a>
          </li>
          <li>
            <a href="#space">The Space</a>
          </li>
          <li>
            <a href="#who">Who</a>
          </li>
          <li>
            <a href="#join">Join</a>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            <span className="o">o</span>1<br />
            lab
          </h1>
          <p className="hero-subtitle">
            Open access hardware lab
            <br />
            From zero → one
            <br />
            Sydney, AU
          </p>
        </div>
        <div className="hero-right">
          <div className="geo-circle"></div>
          <div className="geo-circle"></div>
          <div className="geo-circle"></div>
          <span className="float-text ft1">Ideas start here</span>
          <span className="float-text ft2">Hardware for all</span>
          <span className="float-text ft3">Est. 2025</span>
        </div>
        <div className="arrow-down">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <span>Robotics</span>
          <span className="dot">●</span>
          <span>Art Installations</span>
          <span className="dot">●</span>
          <span>Music Hardware</span>
          <span className="dot">●</span>
          <span>Kinetic Sculpture</span>
          <span className="dot">●</span>
          <span>Electronics</span>
          <span className="dot">●</span>
          <span>Weird Machines</span>
          <span className="dot">●</span>
          <span>Interactive Design</span>
          <span className="dot">●</span>
          <span>Soldering</span>
          <span className="dot">●</span>
          <span>3D Printing</span>
          <span className="dot">●</span>
          <span>Prototyping</span>
          <span className="dot">●</span>
          <span>Whatever You Want</span>
          <span className="dot">●</span>
          {/* duplicate for seamless loop */}
          <span>Robotics</span>
          <span className="dot">●</span>
          <span>Art Installations</span>
          <span className="dot">●</span>
          <span>Music Hardware</span>
          <span className="dot">●</span>
          <span>Kinetic Sculpture</span>
          <span className="dot">●</span>
          <span>Electronics</span>
          <span className="dot">●</span>
          <span>Weird Machines</span>
          <span className="dot">●</span>
          <span>Interactive Design</span>
          <span className="dot">●</span>
          <span>Soldering</span>
          <span className="dot">●</span>
          <span>3D Printing</span>
          <span className="dot">●</span>
          <span>Prototyping</span>
          <span className="dot">●</span>
          <span>Whatever You Want</span>
          <span className="dot">●</span>
        </div>
      </div>

      {/* MANIFESTO */}
      <section className="manifesto reveal" id="manifesto">
        <p>
          We believe the biggest barrier to making{" "}
          <em>physical things</em> isn&apos;t talent — it&apos;s access. Access
          to tools, space, components, and someone who&apos;s been there before.
        </p>
        <p style={{ marginTop: "32px" }}>
          o1 lab is a garage. Literally. A place where <em>anyone</em> with an
          idea can walk in and start building — no gatekeeping, no prerequisites,
          no pitch decks.
        </p>
        <span className="aside">
          Not a startup. Not an incubator. Just a really good garage.
        </span>
      </section>

      {/* WHAT CARDS */}
      <section className="what-section" id="what">
        <div className="what-card reveal">
          <span className="num">01</span>
          <span className="icon">🔧</span>
          <h3>Open Access</h3>
          <p>
            Walk in. Use the tools. Ask questions. Leave inspired. The lab is
            open to anyone working on hardware — hobbyist, artist, student,
            whoever.
          </p>
        </div>
        <div
          className="what-card reveal"
          style={{ transitionDelay: "0.1s" }}
        >
          <span className="num">02</span>
          <span className="icon">🧪</span>
          <h3>Engineering Support</h3>
          <p>
            Stuck on a circuit? Need help with a microcontroller? Someone&apos;s
            always around to help you debug, design, or just think it through.
          </p>
        </div>
        <div
          className="what-card reveal"
          style={{ transitionDelay: "0.2s" }}
        >
          <span className="num">03</span>
          <span className="icon">🎪</span>
          <h3>Community</h3>
          <p>
            Cross-pollination between artists, engineers, musicians, and
            tinkerers. The best ideas happen when different worlds collide in a
            garage.
          </p>
        </div>
      </section>

      {/* ZERO TO ONE JOURNEY */}
      <section className="journey reveal" id="journey">
        <h2 className="journey-header">
          <span className="zero"></span> → <span className="one">1</span>
        </h2>
        <p
          style={{
            fontSize: "17px",
            color: "var(--mid)",
            fontWeight: 300,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          We exist for that first step — the hardest one. Going from nothing to
          something real you can hold.
        </p>
        <div className="journey-line"></div>
        <div className="journey-steps">
          <div className="step reveal">
            <div className="step-num">Phase 01</div>
            <h4>Spark</h4>
            <p>
              You have an idea — maybe vague, maybe wild. That&apos;s enough.
              Come talk about it.
            </p>
          </div>
          <div
            className="step reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <div className="step-num">Phase 02</div>
            <h4>Shape</h4>
            <p>
              We help you figure out what components, tools, and skills you need.
              No stupid questions.
            </p>
          </div>
          <div
            className="step reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="step-num">Phase 03</div>
            <h4>Build</h4>
            <p>
              Use the lab. Break things. Fix them. Iterate. You&apos;ll leave
              with something that works.
            </p>
          </div>
          <div
            className="step reveal"
            style={{ transitionDelay: "0.3s" }}
          >
            <div className="step-num">Phase 04</div>
            <h4>Ship</h4>
            <p>
              Take it to the world. Install it. Perform with it. Sell it.
              Whatever &ldquo;done&rdquo; means to you.
            </p>
          </div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="for-section" id="who">
        <div className="for-heading">
          <h2>This is for you if...</h2>
          <p className="sub">No experience necessary. Seriously.</p>
        </div>
        <div className="for-grid">
          <div className="for-item reveal">
            <span className="emoji">🎨</span>
            <h4>Artists</h4>
            <p>
              You want to build an installation but don&apos;t know where to
              start with the electronics.
            </p>
          </div>
          <div
            className="for-item reveal"
            style={{ transitionDelay: "0.05s" }}
          >
            <span className="emoji">🎵</span>
            <h4>Musicians</h4>
            <p>
              You want to build your own MIDI controller, synth module, or
              something that doesn&apos;t exist yet.
            </p>
          </div>
          <div
            className="for-item reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <span className="emoji">🤖</span>
            <h4>Tinkerers</h4>
            <p>
              You&apos;ve been watching YouTube tutorials. Time to actually
              solder something.
            </p>
          </div>
          <div
            className="for-item reveal"
            style={{ transitionDelay: "0.15s" }}
          >
            <span className="emoji">🎓</span>
            <h4>Students</h4>
            <p>
              Your uni lab is booked and your dorm room doesn&apos;t have an
              oscilloscope.
            </p>
          </div>
          <div
            className="for-item reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <span className="emoji">🚀</span>
            <h4>Founders</h4>
            <p>
              You&apos;re in the Arrayah accelerator and need somewhere to
              prototype hardware fast.
            </p>
          </div>
          <div
            className="for-item reveal"
            style={{ transitionDelay: "0.25s" }}
          >
            <span className="emoji">🌀</span>
            <h4>The Curious</h4>
            <p>
              You don&apos;t even know what you want to build yet. That&apos;s
              the best place to start.
            </p>
          </div>
        </div>
      </section>

      {/* THE SPACE */}
      <section className="space-section" id="space">
        <div className="space-visual">
          <div className="grid-lines"></div>
          <div className="big-zero"></div>
          <div className="big-one">1</div>
          <span className="label l1">The Garage</span>
          <span className="label l2">Sydney, AU</span>
        </div>
        <div className="space-text reveal">
          <h2>A garage with the right stuff in it</h2>
          <p>
            We&apos;re sourcing components and equipment so you don&apos;t have
            to wait 3 weeks for a shipment from Shenzhen. Walk in, grab what you
            need, start building.
          </p>
          <p>
            The space runs indefinitely. It&apos;s not a pop-up. It&apos;s not a
            6-week program. It&apos;s just here — whenever you need it.
          </p>
          <div className="detail-list">
            <span className="tag">Soldering Stations</span>
            <span className="tag">3D Printers</span>
            <span className="tag">Oscilloscopes</span>
            <span className="tag">Component Library</span>
            <span className="tag">Microcontrollers</span>
            <span className="tag">Power Supplies</span>
            <span className="tag">Hand Tools</span>
            <span className="tag">Good Vibes</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="join">
        <div className="cta-shapes">
          <div className="shape s1"></div>
          <div className="shape s2"></div>
          <div className="shape s3"></div>
        </div>
        <h2 className="reveal">
          Got an idea?
          <br />
          <span className="highlight">Come build it.</span>
        </h2>
        <p
          className="subtext reveal"
          style={{ transitionDelay: "0.1s" }}
        >
          No application. No interview. No portfolio review. Just show up, or
          drop us a line if you want to know more.
        </p>
        <a
          href="mailto:hello@o1lab.space"
          className="cta-btn reveal"
          style={{ transitionDelay: "0.2s" }}
        >
          Get in touch
        </a>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="foot-logo">
            o1 <span>lab</span>
          </div>
          <p className="foot-tagline">
            Open access hardware lab. From zero to one.
          </p>
        </div>
        <div className="foot-col">
          <h5>Links</h5>
          <a href="#manifesto">About</a>
          <a href="#space">The Space</a>
          <a href="#who">Who It&apos;s For</a>
          <a href="#join">Get Involved</a>
        </div>
        <div className="foot-col">
          <h5>Connect</h5>
          <a href="#">Instagram</a>
          <a href="#">Twitter / X</a>
          <a href="#">Discord</a>
          <a href="mailto:hello@o1lab.space">Email</a>
        </div>
        <div className="foot-bottom">
          <p>© 2025 o1 lab</p>
          <p>Made in a garage in Sydney</p>
        </div>
      </footer>
    </>
  );
}
