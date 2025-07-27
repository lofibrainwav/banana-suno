import dotenv from 'dotenv';
dotenv.config();

function greet(name: string): string {
  return `Hello, ${name}!`;
}

if (require.main === module) {
  console.log(greet('Banana AI'));
}

export { greet };
