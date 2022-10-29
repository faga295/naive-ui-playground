export function utoa(data: string): string {
    return btoa(unescape(encodeURIComponent(data)))
  }
  
  export function atou(base64: string): string {
    return decodeURIComponent(escape(atob(base64)))
  }