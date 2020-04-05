"use strict";
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = require("graphql");

const category = require('../models/category');
const species = require('../models/species');
const animal = require('../models/animal');

const animalData = [
  {
    id: "1",
    animalName: "Frank",
    species: "1",
  },
  {
    id: "2",
    animalName: "James",
    species: "2",
  },
];

const speciesData = [
  {
    id: "1",
    speciesName: "Cat",
    category: "1",
  },
  {
    id: "2",
    speciesName: "Dog",
    category: "1",
  },
];

const categoryData = [
  {
    id: "1",
    categoryName: "Mammal",
  },
];

const animalType = new GraphQLObjectType({
  name: "animal",
  description: "Animal name and species",
  fields: () => ({
    id: { type: GraphQLID },
    animalName: { type: GraphQLString },
    species: {
      type: speciesType,
      resolve(parent, args) {
        return speciesData.find((species) => species.id === parent.id);
      },
    },
  }),
});

const speciesType = new GraphQLObjectType({
  name: "species",
  description: "Animal species",
  fields: () => ({
    id: { type: GraphQLID },
    speciesName: { type: GraphQLString },
    category: {
      type: categoryType,
      resolve(parent, args) {
        return categoryData.find((category) => category.id === parent.category);
      },
    },
  }),
});

const categoryType = new GraphQLObjectType({
  name: "category",
  description: "Animal category",
  fields: () => ({
    id: { type: GraphQLID },
    categoryName: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Main query",
  fields: {
    animals: {
      type: new GraphQLList(animalType),
      description: "Get all animals",
      resolve(parent, args) {
        return animalData;
      },
    },
    animal: {
      type: animalType,
      description: "Get single animal",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {

        return animalData.find((animal) => animal.id === args.id);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations...",
  fields: {
    addCategory: {
      type: categoryType,
      description: "Add animal category like Fish, Mammal, etc.",
      args: {
        categoryName: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const newCategory = new category({
          categoryName: args.categoryName,
        });
        return newCategory.save();
      },
    },
    addSpecies: {
      type: speciesType,
      description: "Add animal species like cat, dog, etc.",
      args: {
        speciesName: { type: new GraphQLNonNull(GraphQLString) },
        categoryId: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(parent, args) {
        /*const newSpecies = new species({
          speciesName: args.speciesName,
          category: args.categoryId,
        });*/
        const newSpecies = new species(args);
        return newSpecies.save();
      },
    },
    addAnimal: {
      type: animalType,
      description: "Add animal names",
      args: {
        animalName: { type: new GraphQLNonNull(GraphQLString) },
        species: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(parent, args) {
        const newAnimal = new animal(args);
        return newAnimal.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
