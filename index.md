---
title: Home
---

<section class="home-intro">
  <div class="home-intro-main">
    <p class="eyebrow">Computer Science Learning Journal</p>
    <h1>Gary Yeh</h1>
    <p class="intro-copy">
      I am learning computer science in public: notes from courses, talks,
      papers, and projects, with an emphasis on what I understand, what confused
      me, and what I want to investigate next.
    </p>
    <div class="home-actions">
      <a class="text-link" href="{{ '/notes/' | relative_url }}">Read notes</a>
      <a class="text-link" href="{{ '/projects/' | relative_url }}">See projects</a>
    </div>
  </div>

  <aside class="status-panel" aria-label="Current study status">
    <p class="panel-label">Currently</p>
    <h2>Cornell CS4780</h2>
    <p>Machine learning foundations, model evaluation, generalization, and the mathematics behind learning from data.</p>
    <dl class="mini-stats">
      <div>
        <dt>Mode</dt>
        <dd>Self-study</dd>
      </div>
      <div>
        <dt>Output</dt>
        <dd>Notes + projects</dd>
      </div>
    </dl>
  </aside>
</section>

<section class="home-grid">
  <div class="home-block full">
    <div class="block-heading">
      <p class="eyebrow">Recent Notes</p>
      <a href="{{ '/notes/' | relative_url }}">All notes</a>
    </div>
    <div class="quiet-list">
      {% assign recent_notes = site.notes | sort: "date" | reverse | slice: 0, 3 %}
      {% for note in recent_notes %}
        <article class="quiet-row">
          <div>
            <h2><a href="{{ note.url | relative_url }}">{{ note.title }}</a></h2>
            <p>{{ note.summary }}</p>
          </div>
          <span>{{ note.course | default: "Note" }}</span>
        </article>
      {% endfor %}
    </div>
  </div>

  <aside class="home-block">
    <p class="eyebrow">Open Questions</p>
    <ul class="question-list">
      <li>How do models generalize beyond the examples they see?</li>
      <li>What assumptions hide inside common learning algorithms?</li>
      <li>When does a simple model beat a complex one?</li>
    </ul>
  </aside>

  <aside class="home-block">
    <p class="eyebrow">Learning Areas</p>
    <div class="tag-cloud" aria-label="Learning areas">
      <a href="{{ '/notes/' | relative_url }}">Machine Learning</a>
      <a href="{{ '/projects/' | relative_url }}">Projects</a>
      <a href="{{ '/reflections/' | relative_url }}">Talks</a>
      <span>Systems</span>
      <span>Theory</span>
      <span>Papers</span>
    </div>
  </aside>

  <div class="home-block full">
    <div class="block-heading">
      <p class="eyebrow">Featured Project</p>
      <a href="{{ '/projects/' | relative_url }}">Project archive</a>
    </div>
    {% assign featured_project = site.projects | first %}
    {% if featured_project %}
      <article class="feature-row">
        <div>
          <h2><a href="{{ featured_project.url | relative_url }}">{{ featured_project.title }}</a></h2>
          <p>{{ featured_project.summary }}</p>
        </div>
        <div class="meta-row">
          {% if featured_project.status %}<span>{{ featured_project.status }}</span>{% endif %}
          {% if featured_project.tools %}<span>{{ featured_project.tools | join: " / " }}</span>{% endif %}
        </div>
      </article>
    {% endif %}
  </div>
</section>
