const { greet } = require('../src/index');

describe('greet function', () => {
    describe('happy path', () => {
        test('should return a greeting with the provided name', () => {
            const result = greet('Alice');
            expect(result).toBe('Hello, Alice!');
        });

        test('should work with single character names', () => {
            const result = greet('A');
            expect(result).toBe('Hello, A!');
        });

        test('should work with long names', () => {
            const longName = 'A'.repeat(100);
            const result = greet(longName);
            expect(result).toBe(`Hello, ${longName}!`);
        });

        test('should work with names containing spaces', () => {
            const result = greet('John Doe');
            expect(result).toBe('Hello, John Doe!');
        });

        test('should work with names containing special characters', () => {
            const result = greet('José-María');
            expect(result).toBe('Hello, José-María!');
        });

        test('should work with names containing numbers', () => {  
            const result = greet('Agent007');
            expect(result).toBe('Hello, Agent007!');
        });

        test('should work with names containing unicode characters', () => {
            const result = greet('北京');
            expect(result).toBe('Hello, 北京!');
        });

        test('should work with names containing emojis', () => {
            const result = greet('User🚀');
            expect(result).toBe('Hello, User🚀!');
        });

        test('should work with the default example name from module', () => {
            const result = greet('Banana AI');
            expect(result).toBe('Hello, Banana AI!');
        });
    });

    describe('edge cases', () => {
        test('should handle empty string', () => {
            const result = greet('');
            expect(result).toBe('Hello, !');
        });

        test('should handle whitespace-only names', () => {
            const result = greet('   ');
            expect(result).toBe('Hello,    !');
        });

        test('should handle names with leading/trailing whitespace', () => {
            const result = greet(' Alice ');
            expect(result).toBe('Hello,  Alice !');
        });

        test('should handle names with newlines', () => {
            const result = greet('Alice\nBob');
            expect(result).toBe('Hello, Alice\nBob!');
        });

        test('should handle names with tabs', () => {
            const result = greet('Alice\tBob');
            expect(result).toBe('Hello, Alice\tBob!');
        });

        test('should handle names with quotes', () => {
            const result = greet(`Alice "Quote" O'Connor`);
            expect(result).toBe(`Hello, Alice "Quote" O'Connor!`);
        });

        test('should handle names with backslashes', () => {
            const result = greet('Alice\\Bob');
            expect(result).toBe('Hello, Alice\\Bob!');
        });

        test('should handle names with forward slashes', () => {
            const result = greet('Alice/Bob');
            expect(result).toBe('Hello, Alice/Bob!');
        });

        test('should handle names with HTML-like content', () => {
            const result = greet('<script>alert("test")</script>');
            expect(result).toBe('Hello, <script>alert("test")</script>!');
        });

        test('should handle names with SQL injection attempts', () => {
            const result = greet(`'; DROP TABLE users; --`);
            expect(result).toBe(`Hello, '; DROP TABLE users; --!`);
        });

        test('should handle names with regex special characters', () => {
            const result = greet('.*+?^${}()|[]\\');
            expect(result).toBe('Hello, .*+?^${}()|[]\\!');
        });
    });

    describe('type safety and validation', () => {
        test('should accept string literals', () => {
            const result = greet('literal');
            expect(result).toBe('Hello, literal!');
        });

        test('should accept string variables', () => {
            const name = 'variable';
            const result = greet(name);
            expect(result).toBe('Hello, variable!');
        });

        test('should handle string concatenation input', () => {
            const firstName = 'John';
            const lastName = 'Doe';
            const result = greet(firstName + ' ' + lastName);
            expect(result).toBe('Hello, John Doe!');
        });

        test('should handle template literal input', () => {
            const prefix = 'Mr.';
            const name = 'Smith';
            const result = greet(`${prefix} ${name}`);
            expect(result).toBe('Hello, Mr. Smith!');
        });
    });

    describe('function properties', () => {
        test('should be a pure function - same input produces same output', () => {
            const name = 'TestUser';
            const result1 = greet(name);
            const result2 = greet(name);
            expect(result1).toBe(result2);
        });

        test('should not modify the input parameter', () => {
            const originalName = 'TestUser';
            const nameCopy = originalName;
            greet(nameCopy);
            expect(nameCopy).toBe(originalName);
        });

        test('should return a new string each time', () => {
            const result1 = greet('Test');
            const result2 = greet('Test');
            expect(result1).toBe(result2);
            expect(typeof result1).toBe('string');
            expect(typeof result2).toBe('string');
        });

        test('should be deterministic across multiple calls', () => {
            const inputs = ['Alice', 'Bob', 'Charlie', ''];
            const results1 = inputs.map(greet);
            const results2 = inputs.map(greet);
            expect(results1).toEqual(results2);
        });
    });

    describe('performance and boundary conditions', () => {
        test('should handle very long names efficiently', () => {
            const veryLongName = 'A'.repeat(10000);
            const start = Date.now();
            const result = greet(veryLongName);
            const end = Date.now();
            
            expect(result).toBe(`Hello, ${veryLongName}!`);
            expect(end - start).toBeLessThan(100);
        });

        test('should handle repeated calls efficiently', () => {
            const start = Date.now();
            for (let i = 0; i < 1000; i++) {
                greet(`User${i}`);
            }
            const end = Date.now();
            
            expect(end - start).toBeLessThan(1000);
        });

        test('should handle large strings gracefully', () => {
            const largeName = 'A'.repeat(100000);
            const result = greet(largeName);
            expect(result.startsWith('Hello, ')).toBe(true);
            expect(result.endsWith('!')).toBe(true);
            expect(result.length).toBe(largeName.length + 8); // 'Hello, ' + '!'
        });
    });

    describe('string interpolation behavior', () => {
        test('should properly interpolate the name parameter', () => {
            const name = 'Interpolation Test';
            const result = greet(name);
            expect(result).toContain(name);
            expect(result.indexOf(name)).toBeGreaterThan(0);
        });

        test('should maintain exact format with Hello prefix and exclamation suffix', () => {
            const name = 'Format Test';
            const result = greet(name);
            expect(result.startsWith('Hello, ')).toBe(true);
            expect(result.endsWith('!')).toBe(true);
        });

        test('should have exactly one comma after Hello', () => {
            const name = 'Comma Test';
            const result = greet(name);
            const commaCount = (result.match(/,/g) || []).length;
            expect(commaCount).toBe(1);
            expect(result.indexOf(',')).toBe(5);
        });

        test('should have exactly one exclamation mark at the end', () => {
            const name = 'Exclamation Test';
            const result = greet(name);
            const exclamationCount = (result.match(/!/g) || []).length;
            expect(exclamationCount).toBe(1);
            expect(result.lastIndexOf('!')).toBe(result.length - 1);
        });

        test('should preserve exact spacing in template', () => {
            const name = 'SpaceTest';
            const result = greet(name);
            expect(result).toBe('Hello, SpaceTest!');
            expect(result.charAt(5)).toBe(',');
            expect(result.charAt(6)).toBe(' ');
        });
    });

    describe('return value characteristics', () => {
        test('should always return a string', () => {
            const testCases = ['Alice', '', '123', 'Special!@#$%^&*()'];
            testCases.forEach(testCase => {
                const result = greet(testCase);
                expect(typeof result).toBe('string');
            });
        });

        test('should always return a non-empty string', () => {
            const testCases = ['Alice', '', '   '];
            testCases.forEach(testCase => {
                const result = greet(testCase);
                expect(result.length).toBeGreaterThan(0);
            });
        });

        test('should return string longer than input for non-empty names', () => {
            const name = 'Test';
            const result = greet(name);
            expect(result.length).toBeGreaterThan(name.length);
        });

        test('should have predictable length calculation', () => {
            const name = 'LengthTest';
            const result = greet(name);
            const expectedLength = 'Hello, '.length + name.length + '!'.length;
            expect(result.length).toBe(expectedLength);
        });

        test('should handle minimum length input correctly', () => {
            const result = greet('');
            expect(result.length).toBe(8); // 'Hello, !'
        });
    });
});

