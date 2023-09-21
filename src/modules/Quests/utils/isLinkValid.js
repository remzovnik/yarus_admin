export default (link) => {
  const template = /^(https?:\/\/)[a-zа-я0-9]+([-.]{1}[a-zа-я0-9]+)*\.[a-zа-я]{2,9}(:[0-9]{1,5})?(\/.*)?$/;

  return link.match(template);
};
