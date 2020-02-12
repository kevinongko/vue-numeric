# Contributing guidelines
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Proposing a change
If you intend to change the public API, or make any non-trivial changes to the implementation, we recommend filing an issue. This lets us reach an agreement on your proposal before you put significant effort into it.

## Javascript style guides
- Javascript must adhere to [Vue.js official recommended style](https://github.com/vuejs/eslint-plugin-vue).
- Lint command: `npm run lint`.

## DocBlock
Every function, methods, computed properties, props should have a docblock to explain what it does

example:
```js
    /**
     * Check provided value againts maximum allowed.
     * @param {Number} value
     * @return {Boolean}
     */
    checkMaxValue (value) {
      if (this.max) {
        if (value <= this.maxValue) return false
        return true
      }
      return false
    },
```

## Test
- Make sure current tests is all green :white_check_mark:
- If you've added code that should be tested, add tests!
- Any new feature or changes should include tests for it.
- Make sure code coverage % does not decrease.

## Readme
Update the [README.md](https://github.com/kevinongko/vue-numeric/blob/master/README.md) with details of changes.
