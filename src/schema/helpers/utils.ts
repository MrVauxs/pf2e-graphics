/**
 * Reasonably accurately pluralises words.
 * @privateRemarks Duplicated from `scripts/` to avoid circular dependencies, since this is also being run in a browser, Spappz.
 * @privateRemarks Spappz doesn't like this wasteful code inefficiency; please picture him folding his arms and harrumphing.
 * @param word The word to possibly pluralise.
 * @param count Triggers pluralisation when not equal to 1.
 * @returns The word pluralised or not accordingly.
 */
export function pluralise(word: string, count: number): string {
	if (count === 1) return word;
	if (word.endsWith('s')) return `${word}es`;
	// if (word.endsWith('y')) return `${word.slice(0, -1)}ies`;
	return `${word}s`;
}
