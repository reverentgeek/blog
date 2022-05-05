---
id: 5b7d83816ada047f703ba98f
title: "Buy My Stuff!"
feature_image: /content/images/reverentgeek-shop-banner.jpg
description: ""
date: 2018-05-19
tags: page
slug: shop
layout: layouts/page.njk
---

* [Commission a Drawing!](#commission)
* [Stickers!](#stickers)
* [T-Shirts!](#tshirts)

<a name="commission"></a>

## Commission a Drawing!

I draw avatars you can use for social media, blogs, presentations, business cards... whatever! Check out my [avatar
gallery](/avatars) for more examples.

<div id='collection-component-1648734448643'></div>
<script type="text/javascript">
	/*<![CDATA[*/
	(function () {
		var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
		if (window.ShopifyBuy) {
			if (window.ShopifyBuy.UI) {
				ShopifyBuyInit();
			} else {
				loadScript();
			}
		} else {
			loadScript();
		}
		function loadScript() {
			var script = document.createElement('script');
			script.async = true;
			script.src = scriptURL;
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
			script.onload = ShopifyBuyInit;
		}
		function ShopifyBuyInit() {
			var client = ShopifyBuy.buildClient({
				domain: 'reverentgeek.myshopify.com',
				storefrontAccessToken: 'aed29b6a0c44f6cc2ff2bdbcb8e6d687',
			});
			ShopifyBuy.UI.onReady(client).then(function (ui) {
				ui.createComponent('collection', {
					id: '58943340621',
					node: document.getElementById('collection-component-1648734448643'),
					moneyFormat: '%24%7B%7Bamount%7D%7D',
					options: {
						"product": {
							"styles": {
								"product": {
									"@media (min-width: 601px)": {
										"max-width": "calc(25% - 20px)",
										"margin-left": "20px",
										"margin-bottom": "50px",
										"width": "calc(25% - 20px)"
									},
									"img": {
										"height": "calc(100% - 15px)",
										"position": "absolute",
										"left": "0",
										"right": "0",
										"top": "0"
									},
									"imgWrapper": {
										"padding-top": "calc(75% + 15px)",
										"position": "relative",
										"height": "0"
									}
								},
								"button": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px",
									":hover": {
										"background-color": "#3158bf"
									},
									"background-color": "#3662d4",
									":focus": {
										"background-color": "#3158bf"
									}
								},
								"quantityInput": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px"
								}
							},
							"text": {
								"button": "Add to cart"
							}
						},
						"productSet": {
							"styles": {
								"products": {
									"@media (min-width: 601px)": {
										"margin-left": "-20px"
									}
								}
							}
						},
						"modalProduct": {
							"contents": {
								"img": false,
								"imgWithCarousel": true,
								"button": false,
								"buttonWithQuantity": true
							},
							"styles": {
								"product": {
									"@media (min-width: 601px)": {
										"max-width": "100%",
										"margin-left": "0px",
										"margin-bottom": "0px"
									}
								},
								"button": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px",
									":hover": {
										"background-color": "#3158bf"
									},
									"background-color": "#3662d4",
									":focus": {
										"background-color": "#3158bf"
									}
								},
								"quantityInput": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px"
								}
							}
						},
						"option": {},
						"cart": {
							"styles": {
								"button": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px",
									":hover": {
										"background-color": "#3158bf"
									},
									"background-color": "#3662d4",
									":focus": {
										"background-color": "#3158bf"
									}
								},
								"title": {
									"color": "#4c4c4c"
								},
								"header": {
									"color": "#4c4c4c"
								},
								"lineItems": {
									"color": "#4c4c4c"
								},
								"subtotalText": {
									"color": "#4c4c4c"
								},
								"subtotal": {
									"color": "#4c4c4c"
								},
								"notice": {
									"color": "#4c4c4c"
								},
								"currency": {
									"color": "#4c4c4c"
								},
								"close": {
									"color": "#4c4c4c",
									":hover": {
										"color": "#4c4c4c"
									}
								},
								"empty": {
									"color": "#4c4c4c"
								},
								"noteDescription": {
									"color": "#4c4c4c"
								},
								"discountText": {
									"color": "#4c4c4c"
								},
								"discountIcon": {
									"fill": "#4c4c4c"
								},
								"discountAmount": {
									"color": "#4c4c4c"
								}
							}
						},
						"toggle": {
							"styles": {
								"toggle": {
									"background-color": "#3662d4",
									":hover": {
										"background-color": "#3158bf"
									},
									":focus": {
										"background-color": "#3158bf"
									}
								},
								"count": {
									"font-size": "16px"
								}
							}
						},
						"lineItem": {
							"styles": {
								"variantTitle": {
									"color": "#4c4c4c"
								},
								"title": {
									"color": "#4c4c4c"
								},
								"price": {
									"color": "#4c4c4c"
								},
								"fullPrice": {
									"color": "#4c4c4c"
								},
								"discount": {
									"color": "#4c4c4c"
								},
								"discountIcon": {
									"fill": "#4c4c4c"
								},
								"quantity": {
									"color": "#4c4c4c"
								},
								"quantityIncrement": {
									"color": "#4c4c4c",
									"border-color": "#4c4c4c"
								},
								"quantityDecrement": {
									"color": "#4c4c4c",
									"border-color": "#4c4c4c"
								},
								"quantityInput": {
									"color": "#4c4c4c",
									"border-color": "#4c4c4c"
								}
							}
						}
					},
				});
			});
		}
	})();
