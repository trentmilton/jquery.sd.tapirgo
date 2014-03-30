(function($) {
	$.fn.tapirgo = function(token, options) {
		options = $.extend({
			dateFormat: 'DD MMM YY',
			queryFilter: undefined,
			inputSelector: 'input[type="search"]',
			sessionStorage: false,
			sortBy: undefined,
			templates: {
				count: '<div class="search-results-count">{{count}} results for "{{query}}"</div>',
				result: '<div class="search-result"><div class="search-result-top-border"></div><span class="post-date">{{date}}</span><span class="post-title"><a href="{{link}}">{{title}}</a></span></div>',
			},
			resultsExcludeFilter: undefined,
		},
		options);

		// Elements
		var $window = $(window);
		var $body = $(document.body);
		var $input = $(options.inputSelector);
		var $form = $input.parent();
		var $element = $(this);

		// Setup Tapir
		var tapir = Tapir(token, options.url);

		// API
		var self = {
				reset: function() {
					$element.empty();
					$body.removeClass('search-active');
					sessionStorage.removeItem('tapirsearchquery');
				},
				submit: function(query) {
					if(query === '') return;
					tapir.search(query, options.queryFilter, options.sortBy).done(function(results) {
						if(results.length) {
							var $results = $('<span></span>');
							var filteredResultsCount = 0;
							$(results).each(function() {
								var patt = new RegExp(options.resultsExcludeFilter);
								if (options.resultsExcludeFilter.length > 0 && (
									(this.title !== null && this.title.match(patt) !== null) ||
									(this.link !== null && this.link.match(patt) !== null) ||
									(this.content !== null && this.content.match(patt) !== null) ||
									(this.summary !== null && this.summary.match(patt) !== null))) {
									// Nothing to do, what you gonna do punk?
								} else {
									// Add formatted date
									if(typeof moment === 'function') this.date = moment(this.published_on).format(options.dateFormat);
									var $dummy = $('<div></div>').html(Handlebars.compile(options.templates.result)(this));
									$results.append($dummy.html());
									filteredResultsCount ++;
								}
							});
							$element.append(Handlebars.compile(options.templates.count)({count: filteredResultsCount, query: query}));
							$element.append($results.html());
						}
						else {
							$element.append(Handlebars.compile(options.templates.count)({count: 0, query: query}));
						}
						$body.addClass('search-active');
						// Save
						if(options.sessionStorage) {
							sessionStorage.setItem('tapirsearchquery', query);
							sessionStorage.setItem('tapirsearchcache', JSON.stringify(tapir.getCache()));
						}
					});
				},
			};

		// Session
		if(options.sessionStorage) {
			var cache = sessionStorage.getItem('tapirsearchcache'),
				query = sessionStorage.getItem('tapirsearchquery');
			if(cache) {
				tapir.setCache(JSON.parse(cache));
			}
			if(query) {
				self.submit(query);
				$input.val(query);
			}
		}

		// Events
		$form.on('reset', function(event) {
			self.reset();
		}).on('submit', function(event) {
			event.preventDefault();
			self.reset();
			self.submit($input.val());
		});
		$input.on('input', function() {
			if($(this).val() === '') self.reset();
		});

		// Core Tapir search
		function Tapir(token, url) {
			var cache = {};
			url = url || 'http://www.tapirgo.com/api/1/search.json?token=%token&query=%query&callback=?';
			url = url.replace('%token', token);
			return {
				getCache: function() {
					return cache;
				},
				setCache: function(newcache) {
					cache = newcache;
				},
				search: function(query, queryFilter, sortBy) {
					var deferred = $.Deferred();
					query = (typeof queryFilter === 'function' ? queryFilter(query) : query.replace(/\W/g, ''));
					// Empty
					if(query === '') {
						resolve([]);
					}
					// In cache
					else if(cache[query]) {
						resolve(cache[query]);
					}
					// Load to cache
					else {
						$.getJSON(url.replace('%query', encodeURI(query))).done(function(results) {
							resolve(cache[query] = results);
						});
					}
					function resolve(results) {
						if(results.length && typeof sortBy === 'string') {
							results = results.sort(function(a, b) {
								var x = a[sortBy],
									y = b[sortBy];
								return ((x < y) ? -1 : ((x > y) ? 1 : 0));
							});
						}
						deferred.resolve(results);
					}
					// Promise results
					return deferred.promise();
				},
			}
		}
		return this;
	};
})
(jQuery);