---
title: Projects
permalink: /projects/
description: Portfolio projects and build logs.
---

<header class="page-header">
  <p class="eyebrow">Projects</p>
  <h1>Things I build while learning.</h1>
  <p>
    Project pages can be polished for applications while still preserving the
    thinking process behind the work.
  </p>
</header>

<section class="section compact">
  <div class="entry-list">
    {% assign projects = site.projects | sort: "year" | reverse %}
    {% for project in projects %}
      <article class="entry">
        <h2><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h2>
        <p>{{ project.summary }}</p>
        <div class="meta-row">
          {% if project.year %}<span>{{ project.year }}</span>{% endif %}
          {% if project.status %}<span>{{ project.status }}</span>{% endif %}
          {% if project.tools %}<span>{{ project.tools | join: " / " }}</span>{% endif %}
        </div>
      </article>
    {% endfor %}
  </div>
</section>
