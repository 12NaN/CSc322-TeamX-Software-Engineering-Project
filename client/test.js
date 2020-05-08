const client = stream.connect('jy2fmqkf5w9k', null, '77256');

// For the feed group 'user' and user id 'eric' get the feed
// The user token is generated server-side for this user
const ericFeed = client.feed('user', 'eric', 'lBIoIneMdsBUMLq2ALVR204hIrE');

// Add the activity to the feed
ericFeed.addActivity({
  actor: 'eric', 
  tweet: 'Hello world', 
  verb: 'tweet', 
  object: 1
});