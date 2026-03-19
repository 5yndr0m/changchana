// interface IInboxesDTO {
//   id: number;
//   userID: number;
//   title: string;
//   shortDescription: string;
//   type: "message" | "promotion" | "invitation";
//   coverImage: {
//     url: string;
//     thumbnailUrl: string;
//     mediumUrl: string;
//     smallUrl: string;
//   } | null;
//   readAt: string | null;
//   deletedAt: string | null;
//   publishedAt: string;
// }

const transform = (inbox) => {
  const { notification } = inbox;

  return {
    id: inbox.id,
    notificationID: notification.id,
    userID: inbox.users_permissions_user,
    title: notification.title,
    shortDescription: notification.short_description,
    type: notification.type,
    coverImage: notification.cover_image ? transformImage(notification.cover_image) : null,
    readAt: inbox.read_at,
    deletedAt: inbox.deleted_at,
    publishedAt: inbox.published_at,
  };
};

const transformImage = (image) => {
  const { url, formats } = image;

  return {
    url,
    thumbnailUrl: formats && formats.thumbnail && formats.thumbnail.url,
    mediumUrl: formats && formats.medium && formats.medium.url,
    smallUrl: formats && formats.small && formats.small.url,
  }
};

module.exports = {
  transform,
};
