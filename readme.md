# Svejo App

This is [Mavo App]([https://mavo.io/]) to keep track of sales done. Is really a basic system, but it can be used as a starting point for more complex situations.

You can find a demo which stores data in the device local storage at this [link](https://svejodemo.netlify.app/).

To store data to dropbox, replace the property attribute "local" in the body tag with the sharable link of a csv o json file in your dropbox account, and add the mv-plugins="dropbox" property:

```html
<!-- before -->
<body [...] mv-storage="local" mv-format="csv" [...]>

<!-- after -->
<body [...] mv-storage="https://www.dropbox.com/path/to/the/file/" mv-plugins="dropbox" mv-format="csv" [...]>

```

If you want to store your entries to another remote backend (e.g. github) take a look at the [offical Mavo documentation](https://mavo.io/docs/storage).
