var mail = angular.module("mail", [
	"ngQuill",
	"ngRoute",
	"ngStorage",
	"ui-notification",
]);

mail.config(function($routeProvider, $locationProvider, ngQuillConfigProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "home.html",
			controller: "",
		})
		.when("/home", {
			templateUrl: "home.html",
			controller: "",
		})
		.when("/mailbox", {
			templateUrl: "mailbox.html",
			controller: "MailboxController",
		})
		.when("/authentication", {
			templateUrl: "authentication.html",
			controller: "AuthenticationController",
		})
		.when("/settings", {
			templateUrl: "settings.html",
			controller: "SettingsController",
		});

	var modules = {
		toolbar: [
			["bold", "italic", "underline"],
			[
				{
					color: [
						"#ffffff",
						"#b2b2b2",
						"#4c4c4c",
						"#000000",
						"#ffff00",
						"#00ff00",
						"#ff0000",
						"#0000ff",
						"#7f7f00",
						"#007f00",
						"#7f0000",
						"#00007f",
						"#7f007f",
						"#00ffff",
						"#ff00ff",
						"#007fff",
					],
				},
				{ size: ["small", false, "large", "huge"] },
			],
			["link", "clean"],
		],
	};
	var theme = "bubble";
	var placeholder = "Message Body";
	var formats = ["bold", "color", "italic", "link", "size", "underline"];
	var boundary = document.body;
	var readOnly = false;
	ngQuillConfigProvider.set(
		modules,
		theme,
		placeholder,
		formats,
		boundary,
		readOnly
	);
});

mail.filter("orderObjectBy", function() {
	return function(items, fields) {
		var filtered = [];

		if (typeof fields == "string") fields = [fields];

		angular.forEach(items, function(item) {
			filtered.push(item);
		});

		for (i in fields.reverse()) {
			filtered.sort(function(a, b) {
				var first = fields[i][0];
				var field = fields[i].substring(1);
				if (first == "-") return a[field] > b[field] ? -1 : 1;
				else return a[fields[i]] > b[fields[i]] ? 1 : -1;
			});
		}

		return filtered;
	};
});

mail.filter("trust", [
	"$sce",
	function($sce) {
		return function(value, type) {
			// Defaults to treating trusted text as `html`
			return $sce.trustAs(type || "html", value);
		};
	},
]);

mail.filter("mailHtmlFix", function() {
	return function(value, marketItems) {
		var reg;
		// Font Things
		reg = "<font";
		value = value.replace(new RegExp(reg, "gi"), "<span");

		reg = "<\\/font>";
		value = value.replace(new RegExp(reg, "gi"), "</span>");

		reg = 'size="(\\d+)" color="#[a-f0-9]{2}([a-f0-9]{6})"';
		value = value.replace(
			new RegExp(reg, "gi"),
			'style="font-size: $1pt; color: #$2;"'
		);

		// zKill
		var characters = [
			1373,
			1374,
			1375,
			1376,
			1377,
			1378,
			1379,
			1380,
			1381,
			1382,
			1383,
			1384,
			1385,
			1386,
			34574,
		];
		reg =
			'<a href="showinfo:(' +
			characters.join("|") +
			')\\/\\/(\\d+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="https://zkillboard.com/character/$2" target="_blank">$3</a>'
		);

		var corporations = [2];
		reg =
			'<a href="showinfo:(' +
			corporations.join("|") +
			')\\/\\/(\\d+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="https://zkillboard.com/corporation/$2" target="_blank">$3</a>'
		);

		var alliances = [16159];
		reg =
			'<a href="showinfo:(' +
			alliances.join("|") +
			')\\/\\/(\\d+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="https://zkillboard.com/alliance/$2" target="_blank">$3</a>'
		);

		// Dotlan
		var stations = [
			54,
			56,
			57,
			58,
			59,
			1529,
			1530,
			1531,
			1926,
			1927,
			1928,
			1929,
			1930,
			1931,
			1932,
			2071,
			2496,
			2497,
			2498,
			2499,
			2500,
			2501,
			2502,
			3864,
			3865,
			3866,
			3867,
			3868,
			3869,
			3870,
			3871,
			3872,
			4023,
			4024,
			9856,
			9857,
			9867,
			9868,
			9873,
			10795,
			12242,
			12294,
			12295,
			19757,
			21642,
			21644,
			21645,
			21646,
			22296,
			22297,
			22298,
			29323,
			29387,
			29388,
			29389,
			29390,
			34325,
			34326,
		];
		reg =
			'<a href="showinfo:(' +
			stations.join("|") +
			')\\/\\/(\\d+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="http://evemaps.dotlan.net/station/$2" target="_blank">$3</a>'
		);

		var solarsystems = [5];
		reg =
			'<a href="showinfo:(' +
			solarsystems.join("|") +
			')\\/\\/(\\d+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="http://evemaps.dotlan.net/system/$2" target="_blank">$3</a>'
		);

		var constellations = [4];
		reg =
			'<a href="showinfo:(' +
			constellations.join("|") +
			')\\/\\/(\\d+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="http://evemaps.dotlan.net/map/$2" target="_blank">$3</a>'
		);

		var regions = [3];
		reg =
			'<a href="showinfo:(' +
			regions.join("|") +
			')\\/\\/(\\d+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="http://evemaps.dotlan.net/map/$2" target="_blank">$3</a>'
		);

		// Fuzzwork
		reg =
			'<a href="showinfo:(' +
			marketItems.join("|") +
			')\\/\\/(\\d+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="https://market.fuzzwork.co.uk/type/$2/" target="_blank">$3</a>'
		);

		// All other show info
		reg = '<a href="showinfo:(\\d+)\\/\\/(\\d+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<span class="missing-link">$3</span>'
		);

		// Fittings
		reg = '<a href="fitting:([0-9:;]+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="https://o.smium.org/loadout/dna/$1" target="_blank">$2</a>'
		);

		// Killmails
		reg = '<a href="killReport:(\\d+):(\\w+)">(.*?)<\\/a>';
		value = value.replace(
			new RegExp(reg, "gi"),
			'<a href="https://zkillboard.com/kill/$1" target="_blank">$3</a>'
		);

		return value;
	};
});

