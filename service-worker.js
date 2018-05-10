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

self.addEventListener('push', function(event) { 
  debugger
  try {
    console.log('Event from push testing',event);
    var title = 'Yay a message.';  
    var body = 'We have received a push message.';  
    var icon = '/images/smiley.svg';  
    var tag = 'simple-push-example-tag';
    event.waitUntil(  
      self.registration.showNotification(title, {  
        body: body,  
        icon: icon,  
        tag: tag  
      })  
    );  
  } catch (er) {
    console.log(er);
  }
});

self.addEventListener('install', function(event) {
  debugger
  console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
  debugger
  console.log('Service Worker activating.');  
});


