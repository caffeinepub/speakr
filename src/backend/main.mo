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
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  let audioPosts = Map.empty<Text, AudioPost>();
  let userContent = Map.empty<Principal, List.List<Text>>();
  var nextPostId = 0;

  include MixinAuthorization(accessControlState);

  public type AudioPost = {
    id : Text;
    author : Principal;
    title : Text;
    description : Text;
    audio : Storage.ExternalBlob;
    listens : Nat;
    audioPath : Text;
  };

  public type UserStatistics = {
    totalUploads : Nat;
    totalListens : Nat;
  };

  public shared ({ caller }) func addAudioPost(title : Text, description : Text, audio : Storage.ExternalBlob) : async Text {
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
        if (post.author != caller) {
          Runtime.trap("Unauthorized: Only the author can remove this post");
        };

        // Remove post from audioPosts map
        audioPosts.remove(postId);

        // Remove post from user's content list
        switch (userContent.get(caller)) {
          case (null) { Runtime.trap("Failed to update user content") };
          case (?postIds) {
            let updatedList = postIds.filter(func(id) { id != postId });
            userContent.add(caller, updatedList);
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