mail.directive("tooltip", function() {
	return function(scope, element, attrs) {
		$(element[0]).tooltip();
	};
});

mail.directive("ngEnter", function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13 && !event.shiftKey) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});

mail.controller("MailboxController", [
	"$scope",
	"Notification",
	function($scope, Notification) {
		// ==================== VARIABLES

		$scope.loadingAdd = 0;
		$scope.loadingMail = {};
		$scope.loadingMain = 0;
		$scope.loadingMore = 0;
		$scope.loadingSend = 0;

		$scope.mails = {};
		$scope.open = null;

		$scope.marketItems = [];

		$scope.send = {
			body: "",
			recipients: [],
			subject: "",
			to: "",
		};

		$.extend(true, $scope.$store.lookup, {
			alliance: {},
			character: {},
			corporation: {},
			mailing_list: {},
		});

		// ==================== HELPER FUNCTIONS

		var transformQuillToMail = function(input) {
			// Copy the input so we don't edit it.
			var str = angular.copy(input);

			// Remove extra lines caused by quill's blank-line handling.
			reg = "<p><br><\\/p>";
			str = str.replace(new RegExp(reg, "gi"), "<br>");

			// Replace Ps with BRs for compatibility with eve-mail.
			reg = "<p>(.+?)<\\/p>";
			str = str.replace(new RegExp(reg, "gi"), "$1<br>");

			// Make changes to font color.
			reg = 'style="color: rgb\\((\\d+), (\\d+), (\\d+)\\);"';
			str = str.replace(new RegExp(reg, "gi"), function(
				$match,
				$1,
				$2,
				$3
			) {
				$1 = ("00" + parseInt($1).toString(16)).substr(-2);
				$2 = ("00" + parseInt($2).toString(16)).substr(-2);
				$3 = ("00" + parseInt($3).toString(16)).substr(-2);
				return 'color="#ff' + $1 + $2 + $3 + '"';
			});

			// Make changes to font size.
			reg = 'class="ql-size-(huge|large|small)"';
			str = str.replace(new RegExp(reg, "gi"), function($match, $1) {
				if ($1 == "huge") $1 = "36";
				if ($1 == "large") $1 = "24";
				if ($1 == "small") $1 = "8";
				return 'size="' + $1 + '"';
			});

			// Replace span tags with font tags.
			reg = "<(\\/?)span";
			str = str.replace(new RegExp(reg, "gi"), "<$1font");

			// Return the new string.
			return str;
		};

		// ==================== UI FUNCTIONS

		$scope.addRecipient = function(name) {
			// Do nothing if name is blank.
			if (name == "") return;

			// Track that we're looking.
			$scope.loadingAdd++;

			// Try to find it in our already existing lists.
			var priority = [
				"character",
				"corporation",
				"alliance",
				"mailing_list",
			];
			for (p in priority) {
				var type = priority[p];

				for (id in $scope.$store.lookup[type]) {
					if ($scope.$store.lookup[type][id] == name) {
						// Add our recipient.
						$scope.send.recipients.push({
							recipient_id: id,
							recipient_type: type,
						});

						$scope.send.recipients.sort(function(a, b) {
							return $scope.$store.lookup[a.recipient_type][
								a.recipient_id
							].localeCompare(
								$scope.$store.lookup[b.recipient_type][
									b.recipient_id
								]
							);
						});

						// No longer looking.
						$scope.send.to = "";
						$scope.loadingAdd--;
						return;
					}
				}
			}

			// Can't find it? Look it up!
			var params = {
				search: name,
				categories: ["alliance", "character", "corporation"],
				strict: true,
			};

			client.Search
				.get_search(params)
				.then(function(data) {
					// Iterate through our types in priority order.
					var need = true;
					var count = 0;
					for (p in priority) {
						var type = priority[p];

						// Only continue is we have the type.
						if (data.obj[type] != undefined) {
							var arr = data.obj[type];

							// Increment counter to track number of types we hit.
							count++;

							// Iterate through the results in this type.
							for (i in arr) {
								var id = arr[i];

								// Save these in our lists, so we don't have to look them up again.
								$scope.$store.lookup[type][id] = name;

								// If we still need a recipient, add it.
								if (need) {
									need = false;
									$scope.send.recipients.push({
										recipient_id: id,
										recipient_type: type,
									});

									$scope.send.recipients.sort(function(a, b) {
										return $scope.$store.lookup[
											a.recipient_type
										][a.recipient_id].localeCompare(
											$scope.$store.lookup[
												b.recipient_type
											][b.recipient_id]
										);
									});
								}
							}
						}
					}

					// Alert if nothing was found.
					if (count == 0)
						Notification.error("No valid results found. Ignoring.");

					// No longer looking.
					$scope.send.to = "";
					$scope.loadingAdd--;
					$scope.$apply();
				})
				.catch(function(error) {
					console.log(error);
					$scope.send.to = "";
					$scope.loadingAdd--;
					$scope.$apply();
				});
		};

		$scope.clickMail = function(id) {
			if ($scope.open != null && !$scope.mails[$scope.open].is_read) {
				var mark_read = $scope.open;
				var params = {
					character_id: $scope.$store.characterId,
					mail_id: mark_read,
					contents: {
						read: true,
					},
				};

				client.Mail
					.put_characters_character_id_mail_mail_id(params)
					.then(function(data) {
						$scope.mails[mark_read].is_read = true;
						$scope.$apply();
					})
					.catch(function(error) {
						console.log(error);
					});
			}

			if ($scope.open == id) {
				$scope.open = null;
			} else {
				$scope.open = id;
				if ($scope.mails[id].full == undefined) {
					$scope.loadingMail[id]++;

					var params = {
						character_id: $scope.$store.characterId,
						mail_id: id,
					};

					client.Mail
						.get_characters_character_id_mail_mail_id(params)
						.then(function(data) {
							$scope.mails[id].full = data.obj;
							$scope.loadingMail[id]--;
							$scope.$apply();
						})
						.catch(function(error) {
							console.log(error);
						});
				}
			}
		};

		$scope.deleteMail = function(id) {
			if (confirm("Are you sure?")) {
				var params = {
					character_id: $scope.$store.characterId,
					mail_id: id,
				};

				$scope.loadingMail[id]++;
				client.Mail
					.delete_characters_character_id_mail_mail_id(params)
					.then(function(data) {
						if ($scope.open == id) $scope.open = null;
						delete $scope.mails[id];
						$scope.loadingMail[id]--;
						$scope.$apply();
					})
					.catch(function(error) {
						console.log(error);
					});
			}
		};

		$scope.loadMore = function() {
			// Set up our params.
			var params = {
				character_id: $scope.$store.characterId,
			};

			// Check if we need to pass and ID.
			var last = null;
			for (i in $scope.mails)
				if (last == null || $scope.mails[i].mail_id < last)
					last = $scope.mails[i].mail_id;

			if (last != null) params.last_mail_id = last;

			// Actually do the call.
			$scope.loadingMore++;
			client.Mail
				.get_characters_character_id_mail(params)
				.then(function(data) {
					for (i in data.obj) {
						$scope.mails[data.obj[i].mail_id] = data.obj[i];
						$scope.loadingMail[data.obj[i].mail_id] = 0;
					}
					$scope.loadingMore--;
					$scope.$apply();
				})
				.catch(function(error) {
					console.log(error);
				});
		};

		$scope.newMail = function(mail, to) {
			$scope.send = {
				body: "",
				original: null,
				recipients: [],
				subject: "",
				to: "",
			};

			if (mail != undefined && to != undefined) {
				// Store the mail we're replying to.
				$scope.send.original = mail;

				// Prep our recipients.
				if (to == "all") {
					$scope.send.recipients = mail.recipients.concat([
						{
							recipient_id: mail.from,
							recipient_type: "character",
						},
					]);
				} else {
					$scope.send.recipients = [
						{
							recipient_id: mail.from,
							recipient_type: "character",
						},
					];
				}

				// Reply with the subject.
				$scope.send.subject = "Re: " + mail.subject;
			}

			$("#newMailModal").modal("show");
		};

		$scope.parseLookup = function(list, includeType) {
			var ret = "";
			var need = [];
			var lists = [];
			for (i in list) {
				var type = list[i].recipient_type;
				var id = list[i].recipient_id;

				if ($scope.$store.lookup[type][id] == undefined) {
					if (type == "mailing_list") lists.push(id);
					else need.push(id);
				} else {
					ret += $scope.$store.lookup[type][id];
					if (includeType) ret += " (" + type + ")";
					ret += ", ";
				}
			}

			if (need.length > 0) {
				var params = {
					ids: need,
				};

				client.Universe
					.post_universe_names(params)
					.then(function(data) {
						for (i in data.obj) {
							var item = data.obj[i];
							$scope.$store.lookup[item.category][item.id] =
								item.name;
						}
						$scope.$apply();
					})
					.catch(function(error) {
						console.log(error);
					});
			}

			return ret.slice(0, -2);
		};

		$scope.removeRecipient = function(which) {
			var i = $scope.send.recipients.indexOf(which);
			$scope.send.recipients.splice(i, 1);
		};

		$scope.sendMail = function() {
			// Check our inputs.
			if ($scope.send.subject == "" || $scope.send.recipients.length == 0)
				return;

			// Set up our data to send.
			var body = $scope.send.body;
			var recipients = $scope.send.recipients;
			var subject = $scope.send.subject;

			body = transformQuillToMail(body);
			if ($scope.send.original != null) {
				body += "<br>--------------------------------<br>";
				body += $scope.send.original.full.subject;
				body += "<br>";
				body +=
					"From: " +
					$scope.$store.lookup.character[
						$scope.send.original.full.from
					];
				body += "<br>";
				body +=
					"Sent: " +
					$scope.send.original.full.timestamp
						.slice(0, -1)
						.replace("T", " ");
				body += "<br>";
				body +=
					"To: " +
					$scope.parseLookup($scope.send.original.recipients, false);
				body += "<br><br>";
				body += $scope.send.original.full.body;
			}

			// Let's go!
			var params = {
				character_id: $scope.$store.characterId,
				mail: {
					approved_cost: 0,
					body: body,
					recipients: recipients,
					subject: subject,
				},
			};

			client.Mail
				.post_characters_character_id_mail(params)
				.then(function(data) {
					Notification.success("Mail sent!");
				})
				.catch(function(error) {
					Notification.error("Could not send mail.");
					console.log(error);
				});
		};

		$scope.toggleRead = function(id) {
			var params = {
				character_id: $scope.$store.characterId,
				mail_id: id,
				contents: {
					read: !$scope.mails[id].is_read,
				},
			};

			client.Mail
				.put_characters_character_id_mail_mail_id(params)
				.then(function(data) {
					$scope.mails[id].is_read = !$scope.mails[id].is_read;
					$scope.$apply();
				})
				.catch(function(error) {
					console.log(error);
				});
		};

		// ==================== EVENTS AND INTERVALS

		// ==================== ONLOAD

		if ($scope.hasAuthentication()) {
			$scope.loadingMain++;
			var client = new SwaggerClient({
				url:
					"https://esi.tech.ccp.is/latest/swagger.json?datasource=tranquility",
				usePromise: true,
				authorizations: {
					evesso: new SwaggerClient.ApiKeyAuthorization(
						"Authorization",
						"Bearer " + $scope.$sess.access_token,
						"header"
					),
				},
			}).then(function(sc) {
				client = sc;

				var params = {
					character_id: $scope.$store.characterId,
				};

				$scope.loadingMain++;
				client.Mail
					.get_characters_character_id_mail(params)
					.then(function(data) {
						for (i in data.obj) {
							$scope.mails[data.obj[i].mail_id] = data.obj[i];
							$scope.loadingMail[data.obj[i].mail_id] = 0;
						}
						$scope.loadingMain--;
						$scope.$apply();
					})
					.catch(function(error) {
						console.log(error);
					});

				$scope.loadingMain++;
				client.Mail
					.get_characters_character_id_mail_lists(params)
					.then(function(data) {
						for (i in data.obj) {
							var item = data.obj[i];
							$scope.$store.lookup["mailing_list"][
								item.mailing_list_id
							] =
								item.name;
						}
						$scope.loadingMain--;
						$scope.$apply();
					})
					.catch(function(error) {
						console.log(error);
					});

				$scope.loadingMain++;
				client.Market
					.get_markets_prices({})
					.then(function(data) {
						$scope.marketItems = data.obj.map(function(item) {
							return item.type_id;
						});
						$scope.marketItems.sort(function(a, b) {
							return a - b;
						});
						$scope.loadingMain--;
						$scope.$apply();
					})
					.catch(function(error) {
						console.log(error);
					});

				$scope.loadingMain--;
			});
		}
	},
]);

