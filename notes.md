---
title: Notebook
permalink: /notes/
description: Course notes, concept explanations, and study logs.
---

<header class="page-header notebook-header">
  <h1>Notebook</h1>
  <p>My notes on mathematics and machine learning.</p>
</header>

<section class="section compact notebook-entries">
  <div class="entry-list">
    {% assign notes = site.notes | sort: "date" | reverse %}
    {% for note in notes %}
      <article class="entry">
        <h2><a href="{{ note.url | relative_url }}">{{ note.title }}</a></h2>
        <p>{{ note.summary }}</p>
        {% if note.trail.size > 0 %}
          <div class="notebook-topics">
            <span>Topics:</span>
            <ul aria-label="Topics">
              {% for topic in note.trail %}<li>{{ topic | escape }}</li>{% endfor %}
            </ul>
          </div>
        {% endif %}
        <div class="notebook-meta">
          {% if note.date %}<time datetime="{{ note.date | date: '%Y-%m-%d' }}">{{ note.date | date: "%b %-d, %Y" }}</time>{% endif %}
          {% if note.status %}<span>{{ note.status | escape }}</span>{% endif %}
        </div>
      </article>
    {% endfor %}
  </div>
</section>