/*]]>*/
</script>

> Disclaimer: Please bear in mind an avatar illustration is a hand-drawn cartoon "likeness" at best, and is not a 100%
accurate digital portrait. A hand-drawn illustration is intended for entertainment purposes only.

After your order, you should receive an email or text confirmation. Please reply to that message with the photo(s) you
wish to be drawn, and include eye color or any other details.

Got an idea for something else? Send it to me at [david@reverentgeek.com](mailto:david@reverentgeek.com)! I have drawn
custom illustrations and artwork for events, conferences, meet-ups, advertising campaigns, books, and articles.

<a name="stickers"></a>

## Stickers!

<div id='collection-component-1651753195550'></div>
<script type="text/javascript">
	/*<![CDATA[*/
	(function () {
		var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
		if (window.ShopifyBuy) {
			if (window.ShopifyBuy.UI) {
				ShopifyBuyInit();
			} else {
				loadScript();
			}
		} else {
			loadScript();
		}
		function loadScript() {
			var script = document.createElement('script');
			script.async = true;
			script.src = scriptURL;
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
			script.onload = ShopifyBuyInit;
		}
		function ShopifyBuyInit() {
			var client = ShopifyBuy.buildClient({
				domain: 'reverentgeek.myshopify.com',
				storefrontAccessToken: 'aed29b6a0c44f6cc2ff2bdbcb8e6d687',
			});
			ShopifyBuy.UI.onReady(client).then(function (ui) {
				ui.createComponent('collection', {
					id: '162187608169',
					node: document.getElementById('collection-component-1651753195550'),
					moneyFormat: '%24%7B%7Bamount%7D%7D',
					options: {
						"product": {
							"styles": {
								"product": {
									"@media (min-width: 601px)": {
										"max-width": "calc(25% - 20px)",
										"margin-left": "20px",
										"margin-bottom": "50px",
										"width": "calc(25% - 20px)"
									},
									"img": {
										"height": "calc(100% - 15px)",
										"position": "absolute",
										"left": "0",
										"right": "0",
										"top": "0"
									},
									"imgWrapper": {
										"padding-top": "calc(75% + 15px)",
										"position": "relative",
										"height": "0"
									}
								},
								"button": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px",
									":hover": {
										"background-color": "#3158bf"
									},
									"background-color": "#3662d4",
									":focus": {
										"background-color": "#3158bf"
									}
								},
								"quantityInput": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px"
								}
							},
							"text": {
								"button": "Add to cart"
							}
						},
						"productSet": {
							"styles": {
								"products": {
									"@media (min-width: 601px)": {
										"margin-left": "-20px"
									}
								}
							}
						},
						"modalProduct": {
							"contents": {
								"img": false,
								"imgWithCarousel": true,
								"button": false,
								"buttonWithQuantity": true
							},
							"styles": {
								"product": {
									"@media (min-width: 601px)": {
										"max-width": "100%",
										"margin-left": "0px",
										"margin-bottom": "0px"
									}
								},
								"button": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px",
									":hover": {
										"background-color": "#3158bf"
									},
									"background-color": "#3662d4",
									":focus": {
										"background-color": "#3158bf"
									}
								},
								"quantityInput": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px"
								}
							}
						},
						"option": {},
						"cart": {
							"styles": {
								"button": {
									"font-size": "16px",
									"padding-top": "16px",
									"padding-bottom": "16px",
									":hover": {
										"background-color": "#3158bf"
									},
									"background-color": "#3662d4",
									":focus": {
										"background-color": "#3158bf"
									}
								},
								"title": {
									"color": "#4c4c4c"
								},
								"header": {
									"color": "#4c4c4c"
								},
								"lineItems": {
									"color": "#4c4c4c"
								},
								"subtotalText": {
									"color": "#4c4c4c"
								},
								"subtotal": {
									"color": "#4c4c4c"
								},
								"notice": {
									"color": "#4c4c4c"
								},
								"currency": {
									"color": "#4c4c4c"
								},
								"close": {
									"color": "#4c4c4c",
									":hover": {
										"color": "#4c4c4c"
									}
								},
								"empty": {
									"color": "#4c4c4c"
								},
								"noteDescription": {
									"color": "#4c4c4c"
								},
								"discountText": {
									"color": "#4c4c4c"
								},
								"discountIcon": {
									"fill": "#4c4c4c"
								},
								"discountAmount": {
									"color": "#4c4c4c"
								}
							}
						},
						"toggle": {
							"styles": {
								"toggle": {
									"background-color": "#3662d4",
									":hover": {
										"background-color": "#3158bf"
									},
									":focus": {
										"background-color": "#3158bf"
									}
								},
								"count": {
									"font-size": "16px"
								}
							}
						},
						"lineItem": {
							"styles": {
								"variantTitle": {
									"color": "#4c4c4c"
								},
								"title": {
									"color": "#4c4c4c"
								},
								"price": {
									"color": "#4c4c4c"
								},
								"fullPrice": {
									"color": "#4c4c4c"
								},
								"discount": {
									"color": "#4c4c4c"
								},
								"discountIcon": {
									"fill": "#4c4c4c"
								},
								"quantity": {
									"color": "#4c4c4c"
								},
								"quantityIncrement": {
									"color": "#4c4c4c",
									"border-color": "#4c4c4c"
								},
								"quantityDecrement": {
									"color": "#4c4c4c",
									"border-color": "#4c4c4c"
								},
								"quantityInput": {
									"color": "#4c4c4c",
									"border-color": "#4c4c4c"
								}
							}
						}
					},
				});
			});
		}
	})();
/*]]>*/
</script>

Get more of my stickers on [RedBubble](https://www.redbubble.com/people/reverentgeek/portfolio/recent?asc=u)!

[![Buy my stickers on
RedBubble!](/content/images/2018/10/stickers-2018-10.jpg)](https://www.redbubble.com/people/reverentgeek/portfolio/recent?asc=u)

<a name="tshirts"></a>

## T-Shirts!

Get my t-shirts on [Amazon](https://www.amazon.com/s?rh=n%3A7141123011%2Cp_4%3AReverentGeek)!

[![Buy my t-shirts on
Amazon!](/content/images/shop/t-shirts-2021-10.jpg)](https://www.amazon.com/s?rh=n%3A7141123011%2Cp_4%3AReverentGeek)
