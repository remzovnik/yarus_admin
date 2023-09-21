export const formatPhoneNumber = (phoneNumberString: string) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? `+${match[1]} ` : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
};

export const decOfNum = (number: number, titles: string[]) => {
  const decCases = [2, 0, 1, 1, 1, 2];
  const index = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
  return titles[index];
};

export const linkifyText = (inputText: string) => {
  let replacedText;

  // URLs starting with http://, https://, or ftp://
  const replacePattern1 = /(\b(https?|ftp):\/\/[-А-ЯЁA-Z0-9+&@#/%?=~_|!:,.;]*[-А-ЯЁA-Z0-9+&@#/%=~_|])/gim;
  replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

  // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  const replacePattern2 = /(^|[^/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a href="https://$2" target="_blank" rel="noopener noreferrer">$2</a>');

  // Change email addresses to mailto:: links.
  const replacePattern3 = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  // Hashtags
  replacedText
    .split(/\s+/)
    .filter((item) => item.startsWith("#"))
    .forEach((item) => {
      const html = `<a class="hashtag-link" href="/hashtag/${item.substring(1)}">${item}</a>`;
      replacedText = replacedText.replace(item, html);
    });

  return replacedText;
};
