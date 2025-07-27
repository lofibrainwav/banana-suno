import dotenv from 'dotenv';
dotenv.config();

/**
 * Returns a greeting message for the specified name.
 *
 * @param name - The name to include in the greeting
 * @returns A greeting string addressed to the given name
 */
function greet(name: string): string {
  return `Hello, ${name}!`;
}

if (require.main === module) {
  console.log(greet('Banana AI'));
}

export { greet };
