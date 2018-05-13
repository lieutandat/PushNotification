// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Register Service Worker

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(function(registration) {
    // Registration was successful
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

// Setup Push notifications

var pushButton = document.querySelector('.js-push-button');
pushButton.addEventListener('click', subscribe);

function subscribe() {
  // Disable the button so it can't be changed while  
  // we process the permission request  
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({ 
	userVisibleOnly: true ,
	applicationServerKey: urlBase64ToUint8Array(
        'BJf95aa2aag61InR3IHInwMWhH0p2dw4NuSmgXJ7zCoMdSsAUlSyqYJX9HNbWhJDaNB3ycEhcOJlYoszw-4MhsE'
      )
	})
      .then(function(subscription) {
        // The subscription was successful  
        isPushEnabled = true;
        pushButton.textContent = 'Disable Push Messages';
        pushButton.disabled = false;
		var json = JSON.stringify(subscription);
		console.log('Subcripttion', json);
		document.getElementById("p256dh").innerText = JSON.parse(json).keys.p256dh;
		document.getElementById("auth").innerText = JSON.parse(json).keys.auth;
		document.getElementById("endpoint").innerText = JSON.parse(json).endpoint;
        // TODO: Send the subscription.endpoint to your server  
        // and save it to send a push message at a later date
        // return sendSubscriptionToServer(subscription);
      })
      .catch(function(e) {
        if(Notification.permission === 'denied') {
          // The user denied the notification permission which  
          // means we failed to subscribe and the user will need  
          // to manually change the notification permission to  
          // subscribe to push messages  
          console.log('Permission for Notifications was denied');
          pushButton.disabled = true;
		  document.getElementById("result").innerText = 'Permission for Notifications was denied';
        } else {
          // A problem occurred with the subscription; common reasons  
          // include network errors, and lacking gcm_sender_id and/or  
          // gcm_user_visible_only in the manifest.  
          console.log('Unable to subscribe to push.', e);
          pushButton.disabled = false;
		   document.getElementById("result").innerText = 'Unable to subscribe to push.';
          pushButton.textContent = 'Enable Push Messages';
        }
      });
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  ;
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
