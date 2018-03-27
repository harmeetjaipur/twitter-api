const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: 'ENTER APP KEY',
  consumer_secret: 'ENTER APP KEY',
  access_token_key: 'ENTER APP KEY',
  access_token_secret: 'ENTER APP KEY',
});

const params = { screen_name: 'elonmusk' };
client.get('followers/ids', params, function(
  error,
  followers_result,
  response
) {
  if (error) {
    console.log(error);
  } else {
    // Get a list of all followers
    const followers = followers_result.ids;
    client.get('friends/ids', params, function(
      error,
      following_results,
      response
    ) {
      if (error) console.log(error);

      // Get a list of all following
      const following = following_results.ids;

      let one_way_following = [];
      let users_to_display = [];

      following.forEach(function(user) {
        if (followers.indexOf(user) < 0) {
          one_way_following.push(user);
        }
      });

      // Twitter allows only 100 user ids for the lookup
      one_way_following = one_way_following.slice(0, 99);

      client.get(
        'users/lookup',
        { user_id: one_way_following.join() },
        function(error, user_results, response) {
          // Iterate through following, seeing whois not also a follower
          user_results.forEach(function(user) {
            const userObj = {
              name: user.name,
              screen_name: user.screen_name,
              avatar: user.profile_image_url,
            };
            users_to_display.push(userObj);
          });
          console.log(users_to_display);
        }
      );
    });
  }
});
