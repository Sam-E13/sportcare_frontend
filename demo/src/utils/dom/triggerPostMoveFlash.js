import { unRef } from "./unRef";

// Constants for animation durations
const TRANSITION_DURATION = 500; // in ms
const FLASH_DURATION = 100; // in ms

/**
 * Triggers a flash animation on an element, temporarily changing its background color.
 * 
 * @param {HTMLElement | Ref<HTMLElement>} el - The element or a reactive reference to the element to apply the flash effect.
 */
export function triggerPostMoveFlash(el) {
    const element = unRef(el);

    if (!(element instanceof HTMLElement)) {
        console.error("Invalid element provided to triggerPostMoveFlash. Expected an HTMLElement Or RefObject but received:", element);
        return;
    }

    const originalBackground = window.getComputedStyle(element).backgroundColor;

    element.style.transition = `background-color ${TRANSITION_DURATION}ms ease-out`;

    element.style.backgroundColor = `rgb(var(--colors-primary-500) / 0.8)`;

    setTimeout(() => {
        element.style.backgroundColor = originalBackground;

        setTimeout(() => {
            element.style.transition = '';
        }, TRANSITION_DURATION);
    }, FLASH_DURATION);
}
