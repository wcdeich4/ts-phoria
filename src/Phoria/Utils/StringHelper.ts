export abstract class StringHelper
{
    /**
     * true if input is undefined, null or only whitespace characters, else false
     * @param {string} input 
     */
    public static isUndefinedOrNullOrEmptyOrWhitespace(input: string): boolean
    {
        return (typeof input === "undefined") || (input === null) || (input.trim().length === 0);
    }
}