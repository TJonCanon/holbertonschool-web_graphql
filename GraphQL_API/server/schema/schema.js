// graphql application for project/task organization
// many comments are relics of local storage
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
const _ = require('lodash');
const Task = require('../models/task');
const Project = require('../models/project');

// defines tasks for graphql
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent, args) {
        // return _.find(projects, { id: parent.projectId });
        return Project.findById(parent.projectId);
      },
    },
  }),
});

// defines projects for graphql
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        // return _.filter(tasks, { projectId: parent.id });
        return Task.findById({ projectId: parent.id });
      },
    },
  }),
});

// defines default RootQuery for graphql
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    task: {
      type: TaskType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // return _.find(tasks, { id: args.id });
        return Task.findById(args.id);
      },
    },
    project: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // return _.find(projects, { id: args.id });
        return Project.findById(args.id);
      },
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        // return tasks;
        return Task.find({});
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        // return projects;
        return Project.find({});
      },
    },
  }),
});