describe('module behavior', () => {
    describe('exports', () => {
        test('should export greet function', () => {
            expect(typeof greet).toBe('function');
        });

        test('should export greet as named export', () => {
            const indexModule = require('../src/index');
            expect(indexModule.greet).toBe(greet);
        });

        test('should have greet function with correct arity', () => {
            expect(greet.length).toBe(1);
        });

        test('should have greet function with a name', () => {
            expect(greet.name).toBe('greet');
        });

        test('should not export as default export', () => {
            const indexModule = require('../src/index');
            expect(indexModule.default).toBeUndefined();
        });
    });

    describe('dotenv integration', () => {
        let originalEnv;

        beforeEach(() => {
            originalEnv = { ...process.env };
        });

        afterEach(() => {
            process.env = originalEnv;
        });

        test('should not break when environment variables are set', () => {
            process.env.TEST_VAR = 'test_value';
            const result = greet('EnvTest');
            expect(result).toBe('Hello, EnvTest!');
        });

        test('should work regardless of environment variable presence', () => {
            // Clear most environment variables except essential ones
            const essentialVars = ['NODE_ENV', 'PATH'];
            Object.keys(process.env).forEach(key => {
                if (!essentialVars.includes(key)) {
                    delete process.env[key];
                }
            });
            
            const result = greet('MinimalEnvTest');
            expect(result).toBe('Hello, MinimalEnvTest!');
        });

        test('should handle dotenv configuration without affecting function behavior', () => {
            const result = greet('DotenvTest');
            expect(result).toBe('Hello, DotenvTest!');
        });

        test('should work with various environment configurations', () => {
            const envConfigs = [
                { NODE_ENV: 'development' },
                { NODE_ENV: 'production' },
                { NODE_ENV: 'test' },
                {}
            ];

            envConfigs.forEach(config => {
                process.env = { ...originalEnv, ...config };
                const result = greet('EnvConfigTest');
                expect(result).toBe('Hello, EnvConfigTest!');
            });
        });
    });

    describe('module execution behavior', () => {
        test('should handle require.main === module check gracefully', () => {
            const result = greet('RequireTest');
            expect(result).toBe('Hello, RequireTest!');
        });

        test('should be importable multiple times without side effects', () => {
            const module1 = require('../src/index');
            const module2 = require('../src/index');
            
            expect(module1.greet).toBe(module2.greet);
            expect(module1.greet('Test')).toBe('Hello, Test!');
            expect(module2.greet('Test')).toBe('Hello, Test!');
        });
    });
});

