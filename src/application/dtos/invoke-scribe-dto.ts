export interface InvokeScribeDto {
  /**
   * The unique identifier of the Scribe to invoke
   */
  scribeId: string;

  /**
   * Optional session ID if this invocation should be part of an existing session
   */
  sessionId?: string;

  /**
   * The command or instruction to execute
   */
  command?: string;

  /**
   * Optional key-value pairs providing additional context for the invocation
   */
  context?: Record<string, any>;
}
