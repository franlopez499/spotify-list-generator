/**
 * Register each api
 * import private server methods and server publications
 */

// users api
import '../../api/users/publications.js';
import '../../api/users/hooks.js';

// counters api (example)
import '../../api/counters/methods.js';
import '../../api/counters/publications.js';

// import another api
import '../../api/points/points.js';
import '../../api/spotify/spotify.js';
import '../../api/images/images.js';