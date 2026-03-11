---
title: "Create blog website using Jekyll"
summary: "A short setup log for publishing a simple Jekyll blog to GitHub Pages."
publishedAt: 2024-09-27
tags:
  - web
  - jekyll
  - github-pages
featured: true
---

Simply creating a blog website can be straightforward if you start from a theme built by someone else and customize it to fit your own writing.

## Step 1: Software setup

Install Ruby with Homebrew:

```sh
brew install ruby
```

The prerequisite tools are `gcc` and `make`:

```sh
brew install gcc make
```

Then add Ruby to your shell path:

```sh
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
```

Reload your shell configuration:

```sh
source ~/.zshrc
```

Install Bundler:

```sh
gem install bundler
```

And make sure the Jekyll executable directory is available on your `PATH`:

```sh
export PATH="$PATH:/Users/winifred/.gem/ruby/3.3.0/bin"
```

After any change to `Gemfile`, run:

```sh
bundle install
```

## Step 2: Edit the theme details

After cloning the repository from GitHub, start editing the Markdown files. Add a `_posts` folder at the root of the site, place blog posts inside it, and create a page like `blog.md` to collect them.

```md
---
layout: page
permalink: /blog
permalink_name: /blog
title: "Your title"
---

# Your title

Add all the content here.
```

## Step 3: Upload to GitHub Pages

Commit and push your changes:

```sh
git add .
git commit -m "Describe your changes here"
git push origin main
```

Then point GitHub Pages at the correct branch and folder.
