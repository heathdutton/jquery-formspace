# jQuery Form Space
Hides fixed navigation when form fields are focused to conserve space on smaller screens.

Not all mobile browsers handle fixed navigations well. This plugin helps ease the pain and gain back a little screen realestate by hiding navigations whenever form fields are focussed.

## Example
Before:
![Before](/example/before.png?raw=true)
After:
![After](/example/after.png?raw=true)

## Usage
Include jQuery (1.11+) and the plugin on the page:
```html
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="https://cdn.rawgit.com/heathdutton/jquery-formspace/master/src/jquery.formspace.min.js"></script>
```
And run the library as needed in the body:
```html
<script type="text/javascript">
    $('body').formSpace();
</script>
```

## Options
The following additional options are supported:

```html
<script type="text/javascript">
    // You can target the entire body, or a specific form, etc.
    $('#mobile_form').formSpace({
        // Selector for header fixed navigation items. This default is as used in Bootstrap.
        header: '.navbar-fixed-top, .navbar-static-top',
        // Selector for footer fixed navigation items. This default is as used in Bootstrap.
        footer: '.navbar-fixed-bottom, .navbar-static-bottom',
        // The delay (in ms) after a DOM change before re-attaching to form fields.
        delay: 1000,
        // Selector for fields that we wish to detect focus on. These are fields that mobile devices will open a "keyboard" for.
        fields: 'input[type=text], input[type=password], input[type=tel], input[type=image], input[type=file], select, textarea',
        // Speed of the animation to hide.
        speed: 100,
        // Class/es to add for hiding, should CSS be needed.
        class: 'formspace_hidden',
        // Optionally use this for desktop as well.
        mobileOnly: true
    });
</script>
```