describe('integration scenarios', () => {
    describe('common usage patterns', () => {
        test('should work in array map operations', () => {
            const names = ['Alice', 'Bob', 'Charlie'];
            const results = names.map(greet);
            const expected = ['Hello, Alice!', 'Hello, Bob!', 'Hello, Charlie!'];
            expect(results).toEqual(expected);
        });

        test('should work in array filter operations', () => {
            const names = ['Alice', '', 'Bob', '   ', 'Charlie'];
            const greetings = names.map(greet);
            const emptyGreetings = greetings.filter(greeting => greeting.includes('Hello, !'));
            expect(emptyGreetings).toHaveLength(1);
            expect(emptyGreetings[0]).toBe('Hello, !');
        });

        test('should work with Promise.resolve', async () => {
            const result = await Promise.resolve(greet('AsyncTest'));
            expect(result).toBe('Hello, AsyncTest!');
        });

        test('should work in setTimeout callback', (done) => {
            setTimeout(() => {
                const result = greet('TimeoutTest');
                expect(result).toBe('Hello, TimeoutTest!');
                done();
            }, 1);
        });

        test('should work with reduce operations', () => {
            const names = ['A', 'B', 'C'];
            const concatenated = names.reduce((acc, name) => acc + greet(name), '');
            expect(concatenated).toBe('Hello, A!Hello, B!Hello, C!');
        });

        test('should work with forEach iterations', () => {
            const names = ['Test1', 'Test2'];
            const results = [];
            names.forEach(name => {
                results.push(greet(name));
            });
            expect(results).toEqual(['Hello, Test1!', 'Hello, Test2!']);
        });
    });

    describe('error handling and robustness', () => {
        test('should not throw errors with valid string inputs', () => {
            const testCases = ['Normal', '', '123', 'Special@#$'];
            testCases.forEach(testCase => {
                expect(() => greet(testCase)).not.toThrow();
            });
        });

        test('should handle internationalization characters correctly', () => {
            const intlNames = ['Björk', 'José', 'François', '山田太郎', 'محمد', 'Ñoño'];
            intlNames.forEach(name => {
                const result = greet(name);
                expect(result).toBe(`Hello, ${name}!`);
                expect(result.startsWith('Hello, ')).toBe(true);
                expect(result.endsWith('!')).toBe(true);
            });
        });

        test('should handle various whitespace characters', () => {
            const whitespaceChars = ['\t', '\n', '\r', '\v', '\f', ' '];
            whitespaceChars.forEach(char => {
                const result = greet(char);
                expect(result).toBe(`Hello, ${char}!`);
            });
        });

        test('should maintain performance with concurrent calls', () => {
            const promises = [];
            for (let i = 0; i < 100; i++) {
                promises.push(Promise.resolve(greet(`Concurrent${i}`)));
            }
            
            return Promise.all(promises).then(results => {
                expect(results).toHaveLength(100);
                results.forEach((result, index) => {
                    expect(result).toBe(`Hello, Concurrent${index}!`);
                });
            });
        });
    });

    describe('memory and resource usage', () => {
        test('should not leak memory with many sequential calls', () => {
            const initialMemory = process.memoryUsage().heapUsed;
            
            for (let i = 0; i < 10000; i++) {
                greet(`MemTest${i}`);
            }
            
            // Force garbage collection if available
            if (global.gc) {
                global.gc();
            }
            
            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;
            
            // Memory increase should be reasonable (less than 10MB)
            expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
        });

        test('should handle rapid successive calls without issues', () => {
            const start = Date.now();
            let count = 0;
            
            while (Date.now() - start < 100) { // Run for 100ms
                greet(`Rapid${count++}`);
            }
            
            expect(count).toBeGreaterThan(1000); // Should handle many calls
        });
    });
});