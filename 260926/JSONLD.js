// Inline JSDoc specs provide autocomplete and LSP guidance
/**
 * @typedef {Object<string, any>} CompactNodeObject
 * @property {Array<CompactNodeObject | string>} [children]
 */

/**
 * Recursively converts structured JSON schema nodes into native browser DOM elements.
 *
 * @param {CompactNodeObject | string} nodeData - Structured node object or text primitive.
 * @returns {Node} Instantiated HTML element or DOM TextNode.
 */
export function parseCompactJSONToDOM(nodeData) {
    if (typeof nodeData === 'string') {
        return document.createTextNode(nodeData);
    }

    const tagKey = Object.keys(nodeData).find((key) => key !== 'children');
    if (!tagKey) {
        throw new Error('Invalid schema node: missing HTML tag key definition.');
    }

    /** @type {HTMLElement} */
    const element = document.createElement(tagKey);
    const attributes = nodeData[tagKey] || {};

    Object.entries(attributes).forEach(([attrKey, attrValue]) => {
        if (attrKey === 'disabled' && attrValue === 'true') {
            element.setAttribute('disabled', '');
        } else {
            element.setAttribute(attrKey, attrValue);
        }
    });

    if (Array.isArray(nodeData.children)) {
        nodeData.children.forEach((childData) => {
            const childNode = parseCompactJSONToDOM(childData);
            element.appendChild(childNode);
        });
    }

    return element;
}

/**
 * Main application bootstrapper[cite: 1].
 * Resolves resources based on target document identity ('index'), loads assets, builds DOM, and mounts UI[cite: 1].
 *
 * @param {string} targetName - Base name identifier for target asset set (defaults to 'index').
 */
export async function bootstrapApplication(targetName = 'index') {
    try {
        // Step 1: Fetch the target JSON-LD schema file[cite: 1]
        const jsonLdUrl = `./${targetName}.jsonld`;
        const response = await fetch(jsonLdUrl);
        if (!response.ok) {
            throw new Error(`HTTP error fetching JSON-LD! Status: ${response.status}`);
        }

        const schema = await response.json();

        // Step 2: Hydrate dynamic CSS asset if defined in schema or exists
        if (schema.dependencies?.css) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = schema.dependencies.css;
            document.head.appendChild(link);
        }

        // Step 3: Build native DOM tree and mount to document.body[cite: 1]
        if (schema.ui) {
            const rootNode = parseCompactJSONToDOM(schema.ui);
            document.body.appendChild(rootNode);
        }

        // Step 4: Dynamically load and initialize execution logic JS file
        if (schema.dependencies?.js) {
            const appModule = await import(schema.dependencies.js);
            if (typeof appModule.initApp === 'function') {
                appModule.initApp();
            }
        }
    } catch (err) {
        console.error('Error in JSONLD interpreter execution:', err);
    }
}

// Check document readystate and bind initialization lifecycle[cite: 1]
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bootstrapApplication('index'));
} else {
    bootstrapApplication('index');
}
