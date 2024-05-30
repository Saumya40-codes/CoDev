export const templates = {
    html : 
        `<html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Your Page</title>
        </head>
        <body>
            <h1>Hello, world!</h1>
        </body>
        </html>`,

    cssTemplate : `/* Add your styles here */
    body {
        background-color: #f0f0f0;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
    h1 {
        color: #333;
        text-align: center;
        font-size: 3rem;
    }`,

    javascript : `// Add your JavaScript here
    console.log('Hello, world!');`,
    
    java : 
    `// Add your Java code here
    public class Main {
        public static void main(String[] args) {
            System.out.println("Hello, world!");
        }
    }`,
    python: `# Add your Python code here
    print('Hello, world!')`,
}