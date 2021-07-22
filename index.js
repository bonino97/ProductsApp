const {gql, ApolloServer} = require('apollo-server');

// Schemas

const typeDefs = gql(`
    
    type Course {
        title: String
        tech: String
    }

    type Query {
        getCourses: Course
    }
`);

const courses = [
    {
        title: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
        tech: 'JavaScript ES6',
    },
    {
        title: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
        tech: 'React',
    },
    {
        title: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
        tech: 'Node.js'
    }, 
    {
        title: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
        tech: 'React'
    }
];

const resolvers = {
    Query: {
        getCourses: () => courses
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers
});


server.listen().then(({url}) => {
    console.log(` Server Running on: ${url}`);
});