mail.controller("MasterController", [
	"$scope",
	"$location",
	"$localStorage",
	"$sessionStorage",
	function($scope, $location, $localStorage, $sessionStorage) {
		// ==================== VARIABLES

		$scope.$sess = $sessionStorage;
		$scope.$store = $localStorage.$default({
			lookup: {},
		});
		$scope.location = $location;

		// ==================== HELPER FUNCTIONS

		// ==================== FUNCTIONALITY

		// ==================== UI FUNCTIONS

		$scope.hasAuthentication = function() {
			return (
				$scope.$sess.access_token != undefined &&
				$scope.$sess.access_token != null &&
				$scope.$sess.access_token != "" &&
				$scope.$store.characterId != undefined &&
				$scope.$store.characterId != null &&
				$scope.$store.characterId != "" &&
				$scope.$sess.expires_on != undefined &&
				$scope.$sess.expires_on != null &&
				$scope.$sess.expires_on > Date.now()
			);
		};

		// ==================== EVENTS AND INTERVALS

		// ==================== ONLOAD
	},
]);

mail.controller("AuthenticationController", [
	"$scope",
	function($scope) {
		// ==================== VARIABLES

		// ==================== HELPER FUNCTIONS

		// ==================== FUNCTIONALITY

		// ==================== UI FUNCTIONS

		$scope.oauthRedirect = function() {
			var state = Math.random()
				.toString(36)
				.substring(7);
			$scope.$sess.state = state;

			var url = "https://login.eveonline.com/oauth/authorize";
			url += "?response_type=token";
			url += "&client_id=" + CLIENT_ID;
			url += "&redirect_uri=" + REDIRECT_URI;
			url +=
				"&scope=esi-mail.organize_mail.v1 esi-mail.read_mail.v1 esi-mail.send_mail.v1";
			url += "&state=" + state;

			window.location = encodeURI(url);
		};

		$scope.oauthRevoke = function() {
			var url = "https://login.eveonline.com/oauth/revoke";
			url += "?token=" + $scope.$sess.access_token;

			$scope.$sess.$reset();

			window.location = encodeURI(url);
		};

		// ==================== EVENTS AND INTERVALS

		// ==================== ONLOAD
	},
]);

mail.controller("SettingsController", [
	"$scope",
	function($scope) {
		// ==================== VARIABLES
		// ==================== HELPER FUNCTIONS
		// ==================== FUNCTIONALITY
		// ==================== UI FUNCTIONS
		// ==================== EVENTS AND INTERVALS
		// ==================== ONLOAD
	},
]);
