// lib/run-command.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface CommandResult {
    stdout: string;
    stderr: string;
}

/**
 * Executes a shell command and returns its stdout and stderr.
 * @param {string} command The command to execute.
 * @returns {Promise<CommandResult>} A promise that resolves with the command's output.
 */
export async function runTerminalCommand(command: string): Promise<CommandResult> {
    try {
        const { stdout, stderr } = await execAsync(command);
        return { stdout, stderr };
    } catch (error: any) {
        // exec throws an error for non-zero exit codes, which includes stderr output for git sometimes
        // We capture it here and return it as part of the result object
        return {
            stdout: error.stdout || '',
            stderr: error.stderr || error.message,
        };
    }
}
