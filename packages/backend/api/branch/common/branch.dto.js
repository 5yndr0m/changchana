const { imageDTO } = require("../../helpers");


const transform = (branch) => {
  const { cover_image, logo, ...data } = branch;

  return {
    ...data,
    cover_image: imageDTO(cover_image),
    logo: imageDTO(logo),
  };
};

module.exports = {
  transform,
};
