---
title: Home
---

<section class="hero">
  <div class="hero-inner">
    <p class="hero-kicker">Computer Science Learning Journal</p>
    <h1>Learning in public, one idea at a time.</h1>
    <p>
      I use this space to document my path through computer science: course notes,
      machine learning concepts, project writeups, paper notes, and the questions
      that keep pulling me deeper.
    </p>
    <div class="hero-actions">
      <a class="button primary" href="{{ '/notes/' | relative_url }}">Browse notes</a>
      <a class="button" href="{{ '/projects/' | relative_url }}">View projects</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="section-header">
    <div>
      <p class="eyebrow">Current focus</p>
      <h2>Cornell CS4780 and the foundations of machine learning.</h2>
    </div>
    <p>
      This first version starts with ML, but the structure is meant to grow into a
      broader archive of courses, talks, papers, experiments, and portfolio work.
    </p>
  </div>

  <div class="grid">
    <article class="card">
      <h3>Learning Notes</h3>
      <p>Concepts explained in my own words, with emphasis on intuition, assumptions, and places where my understanding changed.</p>
    </article>
    <article class="card">
      <h3>Projects</h3>
      <p>Build logs for technical projects, including motivation, implementation choices, results, and next steps.</p>
    </article>
    <article class="card">
      <h3>Reflections</h3>
      <p>Short notes from papers, lectures, conferences, and talks that shape how I think about computer science.</p>
    </article>
  </div>
</section>

<section class="section compact">
  <div class="section-header">
    <div>
      <p class="eyebrow">Recent entries</p>
      <h2>Starting points</h2>
    </div>
    <p>These are sample entries you can edit, duplicate, or replace as your notes mature.</p>
  </div>

  <div class="entry-list">
    {% assign recent_notes = site.notes | sort: "date" | reverse | slice: 0, 3 %}
    {% for note in recent_notes %}
      <article class="entry">
        <h3><a href="{{ note.url | relative_url }}">{{ note.title }}</a></h3>
        <p>{{ note.summary }}</p>
        <div class="meta-row">
          {% if note.course %}<span>{{ note.course }}</span>{% endif %}
          {% if note.status %}<span>{{ note.status }}</span>{% endif %}
        </div>
      </article>
    {% endfor %}
  </div>
</section>
