---
title: Reflections
permalink: /reflections/
description: Notes from talks, papers, lectures, and conferences.
---

<header class="page-header">
  <p class="eyebrow">Reflections</p>
  <h1>Ideas from talks, papers, and conversations.</h1>
  <p>
    This is for lighter-weight entries: what stood out, what changed your mind,
    and what you want to investigate next.
  </p>
</header>

<section class="section compact">
  <div class="entry-list">
    {% assign reflections = site.reflections | sort: "date" | reverse %}
    {% for item in reflections %}
      <article class="entry">
        <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
        <p>{{ item.summary }}</p>
        <div class="meta-row">
          {% if item.date %}<span>{{ item.date | date: "%b %-d, %Y" }}</span>{% endif %}
          {% if item.source_type %}<span>{{ item.source_type }}</span>{% endif %}
          {% if item.tags %}<span>{{ item.tags | join: " / " }}</span>{% endif %}
        </div>
      </article>
    {% endfor %}
  </div>
</section>
