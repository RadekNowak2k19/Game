export const generateElements = <E extends keyof HTMLElementTagNameMap>(
	htmlElement: E,
	styleCss: string
) => {
	const HTMLElement = document.createElement(htmlElement);
	HTMLElement.classList.add(styleCss);
	return HTMLElement;
};
