---
title: Design Tokens
layout: glossary-term.njk
furtherReading:
  - title:  Living Design System
    author: Sönke Rohde
    url:    https://medium.com/salesforce-ux/living-design-system-3ab1f2280ef7
  - title:  Tokens in Design Sytems
    author: Nathan Curtis
    url:    https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421
  - title:  Design Tokens for Dummies
    author: Louis Chenais
    url:    https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71
  - title:  Awesome Design Tokens
    author: Stu Robson
    url:    https://github.com/sturobson/Awesome-Design-Tokens
---

**Design tokens** are named entities that store visual design attributes. They are typically used to define colours, spacing (line, letter, padding, margin), typographic properties (font family, size, weight, etc.) and other attributes that need to be referenced many times throughout the UI. The concept of design tokens was pioneered by SalesForce, as part of their [Lightning Design System](https://www.lightningdesignsystem.com/).

Tokens can represent _options_ (i.e. the "raw", named values, such as a specific brand colours: "`Foobar Corp Acid Green` is `#00ff00`") or _decisions_ (i.e. the application of an option for a given context: "The `default border colour` for UI elements is `Foobar Corp Acid Green`"). Typically, you need a mixture of both. The tokens that represent options ensure that all _values_ only exist in _one_ place (thus making future changes easier), the others let you create common, shared set of design _decisions_ that can then be referenced elsewhere.

Some tools (such as [SalesForce Theo](https://github.com/salesforce-ux/theo), [Amazon Style Dictionary](https://amzn.github.io/style-dictionary/#/) and [Dragoman](https://natebaldwindesign.github.io/dragoman/)) allow you to store design token data centrally and then export it in a variety of formats (e.g. SASS variables) for direct usage within code and/or design tools. This allows your design tokens to become a platform-agnostic, single source of truth for all visual design attributes.
