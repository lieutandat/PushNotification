/**
 * /* eslint-disable no-console
 *
 * @format
 */

/**
 * WARNING: DO NOT USE ES2015+ OR COMMONJS. This file is served as-is and isn't
 * transpiled by Babel or bundled by Webpack.
 */

/* eslint-disable */
'use strict';
/* eslint-enable */

var queuedMessages = [];

/**
 *  We want to make sure that if the service worker gets updated that we
 *  immediately claim it, to ensure we're not running stale versions of the worker
 *	See: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
 **/
self.addEventListener( 'install', function( event ) {
	console.log('install');
	event.waitUntil( self.skipWaiting() );
} );

self.addEventListener( 'activate', function( event ) {
	console.log('activate');
	event.waitUntil( self.clients.claim() );
} );

self.addEventListener( 'notificationclick', function( event ) {
	console.log('notificationclick');
	var notification = event.notification;
	notification.close();

	event.waitUntil(
		self.clients.matchAll().then( function( clientList ) {
			if ( clientList.length > 0 ) {
				clientList[ 0 ].postMessage( { action: 'openPanel' } );
				clientList[ 0 ].postMessage( { action: 'trackClick', notification: notification.data } );
				try {
					clientList[ 0 ].focus();
				} catch ( err ) {
					// Client didn't need focus
				}
			} else {
				queuedMessages.push( { action: 'openPanel' } );
				queuedMessages.push( { action: 'trackClick', notification: notification.data } );
				self.clients.openWindow( '/' );
			}
		} )
	);
} );

self.addEventListener( 'message', function( event ) {
	console.log('message');
	if ( ! ( 'action' in event.data ) ) {
		return;
	}

	switch ( event.data.action ) {
		case 'sendQueuedMessages':
			self.clients.matchAll().then( function( clientList ) {
				var queuedMessage;

				if ( clientList.length > 0 ) {
					queuedMessage = queuedMessages.shift();
					while ( queuedMessage ) {
						clientList[ 0 ].postMessage( queuedMessage );
						queuedMessage = queuedMessages.shift();
					}
				}
			} );
			break;
	}
} );


self.addEventListener('push', function(event) {
	console.log('push');
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  var data = {};
  if (event.data) {
    data = event.data.json();
  }
  var title = data.title || "Something Has Happened";
  var message = data.message || "Here's something you might want to check out.";
  var icon = "images/new-notification.png";

  var notification = new self.Notification(title, {
    body: message,
    tag: 'simple-push-demo-notification',
    icon: icon
  });

  notification.addEventListener('click', function() {
    if (clients.openWindow) {
      clients.openWindow('https://example.blog.com/2015/03/04/something-new.html');
    }
  });
});

