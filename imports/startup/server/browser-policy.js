/**
 * Browser Policy
 * Set security-related policies to be enforced by newer browsers.
 * These policies help prevent and mitigate common attacks like
 * cross-site scripting and clickjacking.
 * 
 * 
 * 


meteor remove browser-policy
                                              
Changes to your project's package version selections:
                                              
browser-policy          removed from your project
browser-policy-common   removed from your project
browser-policy-content  removed from your project
browser-policy-framing  removed from your project

browser-policy: removed dependency       
 */

import { BrowserPolicy } from 'meteor/browser-policy-common';

/**
 * allowed images
 */
BrowserPolicy.content.allowImageOrigin('*');
BrowserPolicy.content.allowScriptOrigin('*');
BrowserPolicy.content.allowStyleOrigin('*');


//const allowImageOrigin = ['via.placeholder.com', ''];
//allowImageOrigin.forEach(o => BrowserPolicy.content.allowImageOrigin(o));

/**
 * allowed scripts
 */
// const allowScriptOrigin = [''];
// allowScriptOrigin.forEach(o => BrowserPolicy.content.allowScriptOrigin(o));

/**
 * allowed styles
 */
// const allowStyleOrigin = [''];
// allowStyleOrigin.forEach(o => BrowserPolicy.content.allowStyleOrigin(o));
