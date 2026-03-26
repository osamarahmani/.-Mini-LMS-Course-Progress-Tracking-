const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');

dotenv.config();

const courses = [
  {
    title: "JavaScript Fundamentals",
    description: "Learn the core concepts of JavaScript from scratch.",
    level: "Beginner",
    chapters: [
      {
        title: "Getting Started",
        order: 1,
        lessons: [
          {
            order: 1,
            title: "What is JavaScript?",
            type: "reading",
            content: `JavaScript is a lightweight, interpreted programming language with first-class functions. It is most well-known as the scripting language for Web pages, but it is also used in many non-browser environments such as Node.js.

JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative programming styles.

Key facts:
- Created by Brendan Eich in 1995
- Standardized as ECMAScript
- Runs in every modern browser
- Can be used on the server with Node.js`,
          },
          {
            order: 2,
            title: "Setting up your environment",
            type: "reading",
            content: `To get started with JavaScript you need very little setup. Here is what you need:

1. A modern browser — Chrome or Firefox are recommended.
2. A code editor — VS Code is the most popular choice.
3. Node.js — Download from nodejs.org.

Once installed, open your browser, press F12 to open DevTools, and click the Console tab.`,
          },
          {
            order: 3,
            title: "Quiz: JS Basics",
            type: "quiz",
            content: "Test your foundational knowledge of JavaScript.",
            quiz: {
              question: "Which keyword declares a block-scoped variable in JavaScript?",
              options: ["var", "let", "function", "class"],
              correct: 1,
            },
          },
        ],
      },
      {
        title: "Data Types & Variables",
        order: 2,
        lessons: [
          {
            order: 1,
            title: "Primitive types",
            type: "reading",
            content: `JavaScript has 7 primitive data types:

1. String — text values like "hello"
2. Number — integers and decimals like 42 or 3.14
3. Boolean — true or false
4. Undefined — a variable declared but not assigned
5. Null — intentional absence of value
6. BigInt — very large integers
7. Symbol — unique identifiers`,
          },
          {
            order: 2,
            title: "Type coercion",
            type: "reading",
            content: `Type coercion is JavaScript automatically converting one type to another.

Example:
"5" + 1 = "51"   (number converted to string)
"5" - 1 = 4      (string converted to number)

Always use === instead of == to avoid unexpected type conversions.`,
          },
          {
            order: 3,
            title: "Quiz: Types",
            type: "quiz",
            content: "Check your understanding of the JS type system.",
            quiz: {
              question: "What does typeof null return in JavaScript?",
              options: ["'null'", "'undefined'", "'object'", "'boolean'"],
              correct: 2,
            },
          },
        ],
      },
    ],
  },
  {
    title: "React from Zero",
    description: "Build modern UIs with React step by step.",
    level: "Intermediate",
    chapters: [
      {
        title: "React Concepts",
        order: 1,
        lessons: [
          {
            order: 1,
            title: "The Virtual DOM",
            type: "reading",
            content: `The Virtual DOM is a lightweight copy of the real DOM kept in memory by React.

When your component's state changes:
1. React creates a new Virtual DOM tree
2. Compares it with the previous one (diffing)
3. Calculates the minimum changes needed
4. Updates only those parts in the real DOM`,
          },
          {
            order: 2,
            title: "JSX Syntax",
            type: "reading",
            content: `JSX stands for JavaScript XML. It lets you write HTML-like syntax inside JavaScript.

Example:
const element = <h1>Hello, world!</h1>;

Key rules:
- Every JSX element must be closed
- Use className instead of class
- Use camelCase for attributes
- Wrap multiple elements in a single parent`,
          },
          {
            order: 3,
            title: "Quiz: React Basics",
            type: "quiz",
            content: "Test your React fundamentals.",
            quiz: {
              question: "What does JSX compile down to?",
              options: [
                "HTML strings",
                "React.createElement() calls",
                "JSON objects",
                "CSS classes",
              ],
              correct: 1,
            },
          },
        ],
      },
      {
        title: "Components & Props",
        order: 2,
        lessons: [
          {
            order: 1,
            title: "Functional components",
            type: "reading",
            content: `A functional component is just a JavaScript function that returns JSX.

Example:
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

Rules:
- Name must start with a capital letter
- Must return a single root element
- Should be pure`,
          },
          {
            order: 2,
            title: "Passing props",
            type: "reading",
            content: `Props are how you pass data from parent to child component.

Example:
<UserCard name="Alice" age={25} />

Key points:
- Props are read-only
- Any JS value can be a prop
- Use destructuring for cleaner code`,
          },
          {
            order: 3,
            title: "Quiz: Components",
            type: "quiz",
            content: "Test your knowledge of React components.",
            quiz: {
              question: "What is the correct way to pass a number as a prop in JSX?",
              options: [
                '<Card count="5" />',
                "<Card count={5} />",
                "<Card count=5 />",
                "<Card count=(5) />",
              ],
              correct: 1,
            },
          },
        ],
      },
    ],
  },
  {
    title: "Node.js Basics",
    description: "Understand server-side JavaScript with Node.js.",
    level: "Intermediate",
    chapters: [
      {
        title: "Introduction to Node",
        order: 1,
        lessons: [
          {
            order: 1,
            title: "What is Node.js?",
            type: "reading",
            content: `Node.js is a JavaScript runtime built on Chrome's V8 engine.

What Node.js is great for:
- REST APIs and web servers
- Real-time applications
- Command line tools
- File system operations`,
          },
          {
            order: 2,
            title: "Node vs Browser",
            type: "reading",
            content: `Browser:
- Has access to the DOM
- Has window, document objects
- Sandboxed for security

Node.js:
- No DOM or window object
- Has access to the file system
- Has built-in modules like fs, path, http`,
          },
          {
            order: 3,
            title: "Quiz: Node Intro",
            type: "quiz",
            content: "Test your Node.js knowledge.",
            quiz: {
              question: "Which JavaScript engine does Node.js use?",
              options: ["SpiderMonkey", "Chakra", "V8", "JavaScriptCore"],
              correct: 2,
            },
          },
        ],
      },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected!');

    // Clear existing courses
    await Course.deleteMany();
    console.log('Existing courses cleared!');

    // Insert new courses
    await Course.insertMany(courses);
    console.log('Courses seeded successfully!');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();