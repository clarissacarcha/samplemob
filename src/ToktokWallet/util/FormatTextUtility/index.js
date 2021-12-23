

export class FormatTextUtility {
    static removeSpecialCharacters = (string)=> {
        const finalString = string.replace(/[^a-zA-Z0-9 .]/, '')
        return finalString
    }

    static escapeHtml = (unsafe) => {
        return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    }
}