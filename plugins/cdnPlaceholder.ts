export type CdnPlaceholderParams = {
    width?: number;
    height?: number;
    fill?: string;
    textFill?: string;
};

/**
 * Generates a placeholder image URL using the placehold.co service.
 *
 * @param {string} text - The text to display on the placeholder image.
 * @param {CdnPlaceholderParams} params - The optional parameters for customizing the placeholder.
 * @param {number} [params.width] - The width of the image.
 * @param {number} [params.height] - The height of the image.
 * @param {string} [params.fill] - The background color in hex format (e.g., "018C81").
 * @param {string} [params.textFill] - The text color in hex format (e.g., "FFFFFF").
 * @returns {string} The generated placeholder image URL.
 * @example
 * const placeholder = cdnPlaceholder('Hello', { width: 400, height: 300, fill: '018C81', textFill: 'FFFFFF' });
 * console.log(placeholder); // Output: "https://placehold.co/400x300/018C81/FFFFFF?text=Hello"
 */
const cdnPlaceholder = (text: string, params: CdnPlaceholderParams = {}): string => {
    const cdnService = "https://placehold.co/";
    const cdnParamsArray: string[] = [];

    if (params.width && params.height) {
        cdnParamsArray.push(`${params.width}x${params.height}`);
    } else if (params.width) {
        cdnParamsArray.push(`${params.width}`);
    } else if (params.height) {
        cdnParamsArray.push(`${params.height}`);
    }

    if (params.fill) cdnParamsArray.push(params.fill);
    if (params.textFill) cdnParamsArray.push(params.textFill);

    return `${cdnService}${cdnParamsArray.join("/")}?text=${encodeURIComponent(text)}`;
};

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('cdnPlaceholder', cdnPlaceholder);
});
