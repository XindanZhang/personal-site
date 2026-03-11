---
title: "Add the search box to blog pages"
summary: "A tiny UI note on making a search field visible and usable for blog readers."
publishedAt: 2024-09-28
tags:
  - ui
  - css
  - blog
---

Add a search input to `blog.md`:

```html
<input type="text" id="searchInput" placeholder="Search blogs..." />
```

Then style it to make it readable and easy to spot:

```css
#searchInput {
  width: 100%;
  padding: 10px;
  margin: 20px 0;
  font-size: 16px;
  border: 2px solid #4a4a4a;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #333;
}
```

Simple details like spacing, contrast, and border treatment make a big difference for blog usability.
