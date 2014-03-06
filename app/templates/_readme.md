# <%= _.capitalize(data.appname) %>

## Tasks

### `$ grunt init`
This should be the first thing you do with a fresh project (after running the generator). All Bower components will be copied to their relevant directories, usually `/assets/js/lib/…`.

### `$ grunt`
The default task runs a `grunt-contrib-watch` task on your `Gruntfile.js`, CSS, Javascript and all other specified files. All watched files are compiled and processed under the `development` settings (compiled and still easy to debug).

Optionally, install the [Chrome LiveReload plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) to not have to manually refresh the browser after changes.

### `$ grunt build`
All `production` configured tasks are run in succession, such as SASS compilation (if opted in when running the generator), Javascript minification & image optimization. Note: optimised image paths will have to be updated in your HTML/CSS.

All files should be ready for deployment after running this task.

<% if (data.sass) { %>### `$ grunt css`
Compile all SASS files under the `development` flag option.<% } %>

### `$ grunt img`
Processes and optimises all images only.

### `$ grunt js`
Uglifies JS files only under the `development` flag option.

