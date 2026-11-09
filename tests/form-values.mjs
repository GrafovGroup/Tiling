export const decodeFormText = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'");
export function formValue(html, name) {
  const input = html.match(new RegExp('<input[^>]*name="'+name+'"[^>]*>'))?.[0];
  if (input) return decodeFormText(input.match(/value="([^"]*)"/)?.[1] || '');
  const select = html.match(new RegExp('<select[^>]*name="'+name+'"[^>]*>([\\s\\S]*?)</select>'))?.[1];
  if (select) {
    const option = [...select.matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/g)].find(m=>/\bselected(?:=|\s|$)/.test(m[1]));
    return decodeFormText(option?.[1].match(/value="([^"]*)"/)?.[1] ?? option?.[2] ?? '');
  }
  return '';
}
