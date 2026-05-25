# Gary — Computer Science Learning Journal

This is a Jekyll site for documenting a long-term journey through computer science:
course notes, machine learning study logs, project writeups, and reflections from
papers, lectures, talks, and conferences.

## Local preview

If Ruby 3 and Bundler are installed:

```sh
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000`.

The default macOS system Ruby may be too old for the current GitHub Pages gem.
If `bundle install` complains about Ruby version compatibility, install a newer
Ruby with a version manager such as `rbenv` or let GitHub Pages build the site
after pushing.

## GitHub Pages setup

For your main personal site, create a repository named:

```text
garyyehhh.github.io
```

Then push this project to that repository. GitHub Pages will publish it at:

```text
https://garyyehhh.github.io/
```

For a project site with another repository name, set `baseurl` in `_config.yml`:

```yml
baseurl: "/repository-name"
```

Then publish through the repository's Pages settings.

## Adding notes

Create a Markdown file in `_notes/` with front matter like:

```md
---
title: "My Note Title"
date: 2026-05-25
course: "Cornell CS4780"
status: "Draft"
tags:
  - machine learning
summary: "One sentence about what this note captures."
---
```

## Adding projects

Create a Markdown file in `_projects/` with:

```md
---
title: "Project Title"
year: 2026
status: "In progress"
tools:
  - Python
  - Jupyter
summary: "A short portfolio-facing description."
---
```

## Adding reflections

Create a Markdown file in `_reflections/` for talks, papers, lectures, and conference notes.
