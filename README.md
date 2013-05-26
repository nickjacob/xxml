# xxml
## client-side XML generation

### `XXML.stringify`

The main point of this library is to provide a `XXML.stringify` that is identical in functionality to `JSON.stringify`; eventually may add a parsing function. For an example:
```javascript
var xml = {
  places: [
    {
      text: 'Boston',
      state: 'MA'
    },
    'New York'
  ],
  owner: {
    attrs: {
      age: '20'
    },
    name: {
      attrs: {
        type: 'full'
      },
      first: 'Joe',
      last: 'Cool'
    }
  }
};

console.log(XXML.stringify(xml));
```

produces...

```xml
<xml>
  <places state="MA">Boston</places>
  <places>New York</places>
  <owner age="20">
    <name type="full">
      <first>Joe</first>
      <last>Cool</last>
    </name>
  </owner>
</xml>
```

### `filesystem.js`

This provides a simplification of the HTML5 filesystem API, a really simple `createFile` function and a corresponding `read` and `write` function for a `FFile` object. Usage in `test.html`.
