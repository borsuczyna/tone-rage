import type { CommandSnippet } from '@shared/Models/CommandSnippet';

/**
 * Service for managing command snippets
 */
export default class CommandSnippetService {
    private static snippets: CommandSnippet[] = [];

    /**
     * Register a command snippet
     */
    public static registerSnippet(snippet: CommandSnippet): void {
        this.snippets.push(snippet);
    }

    /**
     * Register multiple command snippets
     */
    public static registerSnippets(snippets: CommandSnippet[]): void {
        this.snippets.push(...snippets);
    }

    /**
     * Get all registered snippets
     */
    public static getSnippets(): CommandSnippet[] {
        return this.snippets;
    }

    /**
     * Find snippets matching a partial command
     */
    public static findMatchingSnippets(partial: string): CommandSnippet[] {
        const command = partial.toLowerCase().replace(/^\//, '');
        
        if (!command) {
            return this.snippets;
        }

        return this.snippets.filter(snippet => 
            snippet.command.toLowerCase().startsWith(command)
        );
    }

    /**
     * Find exact snippet by command name
     */
    public static findSnippet(command: string): CommandSnippet | undefined {
        const cleanCommand = command.toLowerCase().replace(/^\//, '');
        return this.snippets.find(snippet => 
            snippet.command.toLowerCase() === cleanCommand
        );
    }

    /**
     * Clear all registered snippets
     */
    public static clear(): void {
        this.snippets = [];
    }
}
