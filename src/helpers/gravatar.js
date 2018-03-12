import md5 from 'md5';

export default function createGravatarLink(email, size = 40) {
  return `https://gravatar.com/avatar/${md5(email)}.jpg?size=${size * 2}&d=identicon`;
}
