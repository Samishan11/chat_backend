import { FriendRequest } from "../../model/friendRequest.model";
import { User } from "../../model/user.model";

export async function getFriendsOfFriendsRecommendations(userId: any) {
  const friendList = await FriendRequest.find({
    $or: [{ requestBy: userId }, { requestTo: userId }],
    isAccepted: true,
  }).exec();

  const friendIds = friendList.map((request) => {
    if (request.requestBy.toString() === userId) {
      return request.requestTo.toString();
    } else {
      return request.requestBy.toString();
    }
  });

  const friendsOfFriends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friendFriendList = await FriendRequest.find({
        $or: [{ requestBy: friendId }, { requestTo: friendId }],
        isAccepted: true,
      }).exec();

      const friendFriendIds = friendFriendList.map((request) => {
        if (request.requestBy.toString() === friendId) {
          return request.requestTo.toString();
        } else {
          return request.requestBy.toString();
        }
      });

      return friendFriendIds;
    })
  );

  const uniqueFriendOfFriendIds = [...new Set(friendsOfFriends.flat())];

  const recommendedFriendIds = uniqueFriendOfFriendIds.filter(
    (id) => !friendIds.includes(id) && id !== userId
  );

  const recommendedFriends = await User.find({
    _id: { $in: recommendedFriendIds },
  });

  return recommendedFriends;
}
