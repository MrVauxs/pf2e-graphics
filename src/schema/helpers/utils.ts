/**
 * Reasonably accurately pluralises words.
 * Copied from root scripts due to circular dependencies since this is also being ran in browser Spappz.
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
