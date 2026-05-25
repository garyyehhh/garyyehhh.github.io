---
title: Learning Notes
permalink: /notes/
description: Course notes, concept explanations, and study logs.
---

<header class="page-header">
  <p class="eyebrow">Learning Notes</p>
  <h1>Concepts, courses, and study trails.</h1>
  <p>
    Use this section for lecture notes, self-study writeups, and explanations of
    ideas you want to keep refining over time.
  </p>
</header>

<section class="section compact">
  <div class="entry-list">
    {% assign notes = site.notes | sort: "date" | reverse %}
    {% for note in notes %}
      <article class="entry">
        <h2><a href="{{ note.url | relative_url }}">{{ note.title }}</a></h2>
        <p>{{ note.summary }}</p>
        <div class="meta-row">
          {% if note.date %}<span>{{ note.date | date: "%b %-d, %Y" }}</span>{% endif %}
          {% if note.course %}<span>{{ note.course }}</span>{% endif %}
          {% if note.status %}<span>{{ note.status }}</span>{% endif %}
          {% if note.tags %}<span>{{ note.tags | join: " / " }}</span>{% endif %}
        </div>
      </article>
    {% endfor %}
  </div>
</section>
