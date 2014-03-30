sdtapir
=======

jQuery plugin for http://tapirgo.com/ based on the jquery.taprirus.js jQuery plugin at  http://www.metacotta.com/introducing-tapirus/ (which was not available at the time of writing).

This plugin is on Github as I couldn't find the original source of this plugin and needed to add some extensions to it. Mainly the ability to filter the returned results as I had duplicate search results and tapirgo.com wasn't responding to emails.

**NOTE:** The following guide takes the information pretty much verbatim from metacotta.

# Setup

What follows are the official setup instructions. If you want a user centered guide on how to setup Tapirus, you can read Add search to your Ghost blog with Tapir by Christos Matskas.

Tapirus requires a token from Tapir. You can get one on their website by filling in your email and the URL to your RSS feed (http://example.com/rss).

First we need to add the jQuery Tapirus script together with the dependencies. Open default.hbs and add the following code after {{ghost_foot}}:

```
<script src="/assets/js/moment.js"></script>  
<script src="/assets/js/handlebars.js"></script>  
<script src="/assets/js/jquery.tapirus.js"></script>  
```

Then open your theme's main JavaScript file, named index.js or main.js and add the initialization code to the end of the file:

```
$('.search-results').Tapirus('yourtapirtoken');
```

Replace yourtapirtoken with the public token you got from Tapir.

Time for some HTML. Let's add the search results container:

```
<div class="search-results"></div>  
```

You can place this inside default.hbs or index.hbs, where you want to display the search results.

And lastly, we'll need a searchbox:

```
<form>  
  <input type="search">
</form>  
```

You can place the above code anywhere inside one of the templates, where you want to display the searchbox. If the input element has the type attribute set to search, Tapirus will find it by default.

# Options

```
dateFormat: 'MMMM D, YYYY',  
queryFilter: function(query) {
  return query.replace(/\W/g, '');
},
inputSelector: 'input[type="search"]',  
sessionStorage: false,  
sortBy: undefined,  
templates: {  
  count: '<h3 class="search-results-count">{{count}} results for <q>{{query}}</q></h3>',
  result: '<div class="search-result"><h2 class="post-title"><a href="{{link}}">{{title}}</a></h2><time class="post-date" datetime="{{published_on}}">{{date}}</div>',
},
resultsExcludeFilter,
```

A date format string, parsed by Moment.js and available in the search result template.

**queryFilter**

A function to filter the search query. Should return a string.

**inputSelector**

A selector to find the search input.

**sessionStorage**

A boolean, indicating wheter to use session storage to cache the search. If you are using Modernizr, you can pass through Modernizr.sessionstorage.

**sortBy**

A string with the name of the property you want the search results to be sorted by, e.g. date. By default, search results are sorted by relevance.

**templates**

An object with templates to be used for displaying the search count and search results. **Both** options must be present i.e. count & result.

**

# Troubleshooting

**1. Your results are being duplicate:** For me I had moved my blog from http://www.shaydesdsgn.com to http://blog.shaydesdsgn.com. This resulted in my results being doubled. I could easiliy pass in the resultsExcludeFilter value of "www.shaydesdsgn" and it got rid of all the duplicated.


