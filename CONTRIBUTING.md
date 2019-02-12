# Contributing to To-do List Extension

## Code of Conduct

Everyone contributes to this project is governed by [Code of Conduct](./CODE_OF_CONDUCT.md).

## How to contribute?

- Open a new GitHub pull request.
- In the pull request description, please clearly describe the problem and the solution.

## Coding Style

### JavaScript Style Guideline

All JavaScript code must adhere to [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

- Indent by **4** spaces
- `console.log` is allowed in development environment, but is not allowed in production environment.

Comments are necessary to `class`, `function` and `object`; JavaScript comments should adhere to [JSDoc](http://usejsdoc.org/).

### Stylesheet Style Guideline

All stylesheet code (including `CSS`, `Sass`, etc.) must adhere to BEM naming rules.

```css
.block__element--modifier {}

.button {}
.button--large {}

.nav {}
.nav__item {}
.nav__item--active {}
```

Please check [BEM naming](http://getbem.com/naming/).

### Commit Guideline

Commit should be semantic, see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)

Commit message should be in the following format:
```
<type>[optional scope]: <description>
[optional body]
[optional] footer
```

for example:

```
git commit -m "feat: add popup window"
```

