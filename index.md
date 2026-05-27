---
title: Home
---

{% assign latest_note = site.notes | sort: "date" | reverse | first %}
{% assign recent_notes = site.notes | sort: "date" | reverse | slice: 0, 3 %}
{% assign featured_project = site.projects | first %}

<section class="home-hero">
  <div class="home-hero-copy">
    <p class="eyebrow">Computer Science Learning Garden</p>
    <h1>Gary Yeh</h1>
    <p class="intro-copy">
      A public notebook for learning computer science through courses, papers,
      talks, and projects. I use this space to make ideas concrete: what I
      understand, what still feels unresolved, and what I am building next.
    </p>
    <div class="home-actions">
      <a class="hero-action" href="{{ latest_note.url | default: '/notes/' | relative_url }}">Read the latest note</a>
      <a class="hero-action" href="{{ '/projects/' | relative_url }}">See current projects</a>
    </div>
  </div>

  <aside class="desk-note" aria-label="Current desk note">
    <p class="soft-label">Current desk note</p>
    <h2>Cornell CS4780</h2>
    <p>Machine learning foundations, model evaluation, generalization, and the mathematics behind learning from data.</p>
    <div class="thread-note">
      <span>Thread I'm following</span>
      <p>How do models learn patterns that still hold beyond the training data?</p>
    </div>
    <div class="learning-trail" aria-label="Learning trail">
      <span>Foundations</span>
      <span>Models</span>
      <span>Generalization</span>
      <span>Application</span>
    </div>
  </aside>
</section>

<section class="on-desk" aria-label="Work on the desk">
  <p class="overline">On the desk</p>
  <div class="on-desk-grid">
  <article class="desk-item desk-item-primary">
    <span class="soft-label">Latest from the notebook</span>
    {% if latest_note %}
      <strong><a href="{{ latest_note.url | relative_url }}">{{ latest_note.title }}</a></strong>
      <p>{{ latest_note.summary }}</p>
      {% if latest_note.thinking_excerpt %}
        <blockquote class="thinking-excerpt">
          <span>From the note</span>
          <p>{{ latest_note.thinking_excerpt }}</p>
        </blockquote>
      {% endif %}
    {% endif %}
  </article>

  <div class="desk-side">
    <article class="desk-item">
      <span class="soft-label">Currently building</span>
      {% if featured_project %}
        <strong><a href="{{ featured_project.url | relative_url }}">{{ featured_project.title }}</a></strong>
        <p>{{ featured_project.status | default: "In progress" }}</p>
      {% endif %}
    </article>
    <article class="desk-item">
      <span class="soft-label">Question I keep returning to</span>
      <strong>How do models generalize?</strong>
      <p>Why does performance sometimes transfer beyond the examples a model was trained on?</p>
    </article>
  </div>
  </div>
</section>

<section class="home-section notes-panel">
  <div class="section-heading">
    <div>
      <p class="overline">Notebook</p>
      <div class="section-heading-row">
        <h2>The working record.</h2>
        <a class="section-link" href="{{ '/notes/' | relative_url }}">All notes</a>
      </div>
      <p>Fresh notes and study maps, written to make ideas easier to revisit, test, and explain later.</p>
    </div>
  </div>

  <div class="note-list">
    {% for note in recent_notes %}
      <article class="note-row">
        <span class="note-index">0{{ forloop.index }}</span>
        <div>
          <h3><a href="{{ note.url | relative_url }}">{{ note.title }}</a></h3>
          <p>{{ note.summary }}</p>
          <span class="note-meta">
            {% if note.trail %}
              {{ note.trail | join: " · " }}
            {% else %}
              {{ note.course | default: "Note" }}
            {% endif %}
          </span>
        </div>
      </article>
    {% endfor %}
  </div>
</section>

<section class="explore-section" aria-label="Explore the learning garden">
  <div class="section-heading">
    <div>
      <p class="overline">Explore</p>
      <h2>Paths through the archive.</h2>
      <p>Quiet doors into the notes, projects, and reflections that connect the work over time.</p>
    </div>
  </div>

  <div class="explore-grid">
    <a class="explore-card notes-card" href="{{ '/notes/' | relative_url }}">
      <span class="soft-label">Notes</span>
      <strong>Concepts and study trails</strong>
      <p>Course notes, templates, and explanations I want to keep refining.</p>
    </a>

    <a class="explore-card project-card" href="{{ '/projects/' | relative_url }}">
      <span class="soft-label">Projects</span>
      <strong>Things built while learning</strong>
      <p>Small tools, experiments, and portfolio pieces connected back to the notes.</p>
    </a>

    <a class="explore-card reflection-card" href="{{ '/reflections/' | relative_url }}">
      <span class="soft-label">Reflections</span>
      <strong>Talks, papers, and conversations</strong>
      <p>Lighter entries for ideas that changed my mind or opened a new question.</p>
    </a>
  </div>
</section>
