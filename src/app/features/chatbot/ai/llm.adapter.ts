export abstract class LlmAdapter { abstract generate(userText: string): Promise<string>; }
