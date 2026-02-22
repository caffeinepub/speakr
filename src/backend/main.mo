import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  let userContent = Map.empty<Principal, List.List<Text>>();
  var nextPostId = 0;
  let audioPosts = Map.empty<Text, AudioPost>();
  let favorites = Map.empty<Principal, List.List<Text>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinStorage();
  include MixinAuthorization(accessControlState);

  public type AudioPost = {
    id : Text;
    author : Principal;
    title : Text;
    description : Text;
    audio : Storage.ExternalBlob;
    listens : Nat;
    audioPath : Text;
    replyTo : ?Text;
    kidFriendly : Bool;
  };

  public type UserStatistics = {
    totalUploads : Nat;
    totalListens : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Audio Post Management
  public shared ({ caller }) func addAudioPost(
    title : Text,
    description : Text,
    audio : Storage.ExternalBlob,
    replyTo : ?Text,
    kidFriendly : Bool,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add audio posts");
    };

    let postId = nextPostId.toText();
    nextPostId += 1;

    let newPost : AudioPost = {
      id = postId;
      author = caller;
      title;
      description;
      audio;
      listens = 0;
      audioPath = "";
      replyTo;
      kidFriendly;
    };

    audioPosts.add(postId, newPost);

    let existingUserPosts = userContent.get(caller);
    let updatedList = switch (existingUserPosts) {
      case (?list) { list };
      case (null) { List.empty<Text>() };
    };
    updatedList.add(postId);
    userContent.add(caller, updatedList);

    postId;
  };

  public query func getKidFriendlyPosts() : async [AudioPost] {
    let filteredPosts = List.empty<AudioPost>();

    for (post in audioPosts.values()) {
      if (post.kidFriendly) {
        filteredPosts.add(post);
      };
    };

    filteredPosts.reverse().toArray();
  };

  public shared ({ caller }) func addToFavorites(postId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };
    if (audioPosts.get(postId) == null) {
      Runtime.trap("Audio post not found");
    };

    let userFavorites = switch (favorites.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?posts) { posts };
    };

    if (userFavorites.any(func(favId) { favId == postId })) {
      Runtime.trap("Audio post already favorited");
    };

    userFavorites.add(postId);
    favorites.add(caller, userFavorites);
  };

  public shared ({ caller }) func removeFromFavorites(postId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };

    switch (favorites.get(caller)) {
      case (null) { () };
      case (?posts) {
        let updatedList = posts.filter(func(id) { id != postId });
        favorites.add(caller, updatedList);
      };
    };
  };

  public shared ({ caller }) func editAudioPost(postId : Text, title : Text, description : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can edit audio posts");
    };

    switch (audioPosts.get(postId)) {
      case (null) { Runtime.trap("Audio post not found") };
      case (?post) {
        if (post.author != caller) {
          Runtime.trap("Unauthorized: Only the author can edit this post");
        };
        let updatedPost : AudioPost = {
          post with
          title;
          description;
        };
        audioPosts.add(postId, updatedPost);
        true;
      };
    };
  };

  public shared ({ caller }) func removeAudioPost(postId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove audio posts");
    };

    switch (audioPosts.get(postId)) {
      case (null) { Runtime.trap("Audio post not found") };
      case (?post) {
        if (post.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the author or an admin can remove this post");
        };

        // Remove post from audioPosts map
        audioPosts.remove(postId);

        // Remove post from the author's content list (not the caller's if admin is deleting)
        switch (userContent.get(post.author)) {
          case (null) { Runtime.trap("Failed to update user content") };
          case (?postIds) {
            let updatedList = postIds.filter(func(id) { id != postId });
            userContent.add(post.author, updatedList);
          };
        };
        true;
      };
    };
  };

  public query func getAudioPost(postId : Text) : async ?AudioPost {
    audioPosts.get(postId);
  };

  public shared ({ caller }) func getMyContent() : async [AudioPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their content");
    };

    let myPosts = switch (userContent.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?posts) { posts };
    };

    myPosts.reverse().toArray().map(
      func(postId) {
        switch (audioPosts.get(postId)) {
          case (null) { Runtime.trap("Audio post not found. This should never happen.") };
          case (?post) { post };
        };
      }
    );
  };

  public shared ({ caller }) func getFavoritePosts() : async [AudioPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("This is only available for authenticated users. Please sign in and try again.");
    };

    let favoritePostIds = switch (favorites.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?posts) { posts };
    };

    favoritePostIds.reverse().toArray().map(
      func(postId) {
        switch (audioPosts.get(postId)) {
          case (null) { Runtime.trap("Audio post not found. This should never happen.") };
          case (?post) { post };
        };
      }
    );
  };

  public shared func listenToAudioPost(postId : Text) : async () {
    switch (audioPosts.get(postId)) {
      case (null) { Runtime.trap("Audio post not found") };
      case (?post) {
        let updatedPost : AudioPost = {
          post with listens = post.listens + 1;
        };
        audioPosts.add(postId, updatedPost);
      };
    };
  };

  public shared ({ caller }) func getUserStatistics() : async UserStatistics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view statistics");
    };

    let myPosts = switch (userContent.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?posts) { posts };
    };

    var totalUploads = myPosts.size();
    var totalListens = 0;

    myPosts.values().forEach(func(postId) {
      switch (audioPosts.get(postId)) {
        case (null) { Runtime.trap("Audio post not found. This should never happen.") };
        case (?post) { totalListens += post.listens };
      };
    });

    {
      totalUploads;
      totalListens;
    };
  };

  public query func getAudioBlob(id : Text) : async ?Storage.ExternalBlob {
    switch (audioPosts.get(id)) {
      case (null) { Runtime.trap("Audio post not found") };
      case (?post) { ?post.audio };
    };
  };
};
